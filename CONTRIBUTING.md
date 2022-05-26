## Examples

The standard kit comes with a few demo worlds to get you started. With these examples, you see what is possible and understand the code.
1. Classroom
2. Base Template
3. Spawn Planet
4. Floor is Lava
5. Terrain Generation

*Have created something cool? send it to us on discord and we might add it to tis example list* 

## Environments
There are two environments for the Standard Kit:
1. **Production:** Deployed on Github pages from the `main` branch [View deployment](https://spacetime-meta.github.io/spacetime-standard-kit/)
2. **Development:** Deployed on Netlify from the `develop` branch [View deployment](https://stdkit-dev.netlify.app/)

## Development

To get started, you must first clone the repo on your local drive and navigate to the projects folder.
```
git clone https://github.com/Spacetime-Meta/spacetime-standard-kit.git
cd spacetime-standard-kit
```

Once you are ready to participate in the development of the standard kit, you must go to the [issue page](https://github.com/Spacetime-Meta/spacetime-standard-kit/issues) of the project and select an issues to work on. Once you choose, create a new branch for this issue. 

**Do not forget to branch from develop!!**  
*The develop branch is always the starting point when working on the project. If you want more information about branch management, i recommend reading this article: [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)*

after creating your issue branch, you can check it out in local
```
git fetch origin
git checkout <your branch name>
```

At this point you can do the modifications you came to do. If you modify the class structure, do not forget to adapt the UML Class Diagram

Once you are done with you modifications, you can commit and push your changes to your branch origin.
```
git add .
git commit -m "<your commit message>"
git push
```

At this point you can go on the Github website and open a pull request to merge your changes into the develop branch.

## Comments
Please do not leave random commented lines of code, remove them or explain clearly, in a comment above, why this is pertinent.

The most acceptable reason to leave a commented line of code is for debugging. Here is an example in the `TerrainController`:
```javascript
/* The following lines of code are used to debug the BVH collider. 
 * Uncomment these lines to visualize the BVH collider. 
 * More information on Bounding Volume Hierarchy (BVH):
 * https://en.wikipedia.org/wiki/Bounding_volume_hierarchy
 */

// const visualizer = new MeshBVHVisualizer(this.collider, 10);
// visualizer.visible = true;
// visualizer.update();
// scene.add(visualizer);
```
Here, the visualizer is commented out since it is not needed in production but is very useful in development. For this reason, It can stay there for developers to uncomment when needed.


## Useful Visual Studio Code Extensions
1. To edit the UML diagrams direcly in your Visual Studio Code, we strongly recommend the [drawio extension](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio).
2. To easily test your changes in the examples, we recommend the [live server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).