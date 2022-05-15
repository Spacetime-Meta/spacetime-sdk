import { StdEnv } from '../../../js/StdEnv.js';
        const VE = new StdEnv();

        init();

        function init() {
            // ===== Virtual Env =====
            VE.init();
            VE.loadTerrain('../../../glb/terrains/spawnPlanet.glb', 0, -20, 0)
            VE.spawnPlayer('../../../glb/avatars/vanguard.glb')
        }

        if (!window.requestPostAnimationFrame) {
            window.requestPostAnimationFrame = function(task) {
                requestAnimationFrame(() => {
                    setTimeout(task, 0);
                });
            }
        }

        function animate() {
            requestPostAnimationFrame(animate);

            VE.update();
        }
        requestPostAnimationFrame(animate);