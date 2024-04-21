import * as THREE from "three";
export function getRenderer(animation) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setAnimationLoop(animation);
  return renderer;
}

export function addRenderer(element, renderer) {
  removeAllExisitngChildNode(element);
  element.appendChild(renderer.domElement);
}

function removeAllExisitngChildNode(element) {
  if (!element.firstChild) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
