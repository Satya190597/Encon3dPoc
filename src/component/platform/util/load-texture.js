import * as THREE from "three";
export function loadTexture(filename) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(filename);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}
