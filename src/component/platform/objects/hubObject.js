import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { basic } from "../materials/basic";
import { wireframe } from "../materials/wireframe";
import { plateObject } from "./clamp";

const MATERIAL_COLOR = {
  MATERIAL_ONE: 0x525d91,
  MATERIAL_TWO: 0x03a2b0,
  MATERIAL_THREE: 0x0085ff,
};

const CLAMP_MATERIAL_COLOR = {
  CLAMP_MATERIAL_ONE: 0xd35400,
  CLAMP_MATERIAL_TWO: 0x6c3483,
  CLAMP_MATERIAL_THREE: 0x1e8449,
};

export function hub(
  material,
  diameter,
  weight,
  plateType,
  clampMaterial,
  numberOfBlades,
  scene,
  assembleHubAndPlate
) {
  // ======================== Geometry ========================
  const cylinderGeometry = new THREE.CylinderGeometry(diameter+1, diameter+1, 2, 32);
  const cylinderGeometryHole = new THREE.CylinderGeometry(
    0.9 + diameter,
    0.9 + diameter,
    3,
    32
  );
  const cylinderTopPlateGeometry = new THREE.CylinderGeometry(
    2 + diameter,
    2 + diameter,
    0.2,
    32
  );
  const cylinderBottomPlateGeometry = new THREE.CylinderGeometry(
    2 + diameter,
    2 + diameter,
    0.2,
    32
  );
  const hubTopPlateGeometry = new THREE.CylinderGeometry(1.7, 1.7, 0.2, 32);
  const hubTopPlateHoleGeometry = new THREE.CylinderGeometry(
    0.7 + diameter,
    0.7 + diameter,
    0.1,
    32
  );
  const hubBottomPlateGeometry = new THREE.CylinderGeometry(1.7, 1.7, 0.2, 32);
  const hubTopBottomHoleGeometry = new THREE.CylinderGeometry(
    0.7 + diameter,
    0.7 + diameter,
    0.1,
    32
  );
  const clampCylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
  const clampCylinderSubGeometry = new THREE.CylinderGeometry(
    0.2,
    0.2,
    0.63,
    32
  );
  const clampFrontGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.6);
  // ======================== Creating Mesh With Geometry ========================
  let cylinder = new THREE.Mesh(cylinderGeometry,  basic(getColor(material)));
  let cylinderHole = new THREE.Mesh(
    cylinderGeometryHole,
    //basic(getColor(material))
    basic(0xd35400)
  );
  let cylinderTopPlate = new THREE.Mesh(
    cylinderTopPlateGeometry,
    basic(getColor(material))
  );
  let cylinderBottomPlate = new THREE.Mesh(
    cylinderBottomPlateGeometry,
    basic(getColor(material))
  );
  let hubTopPlate = new THREE.Mesh(hubTopPlateGeometry, basic(0x616161));
  let hubBottomPlate = new THREE.Mesh(hubBottomPlateGeometry, basic(0x616161));
  let hubTopPlateHole = new THREE.Mesh(
    hubTopPlateHoleGeometry,
    basic(getColor(material))
  );
  let hubBottomPlateHole = new THREE.Mesh(
    hubTopBottomHoleGeometry,
    basic(getColor(material))
  );
  let clampCylinder = new THREE.Mesh(
    clampCylinderGeometry,
    basic(getClampColor(clampMaterial))
  );
  let clampFront = new THREE.Mesh(
    clampFrontGeometry,
    basic(getClampColor(clampMaterial))
  );
  let clampCylinderSub = new THREE.Mesh(
    clampCylinderSubGeometry,
    basic(0x000000)
  );
  // ======================== Set Position ========================
  cylinderTopPlate.position.set(0, 1, 0);
  cylinderTopPlate.updateMatrix();
  cylinderBottomPlate.position.set(0, -1, 0);
  cylinderBottomPlate.updateMatrix();
  hubTopPlate.position.set(0, 1, 0);
  hubTopPlate.updateMatrix();
  hubBottomPlate.position.set(0, -1, 0);
  hubBottomPlate.updateMatrix();
  hubTopPlateHole.position.set(0, 1, 0);
  hubTopPlateHole.updateMatrix();
  hubBottomPlateHole.position.set(0, -1, 0);
  hubBottomPlateHole.updateMatrix();
  clampCylinder.position.set(1.5, 0.2, 0);
  clampCylinder.updateMatrix();
  clampFront.position.set(0, 0.2, 0);
  clampFront.updateMatrix();
  clampCylinderSub.position.set(-0.2, 0, 0);
  clampCylinderSub.updateMatrix();
  // ======================== Set Rotation ========================
  clampCylinder.rotation.z = 1.6;
  clampFront.rotation.z = 1.6;
  //clampCylinderSub.rotation.z = 1.6;
  clampCylinder.updateMatrix();
  clampFront.updateMatrix();
  clampCylinderSub.updateMatrix();
  // ======================== Perform Union Substract and Other Opertaions ========================
  let hub = CSG.union(cylinder, cylinderTopPlate);
  hub = CSG.union(hub, cylinderBottomPlate);
  hub = CSG.subtract(hub, cylinderHole);
  hubTopPlate = CSG.subtract(hubTopPlate, hubTopPlateHole);
  hubBottomPlate = CSG.subtract(hubBottomPlate, hubBottomPlateHole);
  clampCylinder = CSG.subtract(clampCylinder, clampCylinderSub);
  clampCylinder.add(clampFront);
  let clampBack = clampFront.clone();
  clampBack.position.set(0, -0.2, 0);
  clampBack.updateMatrix();
  clampCylinder.add(clampBack);
  clampCylinder.add(clampCylinderSub);
  clampCylinder.updateMatrix();

  let bottomClamp = clampCylinder.clone();

  bottomClamp.position.set(1.5, -0.2, 0);
  bottomClamp.rotation.x = 3.11;

  clampCylinder.scale.set(0.5, 0.5, 0.5);
  bottomClamp.scale.set(0.5, 0.5, 0.5);

  // ======================== Add Wireframe Or other additional objects. ========================
  hub.add(wireframe(hub.geometry));
  if (plateType === "DOUBLE") {
    // hubTopPlate.add(wireframe(hubTopPlate.geometry));
    // hub.add(hubTopPlate);
    const plate = plateObject(4, 0.2, 0xAED6F1, 0.2, scene,numberOfBlades);
    if (assembleHubAndPlate) plate.position.y = 1.02;
    else plate.position.y = 1.7;
    hub.add(plate);
  }
  if (plateType === "DOUBLE" || plateType === "SINGLE") {
    //hubBottomPlate.add(wireframe(hubBottomPlate.geometry));
    //hub.add(hubBottomPlate);
    const plate = plateObject(4, 0.2, 0xAED6F1, 0.2, scene,numberOfBlades);
    if (assembleHubAndPlate) plate.position.y = -1.02;
    else plate.position.y = -1.7;
    hub.add(plate);
  }
  if (numberOfBlades >= 1) {
    hub.add(clampCylinder);
    hub.add(bottomClamp);
  }
  if (numberOfBlades >= 2) {
    hub.add(mirrorClampCylinder(clampCylinder.clone()));
    hub.add(mirrorClampCylinder(bottomClamp.clone()));
  }
  //hub.add(clampFront)
  // ======================== Scale Hub Object ========================
  hub.scale.set(1 + weight, 1 + weight, 1 + weight);
  return hub;
}

function mirrorClampCylinder(clamp) {
  clamp.position.set(-clamp.position.x, clamp.position.y, clamp.position.z);
  return clamp;
}

function getColor(material) {
  return MATERIAL_COLOR[material];
}

function getClampColor(material) {
  return CLAMP_MATERIAL_COLOR[material];
}
