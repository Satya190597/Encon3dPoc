import * as THREE from "three";
export function wireframe(geometry) {
  const wireframeMesh = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  return new THREE.Mesh(geometry, wireframeMesh);
}
