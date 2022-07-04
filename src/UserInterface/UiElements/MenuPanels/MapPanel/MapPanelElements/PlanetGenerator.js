import { ImprovedNoise } from './ImprovedNoise.js';
import { 
    Vector2, Matrix4, ExtrudeGeometry, IcosahedronGeometry, Color, Vector3, Object3D, Shape, 
    BufferAttribute, Mesh, MeshStandardMaterial, DoubleSide, ShaderMaterial, TorusGeometry, 
    InstancedMesh, MeshBasicMaterial, SphereGeometry 
} from 'three';

var seedrandom = require('seedrandom');

// Generate Star Shape - Taken directly from three.js example
const pts2 = [],
    numPts = 5;

for (let i = 0; i < numPts * 2; i++) {

    const l = i % 2 == 1 ? 10 : 20;

    const a = i / numPts * Math.PI;

    pts2.push(new Vector2(Math.cos(a) * l, Math.sin(a) * l));

}
const star = new Shape(pts2);
const starGeometry = new ExtrudeGeometry(star, { depth: 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 });
// Resize and rotate star (as it comes out slightly off-center);
starGeometry.applyMatrix4(new Matrix4().makeRotationZ(Math.PI / 10));
starGeometry.applyMatrix4(new Matrix4().makeScale(0.0075, 0.0075, 0.0075));
let id = 2;
const PlanetGenerator = {
    rng: null, // The Seeded Random Number Generator
    perlin: new ImprovedNoise(), // Lightning-fast perlin noise (30M+ samples per second on modern cpu)
    icosahedron: new IcosahedronGeometry(1, 20), // Large Icosahedron for planets
    smallicosahdron: new IcosahedronGeometry(1, 5), // Small Icosahedron for planets
    star: starGeometry,
    seed(seed) {
        this.rng = seedrandom(seed);
        this.perlin.seed(this.rng);
    },
    pickColor() { // Color picking has a 70% of choosing a tone from a set of primary/secondary colors and a 30% of just generating a random color
        const rng = this.rng;
        let seed = rng();
        if (seed < 0.1) {
            return new Color(0.5 + 0.5 * rng(), rng() / 3, rng() / 3);
        } else if (seed < 0.2) {
            return new Color(rng() / 3, 0.5 + 0.5 * rng(), rng() / 3);
        } else if (seed < 0.3) {
            return new Color(rng() / 3, rng() / 3, 0.5 + 0.5 * rng());
        } else if (seed < 0.4) {
            return new Color(0.5 + 0.5 * rng(), 0.5 + 0.5 * rng(), rng() / 3);
        } else if (seed < 0.5) {
            return new Color(rng() / 3, 0.5 + 0.5 * rng(), 0.5 + 0.5 * rng());
        } else if (seed < 0.6) {
            return new Color(0.5 + 0.5 * rng(), rng() / 3, 0.5 + 0.5 * rng());
        } else if (seed < 0.7) {
            return new Color(0.5 + 0.5 * rng(), 0.5 + 0.5 * rng(), rng() / 3);
        } else {
            return new Color(rng(), rng(), rng());
        }
    },
    generateRing() {
        const rng = this.rng;
        return {
            detail: 1 + 1 * (rng() * rng()),
            size: new Vector3(Math.max(1.4 + 1.2 * (rng() - 0.5), 1.4), Math.max(1.4 + 1.2 * (rng() - 0.5), 1.4), 0.5 * (0.75 + rng() * 0.5)),
            tilt: { // How the ring tilts/moves over time
                x: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, 0.05 + rng() * 0.1, (rng() < 0.25 ? 0 : Math.PI / 2) + rng() * 0.1 - 0.05],
                y: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, 0.05 + rng() * 0.1, rng() * 0.1 - 0.05],
                z: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, rng(), rng() * 0.1 - 0.05]
            },
            color: this.pickColor(),
            glowing: rng() < 0.1
        }
    },
    generateStar(stars) {
        const rng = this.rng;
        const starPos = new Vector3();
        starPos.x = 2 * (rng() - 0.5);
        starPos.y = 2 * (rng() - 0.5);
        starPos.z = 2 * (rng() - 0.5);
        // Make sure the star is a good distance from the planet and not too close to other stars
        while (starPos.length() < 1.375 || starPos.length() > 1.75) {
            starPos.x = 2 * (rng() - 0.5);
            starPos.y = 2 * (rng() - 0.5);
            starPos.z = 2 * (rng() - 0.5);
        }
        while (true) {
            let tooClose = false;
            for (const star of stars) {
                if (star.position.distanceTo(starPos) < 0.375) {
                    tooClose = true;
                    break;
                }
            }
            if (tooClose) {
                starPos.x = 2 * (rng() - 0.5);
                starPos.y = 2 * (rng() - 0.5);
                starPos.z = 2 * (rng() - 0.5);
            } else {
                break;
            }
        }
        let starColor;
        let colorSeed = rng();
        // Star colors indicate rarity and can be used to create scarcity
        if (colorSeed < 0.025) {
            starColor = new Vector3(0, 1, 1);
        } else if (colorSeed < 0.075) {
            starColor = new Vector3(1, 0.25, 0.25);
        } else if (colorSeed < 0.15) {
            starColor = new Vector3(1, 0.5, 0.25);
        } else if (colorSeed < 0.3) {
            starColor = new Vector3(1, 1, 1);
        } else {
            starColor = new Vector3(1, 1, 0);
        }
        return {
            position: starPos,
            size: 0.5 + rng(),
            color: starColor
        };
    },
    generateMoon() {
        const rng = this.rng;
        const size = 0.35 + (rng() * 0.25);
        const position = new Vector3();
        // Make sure the moon isn't touching the planet
        while (position.length() < 1 + size * 1.25) {
            position.x = 4 * (rng() - 0.5);
            position.y = 4 * (rng() - 0.5);
            position.z = 4 * (rng() - 0.5);
            if (position.length() > 2) {
                position.x = 0;
                position.y = 0;
                position.z = 0;
            }
        }
        return {
            seed: Math.floor(rng() * 2 ** 32), // Moons have seeds, just like planets
            size: 0.1 + rng() * 0.1,
            tilt: {
                x: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, rng() * 0.005, rng() * 0.1 - 0.05],
                y: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, rng() * 0.005, rng() * 0.1 - 0.05],
                z: [rng() > 0.5 ? Math.sin : Math.cos, 1000 + 5000 * (rng() * rng()), rng() * 1000000, rng() * 0.005, rng() * 0.1 - 0.05]
            },
            glowing: rng() < 0.1,
            x: position.x,
            y: position.y,
            z: position.z
        };
    },
    generatePlanetData() {
        const rng = this.rng;
        const scale = 1.5 + 1 * rng();
        const levels = [];
        // Generate height levels of planet
        // Set a few initial values for the first level
        let threshold = -0.2 + 0.2 * rng();
        let height = 1;
        let cap = 0.1 + 0.2 * rng();
        // How much does the height change between each level?
        let heightIncrease = 0.025 + 0.025 * rng()
        while (threshold < cap) {
            threshold += 0.15 * rng();
            height += heightIncrease * rng();
            // Each height level has a noise threshold, a height that's a scaling factor for vertices later, and a random color
            levels.push({
                threshold,
                height,
                color: this.pickColor()
            });
        }
        // Add a final threshold for all noise above the cap
        levels.push({
            threshold: Infinity,
            height: height + heightIncrease * rng(),
            color: this.pickColor()
        });
        // Multiplying random calls together gives a distribution that skews toward smaller decimals while still ranging from 0-1
        // This is perfect for rare features where we want a 0-n distribution but want small numbers to be much more common than those closer to n
        // The max amount of rings is 3
        let ringAmt = Math.round(rng() * rng() * rng() * 3);
        const rings = [];
        for (let i = 0; i < ringAmt; i++) {
            rings.push(this.generateRing());
        }
        // For stars, 10
        const stars = [];
        const starAmount = rng() > 0.5 ? Math.round(rng() * rng() * 10) : 0;
        for (let i = 0; i < starAmount; i++) {
            stars.push(this.generateStar(stars));
        }
        // For moons, 5
        const moonAmt = Math.round(rng() * rng() * rng() * 5);
        const moons = [];
        for (let i = 0; i < moonAmt; i++) {
            moons.push(this.generateMoon());
        }
        return {
            scale,
            levels,
            // Size can be used but if all planets are supposed to be the same size this attribute can be ignored
            size: 0.5 + 1.0 * rng(),
            // Clouds have a few attributes that vary their color, speed, and size per-world
            clouds: {
                height: 1.05 + 0.1 * rng(),
                color: new Color(0.5 + rng(), 0.5 + rng(), 0.5 + rng()),
                coverage: rng() < 0.25 ? Math.max(0.1 + (rng() - 0.5), 0) : (rng() < 0.5 ? Math.max(0.1 + (rng() - 0.5), 0.15) : 1),
                offset: rng() * 10000,
                scale: 2.5 + (rng() - 0.5),
                speed: 0.025 + 0.05 * (rng()),
                density: 0.25 + 0.5 * rng()
            },
            rings,
            stars,
            moons
        }
    },
    generateMoonData() {
        // Moons are planets without clouds, stars, rings, and moons
        const data = this.generatePlanetData();
        data.stars = [];
        data.rings = [];
        data.clouds.coverage = 1;
        data.moons = [];
        return data;
    },
    setHeightAt(planetData, buffer, i, level) {
        // This finds how far a vertex should be extruded from the center of the sphere based off the noise at that vertex
        let expansion;
        for (const l of planetData.levels) {
            if (level < l.threshold) {
                expansion = l.height;
                break;
            }
        }
        buffer.setX(i, buffer.getX(i) * expansion);
        buffer.setY(i, buffer.getY(i) * expansion);
        buffer.setZ(i, buffer.getZ(i) * expansion);
    },
    makePlanet(planetData, small = false) {
        const planet = new Object3D();
        // Moon or planet?
        const planetGeo = small ? this.smallicosahdron.clone() : this.icosahedron.clone();
        const position = planetGeo.attributes.position;
        // Float32Array to store vertex colors - many times faster than normal array
        const color = new Float32Array(position.count * 3);
        let insertIndex = 0;
        for (let i = 0; i < position.count / 3; i++) {
            // Get vertex position
            const x0 = position.getX(i * 3);
            const x1 = position.getX(i * 3 + 1);
            const x2 = position.getX(i * 3 + 2);
            const y0 = position.getY(i * 3);
            const y1 = position.getY(i * 3 + 1);
            const y2 = position.getY(i * 3 + 2);
            const z0 = position.getZ(i * 3);
            const z1 = position.getZ(i * 3 + 1);
            const z2 = position.getZ(i * 3 + 2);
            // Sample noise
            const level1 = this.perlin.noise(x0 * planetData.scale, y0 * planetData.scale, z0 * planetData.scale);
            const level2 = this.perlin.noise(x1 * planetData.scale, y1 * planetData.scale, z1 * planetData.scale);
            const level3 = this.perlin.noise(x2 * planetData.scale, y2 * planetData.scale, z2 * planetData.scale);
            // Average noise is used to color triangle
            const level = (level1 + level2 + level3) / 3;
            // Individual noise is used for vertex height (this fixes seams/discontinuities)
            this.setHeightAt(planetData, position, i * 3, level1);
            this.setHeightAt(planetData, position, i * 3 + 1, level2);
            this.setHeightAt(planetData, position, i * 3 + 2, level3);
            // The color is applied to the entire triangle to achieve flat-shading.
            for (const l of planetData.levels) {
                if (level < l.threshold) {
                    color[insertIndex] = l.color.r;
                    insertIndex++;
                    color[insertIndex] = l.color.g;
                    insertIndex++;
                    color[insertIndex] = l.color.b;
                    insertIndex++;
                    color[insertIndex] = l.color.r;
                    insertIndex++;
                    color[insertIndex] = l.color.g;
                    insertIndex++;
                    color[insertIndex] = l.color.b;
                    insertIndex++;
                    color[insertIndex] = l.color.r;
                    insertIndex++;
                    color[insertIndex] = l.color.g;
                    insertIndex++;
                    color[insertIndex] = l.color.b;
                    insertIndex++;
                    break;
                }
            }
        }
        // Recompute normals as vertex positions have been modified
        planetGeo.computeVertexNormals();
        // Apply vertex colors
        planetGeo.setAttribute('color', new BufferAttribute(new Float32Array(color), 3));
        const crust = new Mesh(planetGeo, new MeshStandardMaterial({ color: new Color(1.0, 1.0, 1.0), side: DoubleSide, vertexColors: true }));
        planet.add(crust);
        // Theoretically allow for moons with clouds
        const cloudGeo = small ? this.smallicosahdron.clone() : this.icosahedron.clone(); //this.icosohedron.clone();
        // Cloud shader
        const cloudMat = new ShaderMaterial({
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            uniforms: {
                time: { value: 0.0 },
                coverage: { value: 0.0 },
                scale: { value: 0.0 },
                speed: { value: 0.0 },
                color: { value: new Vector3() },
                density: { value: 0.0 }
            },
            vertexShader: /*glsl*/ `
            varying float opacity;
            uniform float time;
            uniform float coverage;
            uniform float scale;
            uniform float speed;
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        vec4 grad4(float j, vec4 ip){
          const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
          vec4 p,s;
        
          p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
          p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
          s = vec4(lessThan(p, vec4(0.0)));
          p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 
        
          return p;
        }
        
        float snoise(vec4 v){
          const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                                0.309016994374947451); // (sqrt(5) - 1)/4   F4
        // First corner
          vec4 i  = floor(v + dot(v, C.yyyy) );
          vec4 x0 = v -   i + dot(i, C.xxxx);
        
        // Other corners
        
        // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
          vec4 i0;
        
          vec3 isX = step( x0.yzw, x0.xxx );
          vec3 isYZ = step( x0.zww, x0.yyz );
        //  i0.x = dot( isX, vec3( 1.0 ) );
          i0.x = isX.x + isX.y + isX.z;
          i0.yzw = 1.0 - isX;
        
        //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
          i0.y += isYZ.x + isYZ.y;
          i0.zw += 1.0 - isYZ.xy;
        
          i0.z += isYZ.z;
          i0.w += 1.0 - isYZ.z;
        
          // i0 now contains the unique values 0,1,2,3 in each channel
          vec4 i3 = clamp( i0, 0.0, 1.0 );
          vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
          vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
        
          //  x0 = x0 - 0.0 + 0.0 * C 
          vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
          vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
          vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
          vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;
        
        // Permutations
          i = mod(i, 289.0); 
          float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
          vec4 j1 = permute( permute( permute( permute (
                     i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                   + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                   + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                   + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
        // Gradients
        // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
        // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
        
          vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
        
          vec4 p0 = grad4(j0,   ip);
          vec4 p1 = grad4(j1.x, ip);
          vec4 p2 = grad4(j1.y, ip);
          vec4 p3 = grad4(j1.z, ip);
          vec4 p4 = grad4(j1.w, ip);
        
        // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          p4 *= taylorInvSqrt(dot(p4,p4));
        
        // Mix contributions from the five corners
          vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
          vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
          m0 = m0 * m0;
          m1 = m1 * m1;
          return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                       + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
        
        }
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
                // Sample 4D noise at vertex position, if above coverage create cloud, otherwise fade out. 
                // Step through fourth dimension as time goes on to evolve cloud formations
                if (snoise(vec4(position.xyz * scale, time * speed)) > coverage) {
                    opacity = 1.0;
                } else {
                    opacity = 0.0;
                }
            }
            `,
            fragmentShader: /*glsl*/ `
            varying float opacity;
            uniform float density;
            uniform vec3 color;
            void main() {
                // Multiply opacity by density to vary cloud opacity by world
                gl_FragColor = vec4(color, opacity * density);
            }
            `
        });
        const clouds = new Mesh(cloudGeo, cloudMat);
        clouds.scale.set(planetData.clouds.height, planetData.clouds.height, planetData.clouds.height);
        // Don't add clouds to planets with no cloud coverage
        if (planetData.clouds.coverage < 1) {
            planet.add(clouds);
        }
        const rings = [];
        planetData.rings.forEach(ring => {
            // Each ring is a low-poly torus
            const ringMesh = new Mesh(new TorusGeometry(1, 0.05, Math.round(4 * ring.detail), Math.round(10 * ring.detail)).applyMatrix4(new Matrix4().makeScale(...ring.size)).toNonIndexed(), new MeshStandardMaterial({ color: ring.color }));
            ringMesh.geometry.computeVertexNormals();
            ringMesh.rotation.x = Math.PI / 2;
            rings.push(ringMesh);
            planet.add(ringMesh);
        });
        // Stars are instanced to reduce draw calls and provide easy per-star coloring without many materials
        const instancedStarMesh = new InstancedMesh(starGeometry, new MeshBasicMaterial({ color: new Color(1, 1, 1) }), planetData.stars.length);
        planetData.stars.forEach((star, i) => {
            const dummy = new Object3D();
            dummy.position.x = star.position.x;
            dummy.position.y = star.position.y;
            dummy.position.z = star.position.z;
            dummy.scale.set(star.size, star.size, star.size)
            dummy.lookAt(0, 0, 0);
            dummy.updateMatrix();
            instancedStarMesh.setMatrixAt(i, dummy.matrix);
            instancedStarMesh.setColorAt(i, star.color);
        })
        planet.add(instancedStarMesh);
        const moons = [];
        planetData.moons.forEach(moon => {
            // Each moon has planet generation but performance overhead is limited as moons are so small in triangle count
            this.seed(moon.seed);
            const moonData = this.generateMoonData();
            const moonMesh = this.makePlanet(moonData, true);
            moonMesh.scale.set(moon.size, moon.size, moon.size);
            moonMesh.position.set(moon.x, moon.y, moon.z);
            // Create an anchor at the center of the planet for the moon to orbit around
            const moonAnchor = new Object3D();
            moonAnchor.add(moonMesh);
            planet.add(moonAnchor);
            moons.push(moonAnchor);
        })
        planet.stars = instancedStarMesh;
        planet.crust = crust;
        planet.clouds = clouds;
        planet.rings = rings;
        planet.moons = moons;
        planet.data = planetData;
        if (!small) {
            planet.selectId = id;
            id += 1;
            const b = id % 256;
            const g = ((id - b) / 256) % 256;
            const r = ((id - b) / 256 ** 2) - g / 256;
            const selectSphere = new Mesh(new SphereGeometry(1.1, 16, 16), new MeshBasicMaterial({ color: new Color(planet.selectId) }));
            planet.select = selectSphere;
            //planet.add(planet.select);
        }
        return planet;
    },
    update(planet) {
        const cloudMat = planet.clouds.material;
        const planetData = planet.data;
        // Update all the cloud uniforms
        // Time is updated using performance.now() plus an offset so that all the clouds on different planets aren't in-sync
        cloudMat.uniforms.time.value = performance.now() / 1000 + planetData.clouds.offset;
        cloudMat.uniforms.coverage.value = planetData.clouds.coverage;
        cloudMat.uniforms.color.value = planetData.clouds.color;
        cloudMat.uniforms.speed.value = planetData.clouds.speed;
        cloudMat.uniforms.scale.value = planetData.clouds.scale;
        cloudMat.uniforms.density.value = planetData.clouds.density;
        // Rotate all the rings
        planet.rings.forEach((ring, i) => {
            const r = planetData.rings[i].tilt;
            ring.rotation.x = r.x[4] + r.x[3] * r.x[0](performance.now() / r.x[1] + r.x[2]);
            ring.rotation.y = r.y[4] + r.y[3] * r.y[0](performance.now() / r.y[1] + r.y[2]);
            ring.rotation.z = r.z[4] + r.z[3] * r.z[0](performance.now() / r.z[1] + r.z[2]);
        });
        // Rotate all the moons
        planet.moons.forEach((moon, i) => {
            const r = planetData.moons[i].tilt;
            moon.rotation.x += r.x[3];
            moon.rotation.y += r.y[3];
            moon.rotation.z += r.z[3];
        });
    },
    newId() {
        const firstId = id;
        id += 1;
        return firstId;
    },
    spawn(x,y,z) {
        this.seed(parseInt("" + x * x * y + y * y * z + x * y * z));
        const newPlanet = this.makePlanet(this.generatePlanetData());
        newPlanet.scale.set(newPlanet.data.size / 4, newPlanet.data.size / 4, newPlanet.data.size / 4);
        newPlanet.position.set(x, y, z);
        newPlanet.chunk = new Vector3(x, y, z);
        newPlanet.source = 'generator'
        return newPlanet
    }
}
export default PlanetGenerator;