import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { ImprovedNoise } from 'https://threejs.org/examples/jsm/math/ImprovedNoise.js';

const worldWidth = 256, worldDepth = 256;

class TerrainGenerator {
    constructor () {}

    terrain(options) {
        var defaultOptions = {
            after: null,
            easing: function(x){return x},
            heightmap: this.diamondSquare,
            material: null,
            maxHeight: 350,
            minHeight: -400,
            optimization: 0,
            frequency: 2.5,
            steps: 8,
            stretch: true,
            turbulent: false,
            useBufferGeometry: false,
            xSegments: 127,
            xSize: 2048,
            ySegments: 127,
            ySize: 2048,
            _mesh: null, // internal only
        };
        options = options || {};
        for (var opt in defaultOptions) {
            if (defaultOptions.hasOwnProperty(opt)) {
                options[opt] = typeof options[opt] === 'undefined' ? defaultOptions[opt] : options[opt];
            }
        }
        options.material = options.material || new THREE.MeshBasicMaterial({ color: 0xee6633 });
    
        const plane = new THREE.PlaneGeometry(options.xSize, options.ySize, options.xSegments, options.ySegments)
        // Planes are initialized on the XY plane, so rotate the plane to make it lie flat.
        plane.rotateX(-Math.PI/2);
    
        // Create the terrain mesh.
        var mesh = new THREE.Mesh(plane, options.material );
    
        // Assign elevation data to the terrain plane from a heightmap or function.
        if (typeof options.heightmap === 'function') {
            options.heightmap(mesh.geometry.attributes.position.array, options);
        }
        else {
            console.warn('An invalid value was passed for `options.heightmap`: ' + options.heightmap);
        }
        this.normalize(mesh, options);
    
        return mesh;
    };

    /**
     * Generate random terrain using the Diamond-Square method.
     *
     * Based on https://github.com/srchea/Terrain-Generation/blob/master/js/classes/TerrainGeneration.js
     *
     * @param {THREE.Vector3[]} positionArray
     *   The vertex array for plane geometry to modify with heightmap data. This
     *   method sets the `z` property of each vertex.
     * @param {Object} options
     *   A map of settings that control how the terrain is constructed and
     *   displayed. Valid values are the same as those for the `options` parameter
     *   of {@link TerrainGenerator.terrain}().
     */
    diamondSquare = function(positionArray, options) {
        // Set the segment length to the smallest power of 2 that is greater than
        // the number of vertices in either dimension of the plane (next power of two)
        var segments = Math.pow(2, Math.ceil(Math.log(Math.max(options.xSegments, options.ySegments) + 1)/Math.log(2)))
    
        // Initialize heightmap
        var size = segments + 1,
            heightmap = [],
            smoothing = 1000,
            i,
            j,
            xLength = options.xSegments + 1,
            yLength = options.ySegments + 1;
        for (i = 0; i <= segments; i++) {
            heightmap[i] = new Float64Array(segments+1);
        }
    
        // Generate heightmap
        for (var l = segments; l >= 2; l /= 2) {
            var half = Math.round(l*0.5),
                whole = Math.round(l),
                x,
                y,
                avg,
                d,
                e;
            smoothing /= 2;
            // square
            for (x = 0; x < segments; x += whole) {
                for (y = 0; y < segments; y += whole) {
                    d = Math.random() * smoothing * 2 - smoothing;
                    avg = heightmap[x][y] +            // top left
                          heightmap[x+whole][y] +      // top right
                          heightmap[x][y+whole] +      // bottom left
                          heightmap[x+whole][y+whole]; // bottom right
                    avg *= 0.25;
                    heightmap[x+half][y+half] = avg + d;
                }
            }
            // diamond
            for (x = 0; x < segments; x += half) {
                for (y = (x+half) % l; y < segments; y += l) {
                    d = Math.random() * smoothing * 2 - smoothing;
                    avg = heightmap[(x-half+size)%size][y] + // middle left
                          heightmap[(x+half)%size][y] +      // middle right
                          heightmap[x][(y+half)%size] +      // middle top
                          heightmap[x][(y-half+size)%size];  // middle bottom
                    avg *= 0.25;
                    avg += d;
                    heightmap[x][y] = avg;
                    // top and right edges
                    if (x === 0) heightmap[segments][y] = avg;
                    if (y === 0) heightmap[x][segments] = avg;
                }
            }
        }
    
        // Apply heightmap
        let index = 1;
        for (i = 0; i < xLength; i++) {
            for (j = 0; j < yLength; j++) {
                positionArray[index] += heightmap[i][j];
                index += 3;
            }
        }
    };

