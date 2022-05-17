import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from './three-mesh-bvh.js';
import { ImprovedNoise } from 'https://threejs.org/examples/jsm/math/ImprovedNoise.js';

const worldWidth = 256, worldDepth = 256;

class TerrainController {
    
    constructor(){
        this.loader = new GLTFLoader();
        this.terrain = new THREE.Object3D();
        this.collider;
        this.bloomScene = new THREE.Scene();
        this.geometries = [];
    }

    generateTerrain(scene, seed) {
        const terrainHeights = this.generateHeight( worldWidth, worldDepth , seed);
        
        const geometry = new THREE.PlaneGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );
        
        const vertices = geometry.attributes.position.array;
        for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
            vertices[ j + 1 ] = terrainHeights[ i ] * 10;
        }

        const texture = new THREE.CanvasTexture( this.generateTexture( terrainHeights, worldWidth, worldDepth ) );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const terrainMaterial = new THREE.MeshBasicMaterial( { map: texture } );
        this.terrain = new THREE.Mesh( geometry, terrainMaterial );
        scene.add( this.terrain );

        this.generateCollider(scene)
    }

    generateHeight( width, height , seed) {
        window.Math.random = function () {
            const x = Math.sin( seed ++ ) * 10000;
            return x - Math.floor( x );
        };

        const size = width * height, data = new Uint8Array( size );
        const perlin = new ImprovedNoise(), z = Math.random() * 100;
        let quality = 1;

        for ( let j = 0; j < 4; j ++ ) {
            for ( let i = 0; i < size; i ++ ) {
                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
            }
            quality *= 5;
        }
        return data;
    }

    generateTexture( data, width, height ) {

        let context, image, imageData;

        const canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;

        for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
            imageData[ i ] = 0;
            imageData[ i + 1 ] = 256  * ( 0.5 + data[ j + 1 ] * 0.001 );
            imageData[ i + 2 ] = 0;
        }

        context.putImageData( image, 0, 0 );

        // Scaled 4x

        const canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );

        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;

        for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

            const v = ~ ~ ( Math.random() * 5 );

            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;

        }

        context.putImageData( image, 0, 0 );

        return canvasScaled;

    }

    loadTerrain(URL, scene, x, y, z){
        this.loader.load(URL, (object) => {
            this.terrain = object.scene;
            this.terrain.position.set(x, y, z);
            this.terrain.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.material.roughness = 1;
                    if (object.material.map) {
                        object.material.map.anisotropy = 16;
                        object.material.map.needsUpdate = true;
                    }
                    const cloned = new THREE.Mesh(object.geometry, object.material);
                    object.getWorldPosition(cloned.position);
                    //object.updateMatrixWorld();
                    if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                        /* object.updateMatrixWorld();
                            cloned.matrix.copy(object.matrixWorld);*/
                        this.bloomScene.attach(cloned);
                    }
                }
                if (object.isLight) {
                    object.parent.remove(object);
                }
            });

            scene.add(this.terrain);
            this.generateCollider(scene);
        })
    }

    generateCollider(scene){
        console.log("loading collider")
        this.terrain.traverse(object => {
            if (object.geometry && object.visible) {
                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { cloned.deleteAttribute(key); }
                }
                this.geometries.push(cloned);
            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new THREE.Mesh(mergedGeometry);
        this.collider.material.wireframe = true;
        this.collider.material.opacity = 0.5;
        this.collider.material.transparent = true;
        this.collider.visible = false;
        scene.add(this.collider);

        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // scene.add(visualizer);
    }

    newSolidGeometriesFromSource(scene, url, x, y, z, scaleFactor) {
        this.loader.load(url, (responseObject) => {
            setTimeout(() => {   
                console.log("load new stuff")
                responseObject.scene.scale.set(3.75 * scaleFactor, 3.75 * scaleFactor, 3.75 * scaleFactor)
                responseObject.scene.position.set(x,y,z)
                scene.add(responseObject.scene)
    
                responseObject.scene.traverse((object) => {
                    if(object.geometry && object.visible && object.position) {
                        const cloned = object.geometry.clone();
                        cloned.scale(3.75 * scaleFactor, 3.75 * scaleFactor, 3.75 * scaleFactor)
                        cloned.translate(x, y + (-1 * scaleFactor),z)
                        console.log(object.matrixWorld)
                        object.updateMatrixWorld();
                        cloned.applyMatrix4(object.matrixWorld);
                        for (const key in cloned.attributes) {
                            if (key !== 'position') { cloned.deleteAttribute(key); }
                        }
                        
                        this.geometries.push(cloned);
                    }
                })
                
                this.generateCollider(scene)
            }, 2000);
            
        })
    }
}

export { TerrainController };