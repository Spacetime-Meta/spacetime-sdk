import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

var AOShader = {

    uniforms: {

        'sceneDepth': { value: null },
        'tDiffuse': { value: null },
        'projectionMatrixInv': { value: new THREE.Matrix4() },
        'viewMatrixInv': { value: new THREE.Matrix4() },
        'viewMat': { value: new THREE.Matrix4() },
        'projMat': { value: new THREE.Matrix4() },
        'cameraPos': { value: new THREE.Vector3() },
        'resolution': { value: new THREE.Vector2() },
        'time': { value: 0.0 }
    },

    vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */ `
		uniform sampler2D sceneDepth;
        uniform sampler2D tDiffuse;
        uniform mat4 projectionMatrixInv;
        uniform mat4 viewMatrixInv;
        uniform mat4 viewMat;
        uniform mat4 projMat;
        uniform vec3 cameraPos;
        uniform vec2 resolution;
        uniform float time;
        varying vec2 vUv;
        #define NUM_SAMPLES 24
        #define NUM_RINGS 11
        #define PI2 6.283185307179586
        float rand(vec2 n) { 
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
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
        float FBM(vec4 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 0.0;
          for (int i = 0; i < 6; ++i) {
            value += amplitude * snoise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        vec2 poissonDisk[NUM_SAMPLES];
    
    
                    void initPoissonSamples(vec2 randomSeed ) {
                        float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
                        float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );
    
                        // jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
                        float angle = rand( randomSeed ) * PI2;
                        float radius = INV_NUM_SAMPLES;
                        float radiusStep = radius;
    
                        for( int i = 0; i < NUM_SAMPLES; i ++ ) {
                            poissonDisk[i] = vec2( cos( angle ), sin( angle ) ) * pow( radius, 0.75 );
                            radius += radiusStep;
                            angle += ANGLE_STEP;
                        }
                    }
        float linearize_depth(float d,float zNear,float zFar)
        {
            return zNear * zFar / (zFar + d * (zNear - zFar));
        }
        vec3 WorldPosFromDepth(float depth, vec2 coord) {
          float z = depth * 2.0 - 1.0;
          vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
          vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
          // Perspective division
          viewSpacePosition /= viewSpacePosition.w;
          vec4 worldSpacePosition = viewMatrixInv * viewSpacePosition;
          return worldSpacePosition.xyz;
      }
      vec3 computeNormal(vec3 worldPos, vec2 vUv) {
        vec2 downUv = vUv + vec2(0.0, 1.0 / resolution.y);
        vec3 downPos = WorldPosFromDepth( texture2D(sceneDepth, downUv).x, downUv);
        vec2 rightUv = vUv + vec2(1.0 / resolution.x, 0.0);;
        vec3 rightPos = WorldPosFromDepth(texture2D(sceneDepth, rightUv).x, rightUv);
        vec2 upUv = vUv - vec2(0.0, 1.0 / resolution.y);
        vec3 upPos = WorldPosFromDepth(texture2D(sceneDepth, upUv).x, upUv);
        vec2 leftUv = vUv - vec2(1.0 / resolution.x, 0.0);;
        vec3 leftPos = WorldPosFromDepth(texture2D(sceneDepth, leftUv).x, leftUv);
        int hChoice;
        int vChoice;
        if (length(leftPos - worldPos) < length(rightPos - worldPos)) {
          hChoice = 0;
        } else {
          hChoice = 1;
        }
        if (length(upPos - worldPos) < length(downPos - worldPos)) {
          vChoice = 0;
        } else {
          vChoice = 1;
        }
        vec3 hVec;
        vec3 vVec;
        if (hChoice == 0 && vChoice == 0) {
          hVec = leftPos - worldPos;
          vVec = upPos - worldPos;
        } else if (hChoice == 0 && vChoice == 1) {
          hVec = leftPos - worldPos;
          vVec = worldPos - downPos;
        } else if (hChoice == 1 && vChoice == 1) {
          hVec = rightPos - worldPos;
          vVec = downPos - worldPos;
        } else if (hChoice == 1 && vChoice == 0) {
          hVec = rightPos - worldPos;
          vVec = worldPos - upPos;
        }
        return normalize(cross(hVec, vVec));
      }
		void main() {
            vec4 texel = texture2D( tDiffuse, vUv );
            float d = texture2D( sceneDepth, vUv ).x;
            float depth = linearize_depth(d, 0.1, 2000.0);
            float depth_Diff = 0.0;
            float count = 0.0;
            vec3 worldPos = WorldPosFromDepth(d, vUv);
            vec3 fogDirection = normalize(worldPos - cameraPos);
            vec3 fogOrigin = cameraPos;
            float fogDepth = length(worldPos - fogOrigin);
            // f(p) = fbm( p + fbm( p ) )
            vec4 noiseSampleCoord = vec4(worldPos * 0.00025, time * 0.02);
            float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
            fogDepth *= mix(noiseSample, 1.0, clamp((fogDepth - 5000.0) / 5000.0, 0.0, 1.0));
            fogDepth *= fogDepth;
            float fogDensity = 0.000025;
            float heightFactor = 0.1;
            float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
                1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
            fogFactor = clamp(fogFactor, 0.0, 1.0);
            initPoissonSamples(worldPos.xy + worldPos.z);
            for(int i = 0; i < NUM_SAMPLES; i++) {
                    // color += weight * texture2D(uSampler, vTextureCoord + vec2(0.002 * i, 0.002 * j)).xyz;
                    vec2 sampleCoord = vUv + vec2((1.0 / resolution.x), (1.0 / resolution.y)) * poissonDisk[i] * 16.0;
                    float tempdiff = (depth - linearize_depth(texture2D(sceneDepth, sampleCoord).x, 0.1, 2000.0));
                        tempdiff /= depth;
                        if (tempdiff * depth < depth * 0.1 && tempdiff < 2.0) {
                            if (tempdiff < 0.05) {
                                depth_Diff += tempdiff;
                            } else {
                                depth_Diff += tempdiff * (1.0 - ((tempdiff - 0.05) / 0.05));
                            }
                            count += 1.0;
                        }
              }
            depth_Diff /= count;
            depth_Diff = max(min(depth_Diff, 0.05), 0.0);
            gl_FragColor = vec4(mix(texel.rgb * vec3(1.0 - 20.0 * depth_Diff), vec3(0.804, 0.754, 0.838), fogFactor), 1.0);

		}`

};

export { AOShader };