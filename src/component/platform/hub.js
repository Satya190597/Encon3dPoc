import { useEffect, useState } from "react";
import { getCamera } from "./environment/camera";
import { getScene } from "./environment/scene";
import { getRenderer, addRenderer } from "./environment/renderer";
import { movement } from "./environment/control";
import { hub } from "./objects/hubObject";
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
import { blade } from "./objects/bladeObject";
import "bootstrap/dist/css/bootstrap.min.css";

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

const BALDE_ANGLE = [
  { name: "1'", value: 0.3 },
  { name: "2'", value: 0.2 },
  { name: "3'", value: 0.1 },
];

const NUMBER_OF_BLADES = [
  { name: "One", value: 1 },
  { name: "Two", value: 2 },
];

const PLATE_TYPE = [
  { name: "None", value: "NONE" },
  { name: "Double", value: "DOUBLE" },
  { name: "Single", value: "SINGLE" },
];

const BLADE_MATERIAL = [
  { name: "Blade Material One", value: "BLADE_MATERIAL_ONE" },
  { name: "Blade Material Two", value: "BLADE_MATERIAL_TWO" },
  { name: "Balde Material Three", value: "BLADE_MATERIAL_THREE" },
];

function Hub() {
  const [customize, setCustomize] = useState(false);
  const [material, setMaterial] = useState(MATERIAL_TYPE[0].value);
  const [clampMaterial, setClampMaterial] = useState(
    CLAMP_MATERIAL_TYPE[0].value
  );
  const [bladeMaterial, setBladeMaterial] = useState(BLADE_MATERIAL[0].value);
  const [diameter, setDiameter] = useState(HUB_DIAMETER[0].value);
  const [plateType, setPlateType] = useState(PLATE_TYPE[0].value);
  const [numberOfBlades, setNumberOfBlades] = useState(
    NUMBER_OF_BLADES[1].value
  );
  const [bladeAngle, setBladeAngle] = useState(BALDE_ANGLE[0].value);
  const [rpm, setRpm] = useState(0);
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
    setClampMaterial(event.target.value);
  }

  function addBlade(event) {
    setNumberOfBlades(parseInt(event.target.value));
  }

  function addBladeMaterial(event) {
    setBladeMaterial(event.target.value);
  }

  function changeBladeAngle(event) {
    setBladeAngle(parseFloat(event.target.value));
  }
  function changeRpm(event) {
    setRpm(parseInt(event.target.value));
  }

  useEffect(() => {
    render3D();
  }, []);

  useEffect(() => {
    render3D();
  }, [
    material,
    diameter,
    weight,
    plateType,
    clampMaterial,
    numberOfBlades,
    bladeMaterial,
    bladeAngle,
    rpm
  ]);

  function render3D() {
    const camera = getCamera(5);
    const scene = getScene();
    const hubModel = hub(
      material,
      diameter,
      weight / 100,
      plateType,
      clampMaterial
    );
    let bladeModel = blade(bladeMaterial, bladeAngle);
    adjustBladeModelPosition(bladeModel);
    if (numberOfBlades >= 1) hubModel.add(bladeModel);
    if (numberOfBlades >= 2)
      hubModel.add(mirronBaldeModelPosition(bladeModel.clone()));
    scene.add(hubModel);

    //scene.add(bladeModel);
    const renderer = getRenderer(animation);
    addRenderer(document.getElementById("platform3d"), renderer);
    function animation(time) {
      hubModel.rotation.y += rpm*0.01;
      renderer.render(scene, camera);
    }
    movement(hubModel);
  }

  function adjustBladeModelPosition(bladeModel) {
    bladeModel.position.set(3.5, 0, 0);
    bladeModel.rotation.x = 1.6;
    bladeModel.rotation.y = 0;
    bladeModel.rotation.z = -1.6;
  }

  function mirronBaldeModelPosition(bladeModel) {
    bladeModel.position.set(-3.5, 0, 0);
    bladeModel.rotation.x = 1.6;
    bladeModel.rotation.y = 3.1;
    bladeModel.rotation.z = -1.6;
    return bladeModel;
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
          <Form.Label className="mt-2">Hub Diameter (mm)</Form.Label>
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
          <Form.Select onChange={addBlade} value={numberOfBlades}>
            {NUMBER_OF_BLADES.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Blade Material</Form.Label>
          <Form.Select onChange={addBladeMaterial} value={bladeMaterial}>
            {BLADE_MATERIAL.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">Blade Angle</Form.Label>
          <Form.Select onChange={changeBladeAngle} value={bladeAngle}>
            {BALDE_ANGLE.map((element) => {
              return (
                <option value={element.value} key={element.value}>
                  {element.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Label className="mt-2">RPM : {rpm}</Form.Label>
          <Form.Range min={0} max={20} onChange={changeRpm} value={rpm} />
        </OffcanvasBody>
      </Offcanvas>
      <div id="platform3d"></div>
    </>
  );
}

export default Hub;
