const fs = require('fs');
const l = require('./GLTFLoader');
const l1 = require('./OBJLoader');

class Loader {
    constructor() {
        
        this.loaderGLTF = new l.GLTFLoader();
        this.loaderOBJ = new l1.OBJLoader();
    }

    loadOBJ( url, onLoadCallBack ) {
        fs.readFile(url, 'utf8', (err, data) => {
  
            if (err) {
                console.error(err);
                return;
            }

            this.obj = this.loaderOBJ.parse(data)
            onLoadCallBack(this.obj);
        });
    }




    // gltf loader - **not working**
    // loadGLTF( url, onLoadCallback ) {   
    //     fs.readFile(url, 'utf8', (err, data) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         this.loaderGLTF.parse(data, "./", 
    //             (result)=>{ onLoadCallback(result.scene) },
    //             (err)=>{ console.log(err) }
    //         );
    //     });
    // }
}
module.exports = { Loader }

