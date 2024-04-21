import * as THREE from "three";
export function getCamera(zPosition) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = zPosition;
  return camera;
}
