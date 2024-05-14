import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { basic } from "../materials/basic";
import { wireframe } from "../materials/wireframe";

const MATERIAL_COLOR = {
  BLADE_MATERIAL_ONE: 0x707b7c,
  BLADE_MATERIAL_TWO: 0xf4d03f,
  BLADE_MATERIAL_THREE: 0xc0392b,
};

function createClamp() {
  const geometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
  const material = new THREE.MeshBasicMaterial({ color: 0x2C3E50 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

function clampScrewHolder() {
  const geometry = new THREE.BoxGeometry(1.8, 0.4, 0.6);
  const material = new THREE.MeshBasicMaterial({ color: 0x2C3E50 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

function createClampCylinder() {
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x566573 });
  return new THREE.Mesh(cylinderGeometry,material);
}

export function blade(material, bladeAngle) {
  const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.7, 5.5, 2);
  const cylinderHolderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 32);
  const forwardClamp = createClamp();
  const backwardClamp = createClamp();
  const clampCylinder = createClampCylinder();
  const clampScrewSocketL = clampScrewHolder();
  const clampScrewSocketR = clampScrewHolder();
  const clampScrewSocketLB = clampScrewHolder();
  const clampScrewSocketRB = clampScrewHolder();
  const cylinderHolderPlateGeometry = new THREE.CylinderGeometry(
    0.5,
    0.5,
    0.2,
    32
  );
  let cylinder = new THREE.Mesh(cylinderGeometry, basic(getColor(material)));
  let cylinderHolder = new THREE.Mesh(
    cylinderHolderGeometry,
    basic(getColor(material))
  );
  let cylinderHolderPlate = new THREE.Mesh(
    cylinderHolderPlateGeometry,
    basic(0x03a2b0)
  );
  cylinderHolder.position.y = -3;
  forwardClamp.position.y = -2.8;
  backwardClamp.position.y = -3.5;
  clampCylinder.position.y = -3;
  clampScrewSocketL.position.y = -2.9;
  clampScrewSocketL.position.z = 0.8;
  clampScrewSocketL.updateMatrix();

  clampScrewSocketLB.position.y = -3.5;
  clampScrewSocketLB.position.z = 0.8;
  clampScrewSocketLB.updateMatrix();

  clampScrewSocketR.position.y = -2.9;
  clampScrewSocketR.position.z = -0.8;
  clampScrewSocketR.updateMatrix();

  clampScrewSocketRB.position.y = -3.5;
  clampScrewSocketRB.position.z = -0.8;
  clampScrewSocketRB.updateMatrix();


  clampCylinder.updateMatrix();
  forwardClamp.updateMatrix();
  backwardClamp.updateMatrix();
  cylinderHolder.add(wireframe(cylinderHolder.geometry));
  cylinderHolder.updateMatrix();
  cylinderHolderPlate.add(wireframe(cylinderHolderPlate.geometry));
  cylinderHolderPlate.position.y = -0.2;
  cylinderHolderPlate.updateMatrix();
  cylinder.add(forwardClamp);
  cylinder.add(backwardClamp);
  cylinder.add(clampCylinder);
  cylinder.add(clampScrewSocketL);
  cylinder.add(clampScrewSocketR);
  cylinder.add(clampScrewSocketLB);
  cylinder.add(clampScrewSocketRB);
  //cylinderHolder.add(cylinderHolderPlate);
  addWidthToTheBlade(cylinder, 0);
  cylinder.add(cylinderHolder);
  const wireframeMaterial = wireframe(cylinder.geometry);
  cylinder.add(wireframeMaterial);
  return cylinder;
}

function getColor(material) {
  return MATERIAL_COLOR[material];
}

function addWidthToTheBlade(cylinder, count) {
  if (count > 10) return;
  const clonedCylinder = cylinder.clone();
  clonedCylinder.position.x = 0.01;
  cylinder.add(clonedCylinder);
  addWidthToTheBlade(clonedCylinder, count + 1);
}
