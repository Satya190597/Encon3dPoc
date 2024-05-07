import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { basic } from "../materials/basic";
import { wireframe } from "../materials/wireframe";

const MATERIAL_COLOR = {
  BLADE_MATERIAL_ONE: 0x707b7c,
  BLADE_MATERIAL_TWO: 0xf4d03f,
  BLADE_MATERIAL_THREE: 0xc0392b,
};

export function blade(material,bladeAngle) {
  const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.7, 5.5, 2);
  const cylinderHolderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
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
  cylinderHolder.position.y = -2.8;
  cylinderHolder.add(wireframe(cylinderHolder.geometry));
  cylinderHolder.updateMatrix();
  cylinderHolderPlate.add(wireframe(cylinderHolderPlate.geometry));
  cylinderHolderPlate.position.y = -0.2;
  cylinderHolderPlate.updateMatrix();
  cylinderHolder.add(cylinderHolderPlate);
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
