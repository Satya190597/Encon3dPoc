import { useEffect } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";


function getMaterialByColor(color) {
  return new THREE.MeshBasicMaterial({ color });
}
function getCylinder(radius, thickness, color) {
  const geometry = new THREE.CylinderGeometry(radius, radius, thickness, 32);
  const cylinder = new THREE.Mesh(geometry, getMaterialByColor(color));
  cylinder.matrixAutoUpdate = false;
  cylinder.updateMatrix();
  return cylinder;
}
function getCylinderForScrew(radius, thickness, color, radialSegment) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    thickness,
    radialSegment
  );
  const cylinder = new THREE.Mesh(geometry, getMaterialByColor(color));
  cylinder.matrixAutoUpdate = false;
  cylinder.updateMatrix();
  return cylinder;
}
function createScrew() {
  const head = getCylinderForScrew(0.2, 0.3, 0x273746, 6);
  const bolt = getCylinderForScrew(0.2, 0.1, 0x273746, 6);
  const point = getCylinder(0.1, 0.6, 0x979a9a);
  head.position.set(0, 0.1, 0);
  bolt.position.set(0, -0.1, 0);
  head.updateMatrix();
  bolt.updateMatrix();
  point.add(head);
  point.add(bolt);
  return point;
}
function addSocketForHub(cylinder, thickness, hubDiameter) {
  let socket = getCylinder(hubDiameter, thickness, 0xfdfefe);
  cylinder = CSG.subtract(cylinder, socket);
  cylinder.updateMatrix();
  return cylinder;
}
function createOuterSocketsOfPlate(
  cylinder,
  radius,
  hubWidth,
  numberOfScrews,
  screwDiameter,
  thickness
) {
  console.log("NUMBER OF SCREWS " + numberOfScrews);
  radius = radius - 0.3;
  let flag = false;
  const arrayOfScrewSocket = [];
  const arrayOfScrewParallelSocket = [];
  const arrayOfHubScrewSocket = [];

  for (let i = 0; i < 10; i++) {
    const screwSocket = createScrew(); //getCylinder(screwDiameter, 0.25, 0x000000);
    const angle = i * (360 / 10);
    const x = 0 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 0 + radius * Math.sin((angle * Math.PI) / 180);
    screwSocket.position.set(x, -0.03, y);
    arrayOfScrewSocket.push(screwSocket);
    //screwSocket.updateMatrix();
    const screwParallelSocket = createScrew(); //getCylinder(screwDiameter, 0.25, 0x000000);
    const angleP = (i + 0.3) * (360 / 10);
    const xP = 0 + radius * Math.cos((angleP * Math.PI) / 180);
    const yP = 0 + radius * Math.sin((angleP * Math.PI) / 180);
    screwParallelSocket.position.set(xP, 0.01, yP);
    arrayOfScrewParallelSocket.push(screwParallelSocket);
    //screwParallelSocket.updateMatrix();
  }
  for (let i = 0; i < 10; i++) {
    const hubScrewSocket = createScrew(); // getCylinder(screwDiameter, 0.25, 0x000000);
    const angleH = i * (360 / 10);
    const xH = 0 + 1.5 * Math.cos((angleH * Math.PI) / 180);
    const yH = 0 + 1.5 * Math.sin((angleH * Math.PI) / 180);
    hubScrewSocket.position.set(xH, 0.01, yH);
    arrayOfHubScrewSocket.push(hubScrewSocket);
  }
  arrayOfScrewSocket.forEach((object) => object.updateMatrix());
  arrayOfScrewParallelSocket.forEach((object) => object.updateMatrix());
  arrayOfHubScrewSocket.forEach((object) => object.updateMatrix());
  arrayOfScrewSocket.forEach((object) => {
    //cylinder = CSG.subtract(cylinder, object)
    //scene.add(object)
    cylinder.add(object);
  });
  cylinder.updateMatrix();
  arrayOfScrewParallelSocket.forEach((object) => {
    //cylinder = CSG.subtract(cylinder, object)
    cylinder.add(object);
  });
  cylinder.updateMatrix();
  arrayOfHubScrewSocket.forEach((object) => {
    //cylinder = CSG.subtract(cylinder, object)
    cylinder.add(object);
  });
  //cylinder.updateMatrix();
  return cylinder;
}

function logCoordinate(name, object) {
  console.log(
    name +
      " X : " +
      object.position.x +
      " Y :" +
      object.position.y +
      " Z :" +
      object.position.z
  );
}
export function plateObject(
  radius,
  thickness,
  color,
  hubDiameter,
  scene,
  numberOfBlades
) {
  let cylinder = getCylinder(radius, thickness, color);
  cylinder = addSocketForHub(cylinder, hubDiameter);
  return createOuterSocketsOfPlate(
    cylinder,
    radius,
    2,
    numberOfBlades,
    0.2,
    thickness,
    scene,
    numberOfBlades
  );
}
