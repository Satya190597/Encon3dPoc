import { useEffect, useState } from "react";
import { getCamera } from "./environment/camera";
import { getScene } from "./environment/scene";
import { getRenderer, addRenderer } from "./environment/renderer";
import { movement } from "./environment/control";
import { blade } from "./objects/bladeObject";
import { CSG } from "three-csg-ts";
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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { cube } from "./objects/cubeObject";

const MATERIAL_TYPE = [
  { name: "Material One", value: "MATERIAL_ONE" },
  { name: "Material Two", value: "MATERIAL_TWO" },
  { name: "Material Three", value: "MATERIAL_THREE" },
];

const CLAMP_MATERIAL_TYPE = [
  { name: "Material One", value: "CLAMP_MATERIAL_ONE" },
  { name: "Material Two", value: "CLAMP_MATERIAL_TWO" },
  { name: "Material Three", value: "CLAMP_MATERIAL_THREE" },
];

const HUB_DIAMETER = [
  { name: "1 M", value: 0 },
  { name: "2 M", value: 0.2 },
  { name: "3 M", value: 0.27 },
];

const NUMBER_OF_BLADES = [
  { name: "One", value: 1 },
  { name: "Two", value: 2 },
]

const PLATE_TYPE = [
  { name: "None", value: "NONE" },
  { name: "Double", value: "DOUBLE" },
  { name: "Single", value: "SINGLE" },
];

function Blade() {
  const [customize, setCustomize] = useState(false);
  const [material, setMaterial] = useState(MATERIAL_TYPE[0].value);
  const [clampMaterial, setClampMaterial] = useState(CLAMP_MATERIAL_TYPE[0].value);
  const [diameter, setDiameter] = useState(HUB_DIAMETER[0].value);
  const [plateType, setPlateType] = useState(PLATE_TYPE[0].value);

  const [weight, setWeight] = useState(10);

  function showCustomizeOption() {
    setCustomize(true);
  }

  function hideCustomizeOption() {
    setCustomize(false);
  }

  function changeMaterial(event) {
    setMaterial(event.target.value);
  }

  function changeDiameter(event) {
    setDiameter(parseFloat(event.target.value));
  }

  function changeWeight(event) {
    setWeight(parseFloat(event.target.value));
  }

  function changePlateType(event) {
    setPlateType(event.target.value);
  }

  function changeClampMaterial(event) {
    setClampMaterial(event.target.value)
  }

  useEffect(() => {
    render3D();
  }, []);

  useEffect(() => {
    render3D();
  }, [material, diameter, weight, plateType,clampMaterial]);

  function render3D() {
    const camera = getCamera(5);
    const scene = getScene();

    const baldeModel = blade();
    const cubeModel = cube();
    baldeModel.rotation.y=1.6;
    baldeModel.updateMatrix();
    //const finalBlade = CSG.subtract(baldeModel,cubeModel);
    

    scene.add(baldeModel);
    const renderer = getRenderer(animation);
    addRenderer(document.getElementById("platform3d"), renderer);
    function animation(time) {
      renderer.render(scene, camera);
    }
    movement(baldeModel);
    //movement(cubeModel)
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#">ENCON 3D</Navbar.Brand>
          <Nav className="me-auto">
            <Button size="lg" onClick={showCustomizeOption}>
              Customize Hub
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Offcanvas show={customize} onHide={hideCustomizeOption}>
        <OffcanvasHeader closeButton>Custommize Hub</OffcanvasHeader>
        <OffcanvasBody>
          <Form.Label>Hub Material</Form.Label>
          <Form.Select onChange={changeMaterial} value={material}>
            {MATERIAL_TYPE.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Hub Diameter (m)</Form.Label>
          <Form.Select onChange={changeDiameter} value={diameter}>
            {HUB_DIAMETER.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Weight : {weight} Kg</Form.Label>
          <Form.Range
            min={10}
            max={100}
            onChange={changeWeight}
            value={weight}
          />
          <Form.Label className="mt-2">Plate Type</Form.Label>
          <Form.Select onChange={changePlateType} value={plateType}>
            {PLATE_TYPE.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Clamp Material</Form.Label>
          <Form.Select onChange={changeClampMaterial} value={clampMaterial}>
            {CLAMP_MATERIAL_TYPE.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Number Of Blades</Form.Label>
          <Form.Select onChange={changeClampMaterial} value={clampMaterial}>
            {NUMBER_OF_BLADES.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
        </OffcanvasBody>
      </Offcanvas>
      <div id="platform3d"></div>
    </>
  );
}

export default Blade;
