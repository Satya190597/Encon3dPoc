import { useEffect, useState } from "react";
import { getCamera } from "./environment/camera";
import { getScene } from "./environment/scene";
import { getRenderer, addRenderer } from "./environment/renderer";
import { movement } from "./environment/control";
import { hub } from "./objects/hubObject";
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
import { blade } from "./objects/bladeObject";
import "bootstrap/dist/css/bootstrap.min.css";
import {plateObject} from "./objects/clamp";

function ClampRender() {
  

  useEffect(() => {
    render3D();
  }, []);

  function render3D() {
    const camera = getCamera(10);
    const scene = getScene();
    const plate = plateObject(4,0.2,0xF1C40F,0.2);
    scene.add(plate);

    //scene.add(bladeModel);
    const renderer = getRenderer(animation);

    addRenderer(document.getElementById("platform3d"), renderer);
    function animation(time) {
      //ubModel.rotation.y += rpm * 0.01;
      renderer.render(scene, camera);
    }
    movement(plate);
  }

  
 

  return (
    <>
      <div id="platform3d"></div>
    </>
  );
}

export default ClampRender;
