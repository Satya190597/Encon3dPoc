export function raycasting(
  raycaster,
  event,
  scene,
  mouse,
  camera,
  setPreviousObject,
  setOpenModel,
  setModelData
) {
  // Calculate mouse position in normalized device coordinates.
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  // Calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  // Check if any objects are intersected
  if (intersects.length > 0) {
    // Perform actions for the clicked object
    var clickedObject = intersects[0].object;
    setOpenModel(true);
    setModelData({ title: getTitle(clickedObject.name) });
    highLightObject(clickedObject, setPreviousObject);
  }
}

function getTitle(name) {
  if (name.includes("SCREW")) return "Screw";
  if (name.includes("PLATE")) return "Plate";
  if (name.includes("BLADE_")) return "Blade";
  if (name.includes("BACK_HOLDER")) return "Blade";
  if (name.includes("_CLAMP")) return "Blade";
  if (name.includes("CLAMP")) return "Clamp";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function highLightObject(object, setPreviousObject) {
  debugger;
  if (object.name.includes("SCREW_SUB")) {
    setPreviousObject({
      MODEL_OBJECT: object.parent,
      COLOR: object.parent.material.color.getHexString(),
    });
    object.parent.material.color.set(0xe74c3c);
  } else if (object.name.includes("BLADE_")) {
    if (object.children === null) return;
    let bladeSurfaceObject = null;
    for (let i = 0; i < object.children.length; i++) {
      if (object.children[i].name.includes("_SURFACE")) {
        bladeSurfaceObject = object.children[i];
      }
    }
    if (bladeSurfaceObject === null) return;
    console.log(bladeSurfaceObject.material.color.getHexString());
    setPreviousObject({
      MODEL_OBJECT: bladeSurfaceObject,
      COLOR: bladeSurfaceObject.material.color.getHexString(),
    });
    bladeSurfaceObject.material.color.set(0xe74c3c);
  } else if (
    object.name.includes("_BACK_HOLDER") ||
    object.name.includes("_CLAMP")
  ) {
    const parent = object.parent;
    if (parent.children === null) return;
    let bladeSurfaceObject = null;
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].name.includes("_SURFACE")) {
        bladeSurfaceObject = parent.children[i];
      }
    }
    if (bladeSurfaceObject === null) return;
    setPreviousObject({
      MODEL_OBJECT: bladeSurfaceObject,
      COLOR: bladeSurfaceObject.material.color.getHexString(),
    });
    bladeSurfaceObject.material.color.set(0xe74c3c);
  } else {
    console.log(object.material.color.getHexString());
    setPreviousObject({
      MODEL_OBJECT: object,
      COLOR: object.material.color.getHexString(),
    });
    object.material.color.set(0xe74c3c);
  }
}
