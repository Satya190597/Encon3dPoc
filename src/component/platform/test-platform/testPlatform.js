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
import Header from "../ui/header";
import Loaders from "../util/loading";
import ZoomControls from "../ui/zoom-controls";
import { loadTexture } from "../util/load-texture";
import ThemeControls from "../ui/theme";

const FAN_MODEL_ONE = "models/complete-model/fan.json";
const FAN_MODEL_TWO = "models/complete-model/fan-2.json";
const FAN_MODEL_THREE = "models/complete-model/fan-5.json";
const FAN_MODEL_FOUR = "models/complete-model/fan-4.json";

const FAN_MODEL_COMPLETE = "models/complete-model/Product1.json";

const TOP_PLATE_MODEL = "models/topPlate.json";
const HUB_MODEL = "models/hub.json";
const BOTTOM_PLATE_MODEL = "models/bottomPlate.json";
const TOP_PLATE_MODEL_4 = "models/topPlateF002.json";
const BOTTOM_PLATE_MODEL_4 = "models/bottomPlateF002.json";
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
];
const CLAMP7 = [
  "models/clamps/eight_blades_clamps/clamp7_b1.json",
  "models/clamps/eight_blades_clamps/clamp7_b2.json",
  "models/clamps/eight_blades_clamps/clamp7_t1.json",
  "models/clamps/eight_blades_clamps/clamp7_t2.json",
];
const CLAMP8 = [
  "models/clamps/eight_blades_clamps/clamp8_b1.json",
  "models/clamps/eight_blades_clamps/clamp8_b2.json",
  "models/clamps/eight_blades_clamps/clamp8_t1.json",
  "models/clamps/eight_blades_clamps/clamp8_t2.json",
];

