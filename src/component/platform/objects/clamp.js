import { useEffect } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import Config from "../config/modelConfig";
import { blade } from "./bladeObject";

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
  let socket = getCylinder(0.5, thickness, 0xfdfefe);
  cylinder = CSG.subtract(cylinder, socket);
  cylinder.updateMatrix();
  return cylinder;
}

// Function to create blade
function createBlade(length, width, thickness, color) {
  const geometry = new THREE.BoxGeometry(length, width, thickness);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const blade = new THREE.Mesh(geometry, material);
  return blade;
}

function getSpaceBetweenScrews(number) {
  if (number == 1) return 0.03;
  if (number == 2) return 0.06;
  else return 0.15;
}

function createOuterSocketsOfPlate(
  cylinder,
  radius,
  hubWidth,
  numberOfScrews,
  screwDiameter,
  thickness,
  scene,
  numberOfBlade,
  highlight
) {
  console.log("NUMBER OF SCREWS " + numberOfScrews);
  radius = radius - 0.3;
  let flag = false;
  const arrayOfScrewSocket = [];
  const arrayOfScrewParallelSocket = [];
  const arrayOfHubScrewSocket = [];

  const holesData = Config.HOLES[4];

  const leftHolesData = holesData["LEFT-HOLES"];
  const rightHolesData = holesData["RIGHT-HOLES"];
  const distanceBetweenThem = holesData["DISTANCE-BETWEEN-HOLES"];

  // rightHolesData.forEach(position => {
  //   const screwSocket = createScrew();
  //   console.log("RIGHT SCREW AND BOLT X = "+position.x+" Y = "+position.y+" Z = "+position.z);
  //   screwSocket.position.set(position.x, position.y, position.z);
  //   arrayOfScrewSocket.push(screwSocket);
  // })

  for (let i = 0; i < numberOfScrews; i++) {
    const screwSocket = createScrew(); //getCylinder(screwDiameter, 0.25, 0x000000);
    const angle =
      (i + -getSpaceBetweenScrews(numberOfScrews)) * (360 / numberOfScrews);
    const x = 0 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 0 + radius * Math.sin((angle * Math.PI) / 180);
    screwSocket.position.set(x, -0.03, y);
    console.log(
      "RIGHT SCREW AND BOLT X = " + x + " Y = " + -0.03 + " Z = " + y
    );
    console.log(
      "ROTATION = " +
        screwSocket.rotation.x +
        " Y = " +
        screwSocket.rotation.y +
        " Z = " +
        screwSocket.rotation.z
    );
    debugger
    if (highlight === "SCREW") screwSocket.material.color.set(0x82e0aa);
    arrayOfScrewSocket.push(screwSocket);
    //screwSocket.updateMatrix();
    const screwParallelSocket = createScrew(); //getCylinder(screwDiameter, 0.25, 0x000000);
    const angleP =
      (i + getSpaceBetweenScrews(numberOfScrews)) * (360 / numberOfScrews);
    const xP = 0 + radius * Math.cos((angleP * Math.PI) / 180);
    const yP = 0 + radius * Math.sin((angleP * Math.PI) / 180);
    screwParallelSocket.position.set(xP, -0.03, yP);
    console.log(
      "LEFT SCREW AND BOLT X = " + xP + " Y = " + -0.03 + " Z = " + yP
    );
    if (highlight === "SCREW") screwParallelSocket.material.color.set(0x82e0aa);
    arrayOfScrewParallelSocket.push(screwParallelSocket);
    screwParallelSocket.updateMatrix();

    // Attach Blades
    // const blade = createBlade(4, 0.2, 0.5, 0xff0000);
    // blade.position.set(x, -0.03, y);
    // cylinder.add(blade)
  }
  for (let i = 0; i < 10; i++) {
    const hubScrewSocket = createScrew(); // getCylinder(screwDiameter, 0.25, 0x000000);
    const angleH = i * (360 / 10);
    const xH = 0 + 1 * Math.cos((angleH * Math.PI) / 180);
    const yH = 0 + 1 * Math.sin((angleH * Math.PI) / 180);
    hubScrewSocket.position.set(xH, 0.01, yH);
    if (highlight === "SCREW") hubScrewSocket.material.color.set(0x82e0aa);
    arrayOfHubScrewSocket.push(hubScrewSocket);
  }
  arrayOfScrewSocket.forEach((object) => object.updateMatrix());
  arrayOfScrewParallelSocket.forEach((object) => object.updateMatrix());
  arrayOfHubScrewSocket.forEach((object) => object.updateMatrix());
  arrayOfScrewSocket.forEach((object, index) => {
    //cylinder = CSG.subtract(cylinder, object)
    //scene.add(object)
    // if(index <= 4) {
    //   const bladeModel = blade("BLADE_MATERIAL_ONE", 0);
    //   bladeModel.position.copy(object.position)
    //   bladeModel.lookAt(object.position)
    //   console.log("+ Object Position : ");
    //   console.log(object.position)
    //   bladeModel.position.set(0,0,0);
    //   bladeModel.position.copy(object.position)
    //   bladeModel.lookAt(cylinder.position);
    //   bladeModel.position.y += 4
    //   cylinder.add(bladeModel)
    // }

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
  numberOfBlades,
  highlight
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
    numberOfBlades,
    highlight
  );
}
