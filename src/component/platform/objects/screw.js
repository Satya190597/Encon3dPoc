import * as THREE from "three";

/**
 * @description Helper method/function to create a basic cylinder model. Note - The default value of partition should be 32.
 * @param {*} radius
 * @param {*} height
 * @param {*} partition
 * @param {*} color
 * @returns Cylinder Model
 */
function getCylinder(radius, height, partition, color) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    partition
  );
  const material = new THREE.MeshBasicMaterial({ color: color });
  return new THREE.Mesh(geometry, material);
}

/**
 * @description This method is responsible to create threads on the existing screw model.
 * @param {ScrewModel} screw  - Screw Model.
 * @param {Number} numberOfThreads - Number of threads.
 * @param {Number} axis - Starting point of the threads.
 * @param {Number} maxAxis - Ending point of the threads.
 * @returns Screw Model.
 */
function createThreads(screw, numberOfThreads, axis, maxAxis) {
  if (axis <= -maxAxis) return screw;
  const radius = screw.geometry.parameters.radiusTop + 0.1;
  const thread = getCylinder(radius, 0.5, 32, 0xa04000);
  thread.position.set(0, axis, 0);
  screw.add(thread);
  return createThreads(screw, numberOfThreads, axis - 0.7, maxAxis);
}

/**
 * @description This method will return a screw a screw model based on height and width provided by the user.
 * @param {Number} height
 * @param {Number} width
 * @returns Screw model.
 */
export function getScrewObject(height, width) {
  /*
    A Screw model should consist of 3 parts.
    - 1. POINT / SCREW BODY
    - 2. SCREW HEAD
    - 3. SCREW THREADS
   */
  const screwHeadHeight = height / 4 + 1; // Calculate screw head height based on screw height. Currently it's one fourth.
  const numberOfThreads = height / 2 + 1; // Calculate number of threads. Currently it's half the screw height.
  const point = getCylinder(width, height, 32, 0xeb984e);
  const head = getCylinder(width + 2, screwHeadHeight, 6, 0xd35400);
  const headBorder = getCylinder(width + 1, screwHeadHeight, 6, 0xf7dc6f);
  head.position.set(0, height / 2, 0);
  headBorder.position.set(0, 0.5, 0);
  head.add(headBorder);
  point.add(head);
  return createThreads(point, numberOfThreads, -1, height / 2);
}