function TestPlatform() {
  const listOfModelObject = [];
  var previousObject = useRef(null);
  const [openModel, setOpenModel] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [rendererObject, setRendererObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomValue, setZoomValue] = useState(0.1);
  const [toggleDarkMode, setToggleDarkMode] = useState(true);

  const setPreviousObject = (value) => (previousObject.current = value);
  useEffect(() => {
    render3D();
  }, [zoomValue, toggleDarkMode]);

  function modelLoadingProgress(xhr, name) {
    console.log(name + " : " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }

  function getFanId() {
    return new URLSearchParams(window.location.search).get("fanModelID");
  }

  function errorHandling(error, name) {
    console.log(name + " : " + error);
  }

  function setInitialMaterial(object) {
    debugger;
    if (
      (object.name === "TOP_PLATE" || object.name === "BOTTOM_PLATE") &&
      getFanId() === "CNE-4419-60"
    )
      object.material.color.set(0xbb8fce);
  }

  function loadObject(loader, fileNames, index, object, scene) {
    if (fileNames.length === index) {
      for (let i = 0; i < listOfModelObject.length; i++) {
        setInitialMaterial(listOfModelObject[i]);
        object.add(listOfModelObject[i]);
      }

      scene.add(object);
      attachMovement(object);
      console.log(JSON.stringify(object));
      setLoading(false);
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

  function loadPlates() {
    if (getFanId() === "ENC-5137-80") return [BOTTOM_PLATE_MODEL];
    if (getFanId() === "CNE-4579-60")
      return [TOP_PLATE_MODEL_4, BOTTOM_PLATE_MODEL_4];
    return [TOP_PLATE_MODEL, BOTTOM_PLATE_MODEL];
  }

  function getFanModelJsonObject() {
    const fanId = new URLSearchParams(window.location.search).get("fanModelID");
    if (fanId === "ENC-5137-80") {
      return FAN_MODEL_COMPLETE;
      //return FAN_MODEL_ONE;
    } else if (fanId == "CNE-4579-60") {
      return FAN_MODEL_COMPLETE;
      //return FAN_MODEL_TWO;
    } else if (fanId == "CNE-4419-60") {
      return FAN_MODEL_COMPLETE;
      //return FAN_MODEL_FOUR;
    } else {
      return FAN_MODEL_COMPLETE;
    }
  }
  function loadCompleteFanModel(loader, scene) {
    loader.load(
      getFanModelJsonObject(),
      (object) => {
        scene.add(object);
        object.scale.set(zoomValue, zoomValue, zoomValue);
        attachMovement(object);
        console.log(JSON.stringify(object));
        setLoading(false);
      },
      (xhr) => {},
      (error) => {}
    );
  }

  function zoomIn() {
    const currentZoomValue = zoomValue + 0.05;
    if (currentZoomValue >= 0.4) {
      alert("Maximum Zoom Achieved");
      return;
    }
    setZoomValue(currentZoomValue);
  }

  function zoomOut() {
    const currentZoomValue = zoomValue - 0.05;
    if (currentZoomValue <= 0.04) {
      alert("Minimum Zoom Achieved");
      setZoomValue(0.05);
      return;
    }
    setZoomValue(currentZoomValue);
  }

  function getBlades() {
    if (getFanId() === "CNE-4579-60")
      return [BLADE_1, BLADE_2, BLADE_3, BLADE_4];
    return [
      BLADE_1,
      BLADE_2,
      BLADE_3,
      BLADE_4,
      BLADE_5,
      BLADE_6,
      BLADE_7,
      BLADE_8,
    ];
  }

  function getClamps() {
    if (getFanId() === "CNE-4579-60")
      return [...CLAMP1, ...CLAMP2, ...CLAMP3, ...CLAMP4];
    return [
      ...CLAMP2,
      ...CLAMP3,
      ...CLAMP4,
      ...CLAMP5,
      ...CLAMP1,
      ...CLAMP6,
      ...CLAMP7,
      ...CLAMP8,
    ];
  }

  function fnToggleDarkMode() {
    setToggleDarkMode((value) => !value);
  }

  function render3D() {
    // Step 1: Get a camera object.
    const camera = getCamera(0.2);
    // Step 2: Get a scene object.
    const scene = getScene();
    scene.background = toggleDarkMode
      ? new THREE.Color(0x000000)
      : new THREE.Color(0xe8eaf6);
    // Step 3: Get a renderer object.
    const renderer = getRenderer(animation);
    // Step 4: Add renderer DOM to the actual DOM.
    addRenderer(document.getElementById("platform3d"), renderer);
    // Step 5: Load models object.
    const loader = new THREE.ObjectLoader();
    // loadModelObjects(
    //   loader,
    //   [...loadPlates(), ...getBlades(), ...getClamps(), HUB_MODEL],
    //   0,
    //   null,
    //   scene
    // );
    loadCompleteFanModel(loader, scene);
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

    setRendererObject(renderer);

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

  function changeColor(objectName, colorName) {
    debugger;
    previousObject.current["MODEL_OBJECT"].material.color.set(
      getColor(colorName)
    );
  }

  function getColor(colorName) {
    if (colorName === "Carbon Fiber") {
      return 0x8e44ad;
    } else {
      return 0x8ef4fb;
    }
  }

  function closeWindow() {
    clearPreviousObject();
    setOpenModel(false);
  }

  function exportFn() {
    if (!rendererObject) return;
    var imageData = rendererObject.domElement.toDataURL();
    const tempLink = document.createElement("a");
    tempLink.href = imageData;
    tempLink.setAttribute("download", "drawing.png");
    tempLink.click();
  }

  return (
    <>
      {loading && <Loaders />}
      {openModel && (
        <DraggableWindow
          data={modelData}
          close={closeWindow}
          changeColor={changeColor}
        />
      )}
      {!loading && (
        <Header exportFn={exportFn} fnToggleDarkMode={fnToggleDarkMode} isDarkMode={toggleDarkMode} />
      )}
      <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} />
      <div id="platform3d"></div>
    </>
  );
}

export default TestPlatform;