    /**
     * Get a 2D array of heightmap values from a 1D array of plane vertices.
     *
     * @param {THREE.Vector3[]} vertices
     *   A 1D array containing the vertices of the plane geometry representing the
     *   terrain, where the z-value of the vertices represent the terrain's
     *   heightmap.
     * @param {Object} options
     *   A map of settings defining properties of the terrain. The only properties
     *   that matter here are `xSegments` and `ySegments`, which represent how many
     *   vertices wide and deep the terrain plane is, respectively (and therefore
     *   also the dimensions of the returned array).
     *
     * @return {Number[][]}
     *   A 2D array representing the terrain's heightmap.
     */
    toArray2D(vertices, options) {
        var tgt = new Array(options.xSegments + 1),
            xLength = options.xSegments + 1,
            yLength = options.ySegments + 1,
            i, j;
        for (i = 0; i < xLength; i++) {
            tgt[i] = new Float64Array(options.ySegments + 1);
            for (j = 0; j < yLength; j++) {
                tgt[i][j] = vertices[j * xLength + i].z;
            }
        }
        return tgt;
    };

    /**
     * Convert an image-based heightmap into vertex-based height data.
     *
     * @param {THREE.Vector3[]} g
     *   The vertex array for plane geometry to modify with heightmap data. This
     *   method sets the `z` property of each vertex.
     * @param {Object} options
     *   A map of settings that control how the terrain is constructed and
     *   displayed. Valid values are the same as those for the `options` parameter
     *   of {@link TerrainGenerator.terrain}().
     */
    fromHeightmap(g, options) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            rows = options.ySegments + 1,
            cols = options.xSegments + 1,
            spread = options.maxHeight - options.minHeight;
        canvas.width = cols;
        canvas.height = rows;
        context.drawImage(options.heightmap, 0, 0, canvas.width, canvas.height);
        var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                var i = row * cols + col,
                    idx = i * 4;
                g[i].z = (data[idx] + data[idx+1] + data[idx+2]) / 765 * spread + options.minHeight;
            }
        }
    };

    /**
     * Set the height of plane vertices from a 1D array of heightmap values.
     *
     * @param {THREE.Vector3[]} vertices
     *   A 1D array containing the vertices of the plane geometry representing the
     *   terrain, where the z-value of the vertices represent the terrain's
     *   heightmap.
     * @param {Number[]} src
     *   A 1D array representing a heightmap to apply to the terrain.
     */
    fromArray1D(vertices, src) {
        for (var i = 0, l = Math.min(vertices.length, src.length); i < l; i++) {
            vertices[i].z = src[i];
        }
    };

    /**
     * Normalize the terrain after applying a heightmap or filter.
     *
     * This applies turbulence, steps, and height clamping; calls the `after`
     * callback; updates normals and the bounding sphere; and marks vertices as
     * dirty.
     *
     * @param {THREE.Mesh} mesh
     *   The terrain mesh.
     * @param {Object} options
     *   A map of settings that control how the terrain is constructed and
     *   displayed. Valid options are the same as for {@link TerrainGenerator.terrain}().
     */
    normalize(mesh, options) {
        if (options.steps > 1) {
            this.step(mesh.geometry.attributes.position.array, options.steps);
            this.smooth(mesh.geometry.attributes.position.array, options, 1);
        }
        // Keep the terrain within the allotted height range if necessary, and do easing.
        this.clamp(mesh.geometry.attributes.position.array, options);

        // Mark the geometry as having changed and needing updates.
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
    };

    /**
     * Rescale the heightmap of a terrain to keep it within the maximum range.
     *
     * @param {THREE.Vector3[]} g
     *   The vertex array for plane geometry to modify with heightmap data. This
     *   method sets the `z` property of each vertex.
     * @param {Object} options
     *   A map of settings that control how the terrain is constructed and
     *   displayed. Valid values are the same as those for the `options` parameter
     *   of {@link TerrainGenerator.terrain}() but only `maxHeight`, `minHeight`, and `easing`
     *   are used.
     */
    clamp(positionArray, options) {
        var min = Infinity,
            max = -Infinity,
            l = positionArray.length / 3;
        for (i = 0; i < l; i++) {
            if (positionArray[i*3+1] < min) min = positionArray[i*3+1];
            if (positionArray[i*3+1] > 500) positionArray[i*3+1] = 500;
        }
        if(min < 0){
            for (i = 0; i < l; i++) {
                positionArray[i*3+1] -= min
            }
        }
    };

    /**
     * Partition a terrain into flat steps.
     *
     * @param {THREE.Vector3[]} g
     *   The vertex array for plane geometry to modify with heightmap data. This
     *   method sets the `z` property of each vertex.
     * @param {Number} [levels]
     *   The number of steps to divide the terrain into. Defaults to
     *   (g.length/2)^(1/4).
     */
    step(positionArray, levels) {
        // Calculate the max, min, and avg values for each bucket
        var l = positionArray.length / 3,
            inc = Math.floor(l / levels),
            heights = new Array(l),
            buckets = new Array(levels);

        for (i = 0; i < l; i++) {
            heights[i] = positionArray[(i*3)+1];
        }

        
        heights.sort(function(a, b) { return a - b; });
                // console.log(heights)
        for (i = 0; i < levels; i++) {
            // Bucket by population (bucket size) not range size
            var subset = heights.slice(i*inc, (i+1)*inc),
                sum = 0,
                bl = subset.length;
            for (j = 0; j < bl; j++) {
                sum += subset[j];
            }
            buckets[i] = {
                min: subset[0],
                max: subset[subset.length-1],
                avg: sum / bl,
            };
        }
        console.log(buckets)

        // Set the height of each vertex to the average height of its bucket
        for (i = 0; i < l; i++) {
            var startHeight = positionArray[(i*3)+1];
            for (j = 0; j < levels; j++) {
                if (startHeight >= buckets[j].min && startHeight <= buckets[j].max) {
                    positionArray[(i*3)+1] = buckets[j].avg;
                    break;
                }
            }
        }
    };

    /**
     * Smooth the terrain by setting each point to the mean of its neighborhood.
     *
     * @param {THREE.Vector3[]} g
     *   The vertex array for plane geometry to modify with heightmap data. This
     *   method sets the `z` property of each vertex.
     * @param {Object} options
     *   A map of settings that control how the terrain is constructed and
     *   displayed. Valid values are the same as those for the `options` parameter
     *   of {@link TerrainGenerator.terrain}().
     * @param {Number} [weight=0]
     *   How much to weight the original vertex height against the average of its
     *   neighbors.
     */
    smooth(positionArray, options, weight) {
        var heightmap = new Float64Array(positionArray.length);
        for (var i = 0, xLength = options.xSegments + 1, yLength = options.ySegments + 1; i < xLength; i++) {
            for (var j = 0; j < yLength; j++) {
                var sum = 0,
                    c = 0;
                for (var n = -1; n <= 1; n++) {
                    for (var m = -1; m <= 1; m++) {
                        var key = (j+n)*xLength + i + m;
                        if (typeof positionArray[key] !== 'undefined' && i+m >= 0 && j+n >= 0 && i+m < xLength && j+n < yLength) {
                            sum += positionArray[(key*3)+1];
                            c++;
                        }
                    }
                }
                heightmap[j*xLength + i] = sum / c;
            }
        }
        weight = weight || 0;
        var w = 1 / (1 + weight);
        for (var k = 0, l = positionArray.length; k < l; k++) {
            positionArray[k*3+1] = (heightmap[k] + positionArray[k*3+1] * weight) * w;
        }
    };
}
export { TerrainGenerator }