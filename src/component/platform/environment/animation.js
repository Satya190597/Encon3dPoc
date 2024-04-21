export function getAnimationFunction(renderer,scene,camera) {
    return function animation() {
        renderer.render(scene, camera);
      }
}