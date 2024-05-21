import { getCamera } from "../environment/camera";
import { getScene } from "../environment/scene";
import { getRenderer, addRenderer } from "../environment/renderer";
import { movement } from "../environment/control";
import * as THREE from "three";
import {
  Button,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Form,
  Navbar,
  Container,
  Nav,
  Table,
  OverlayTrigger,
  Popover,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getScrewObject } from "../objects/screw";
import { useEffect, useState, useRef } from "react";
import { raycasting } from "../util/raycasting";
import HEXA_COLOR from "../util/colors";
import DraggableWindow from "../ui/draggableWindow";

const TOP_PLATE_MODEL = "models/topPlate.json";
const HUB_MODEL = "models/hub.json";
const BOTTOM_PLATE_MODEL = "models/bottomPlate.json";
const BLADE_1 = "models/eight_blades/blade1.json";
const BLADE_2 = "models/eight_blades/blade2.json";
const BLADE_3 = "models/eight_blades/blade3.json";
const BLADE_4 = "models/eight_blades/blade4.json";
const BLADE_5 = "models/eight_blades/blade5.json";
const BLADE_6 = "models/eight_blades/blade6.json";
const BLADE_7 = "models/eight_blades/blade7.json";
const BLADE_8 = "models/eight_blades/blade8.json";
const CLAMP3 = [
  "models/clamps/eight_blades_clamps/clamp3_b1.json",
  "models/clamps/eight_blades_clamps/clamp3_b2.json",
  "models/clamps/eight_blades_clamps/clamp3_t1.json",
  "models/clamps/eight_blades_clamps/clamp3_t2.json",
];
const CLAMP4 = [
  "models/clamps/eight_blades_clamps/clamp4_b1.json",
  "models/clamps/eight_blades_clamps/clamp4_b2.json",
  "models/clamps/eight_blades_clamps/clamp4_t1.json",
  "models/clamps/eight_blades_clamps/clamp4_t2.json",
];
const CLAMP2 = [
  "models/clamps/eight_blades_clamps/clamp2_b1.json",
  "models/clamps/eight_blades_clamps/clamp2_b2.json",
  "models/clamps/eight_blades_clamps/clamp2_t1.json",
  "models/clamps/eight_blades_clamps/clamp2_t2.json",
];
const CLAMP5 = [
  "models/clamps/eight_blades_clamps/clamp5_b1.json",
  "models/clamps/eight_blades_clamps/clamp5_b2.json",
  "models/clamps/eight_blades_clamps/clamp5_t1.json",
  "models/clamps/eight_blades_clamps/clamp5_t2.json",
];
const CLAMP1 = [
  "models/clamps/eight_blades_clamps/clamp1_b1.json",
  "models/clamps/eight_blades_clamps/clamp1_b2.json",
  "models/clamps/eight_blades_clamps/clamp1_t1.json",
  "models/clamps/eight_blades_clamps/clamp1_t2.json",
];
const CLAMP6 = [
  "models/clamps/eight_blades_clamps/clamp6_b1.json",
  "models/clamps/eight_blades_clamps/clamp6_b2.json",
  "models/clamps/eight_blades_clamps/clamp6_t1.json",
  "models/clamps/eight_blades_clamps/clamp6_t2.json",
]

function TestPlatform() {
  const listOfModelObject = [];
  var previousObject = useRef(null);
  const [openModel, setOpenModel] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [previousModelObject, setPreviousModelObject] = useState(null);

  const setPreviousObject = (value) => (previousObject.current = value);
  useEffect(() => {
    render3D();
  }, []);

  function modelLoadingProgress(xhr, name) {
    console.log(name + " : " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }

  function errorHandling(error, name) {
    console.log(name + " : " + error);
  }

  function loadObject(loader, fileNames, index, object, scene) {
    if (fileNames.length === index) {
      for (let i = 0; i < listOfModelObject.length; i++) {
        object.add(listOfModelObject[i]);
      }
      scene.add(object);
      attachMovement(object);
      console.log(JSON.stringify(object));
      return;
    }
    if (object != null) {
      listOfModelObject.push(object);
      console.log(object.name);
    }
    loadModelObjects(loader, fileNames, index, object, scene);
  }

  function loadModelObjects(loader, fileNames, index, parentObject, scene) {
    loader.load(
      fileNames[index],
      (object) => loadObject(loader, fileNames, index + 1, object, scene),
      (xhr) => modelLoadingProgress(xhr, fileNames[index]),
      (error) => errorHandling(error)
    );
  }

  function attachMovement(model) {
    // Add User Control To The Model To See The Model In 360 View.
    movement(model);
  }

  function render3D() {
    // Step 1: Get a camera object.
    const camera = getCamera(10);
    // Step 2: Get a scene object.
    const scene = getScene();
    // Step 3: Get a renderer object.
    const renderer = getRenderer(animation);
    // Step 4: Add renderer DOM to the actual DOM.
    addRenderer(document.getElementById("platform3d"), renderer);
    // Step 5: Load models object.
    const loader = new THREE.ObjectLoader();
    loadModelObjects(
      loader,
      [
        TOP_PLATE_MODEL,
        BOTTOM_PLATE_MODEL,
        BLADE_1,
        BLADE_2,
        BLADE_3,
        BLADE_4,
        BLADE_5,
        BLADE_6,
        BLADE_7,
        BLADE_8,
        ...CLAMP2,
        ...CLAMP3,
        ...CLAMP4,
        ...CLAMP5,
        ...CLAMP1,
        ...CLAMP6,
        HUB_MODEL,
      ],
      0,
      null,
      scene
    );
    // Step 6: Setup Ray Caster.
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    renderer.domElement.addEventListener(
      "dblclick",
      (event) => {
        clearPreviousObject();
        raycasting(
          raycaster,
          event,
          scene,
          mouse,
          camera,
          setPreviousObject,
          setOpenModel,
          setModelData
        );
      },
      false
    );

    // Animation Function.
    function animation(time) {
      renderer.render(scene, camera);
    }
  }
  function clearPreviousObject() {
    if (previousObject.current === null || previousObject.current === undefined)
      return;
    previousObject.current["MODEL_OBJECT"].material.color.set(
      HEXA_COLOR[previousObject.current["COLOR"]]
    );
  }

  function closeWindow() {
    clearPreviousObject();
    setOpenModel(false);
  }

  return (
    <>
      {openModel && <DraggableWindow data={modelData} close={closeWindow} />}
      <div id="platform3d"></div>
    </>
  );
}

export default TestPlatform;
