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
import { useEffect } from "react";

function TestPlatform() {
  useEffect(() => {
    render3D();
  }, []);
  function render3D() {
    // Step 1: Get a camera object.
    const camera = getCamera(70);
    // Step 2: Get a scene object.
    const scene = getScene();
    // Step 3: Get a renderer object.
    const renderer = getRenderer(animation);
    // Step 4: Add renderer DOM to the actual DOM.
    addRenderer(document.getElementById("platform3d"), renderer);
    // Step 5: Get a model object.
    const model = getScrewObject(20,3);
    // Step 6: Set model object to the scene.

    scene.add(model);

    // Animation Function.
    function animation(time) {
      renderer.render(scene, camera);
    }
    // Add User Control To The Model To See The Model In 360 View.
    movement(model);
  }

  return (
    <>
      <div id="platform3d"></div>
    </>
  );
}

export default TestPlatform;
