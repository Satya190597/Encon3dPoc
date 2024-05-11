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

const MATERIAL_TYPE = [
  { name: "Material One", value: "MATERIAL_ONE", cost: 29999 },
  { name: "Material Two", value: "MATERIAL_TWO", cost: 49999 },
  { name: "Material Three", value: "MATERIAL_THREE", cost: 49999 },
];

const CLAMP_MATERIAL_TYPE = [
  { name: "Material One", value: "CLAMP_MATERIAL_ONE", cost: 9999 },
  { name: "Material Two", value: "CLAMP_MATERIAL_TWO", cost: 8999 },
  { name: "Material Three", value: "CLAMP_MATERIAL_THREE", cost: 2999 },
];

const HUB_DIAMETER = [
  { name: "1 M", value: 0, valueCal: 1 },
  { name: "2 M", value: 0.2, valueCal: 2 },
  { name: "3 M", value: 0.27, valueCal: 3 },
];

const BALDE_ANGLE = [
  { name: "1'", value: 0.3 },
  { name: "2'", value: 0.2 },
  { name: "3'", value: 0.1 },
];

const NUMBER_OF_BLADES = [
  { name: "One", value: 1 },
  { name: "Two", value: 2 },
  { name: "Four", value: 4 },
];

const PLATE_TYPE = [
  { name: "None", value: "NONE" },
  { name: "Double", value: "DOUBLE" },
  { name: "Single", value: "SINGLE" },
];

const BLADE_MATERIAL = [
  { name: "Blade Material One", value: "BLADE_MATERIAL_ONE", cost: 59999 },
  { name: "Blade Material Two", value: "BLADE_MATERIAL_TWO", cost: 89999 },
  { name: "Balde Material Three", value: "BLADE_MATERIAL_THREE", cost: 29999 },
];

const MATERIAL_COLOR = {
  MATERIAL_ONE: "#525d91",
  MATERIAL_TWO: "#03a2b0",
  MATERIAL_THREE: "#0085ff",
};

const CLAMP_MATERIAL_COLOR = {
  CLAMP_MATERIAL_ONE: "#D35400",
  CLAMP_MATERIAL_TWO: "#6C3483",
  CLAMP_MATERIAL_THREE: "#1E8449",
};

const BLADE_MATERIAL_COLOR = {
  BLADE_MATERIAL_ONE: "#707b7c",
  BLADE_MATERIAL_TWO: "#f4d03f",
  BLADE_MATERIAL_THREE: "#c0392b",
};

const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Material Info</Popover.Header>
    <Popover.Body>
      Fabricated steel is steel that has been transformed into a product or item
      through a process called steel fabrication.
    </Popover.Body>
  </Popover>
);

const unitpopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">RPM</Popover.Header>
    <Popover.Body>
      RPM stands for "revolutions per minute" and is a unit of measurement for
      rotational speed. It indicates how many times something rotates in a
      circle per minute.
    </Popover.Body>
  </Popover>
);

const anglepopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Blade Angle</Popover.Header>
    <Popover.Body>
      Blade angle refers to the orientation of a blade relative to its axis or
      the surface it's cutting. It's a critical aspect in various applications,
      especially in tools like knives, saws, and propellers.
    </Popover.Body>
  </Popover>
);

const hubdiameterpopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Hub Diameter</Popover.Header>
    <Popover.Body>
      The hub diameter refers to the diameter of the central component of a
      rotating device, such as a propeller, rotor, or turbine
    </Popover.Body>
  </Popover>
);

function Hub() {
  const [customize, setCustomize] = useState(false);
  const [materialTable, setMaterialTable] = useState(false);
  const [unitTable, setUnitTable] = useState(false);
  const [material, setMaterial] = useState(MATERIAL_TYPE[0].value);
  const [clampMaterial, setClampMaterial] = useState(
    CLAMP_MATERIAL_TYPE[0].value
  );
  const [bladeMaterial, setBladeMaterial] = useState(BLADE_MATERIAL[0].value);
  const [diameter, setDiameter] = useState(HUB_DIAMETER[0].value);
  const [diameterName, setDiameterName] = useState(HUB_DIAMETER[0].valueCal);
  const [plateType, setPlateType] = useState(PLATE_TYPE[0].value);
  const [numberOfBlades, setNumberOfBlades] = useState(
    NUMBER_OF_BLADES[1].value
  );
  const [bladeAngle, setBladeAngle] = useState(BALDE_ANGLE[0].value);
  const [rpm, setRpm] = useState(0);
  const [weight, setWeight] = useState(10);
  const [globalRenderer, setGlobalRenderer] = useState(null);

  const [bladeAxisAngle, setBladeAxisAngle] = useState(0);

  const [assembleHubAndPlate, setAssembleHubAndPlate] = useState(false);

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
    setDiameterName(
      HUB_DIAMETER.filter(
        (element) => element.value === parseFloat(event.target.value)
      )[0].valueCal
    );
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
  function hideMaterialTable() {
    setMaterialTable(false);
  }
  function openMaterialTable() {
    setMaterialTable(true);
  }
  function hideUnitTable() {
    setUnitTable(false);
  }
  function openUnitTable() {
    setUnitTable(true);
  }
  function changeBladeAxisAngle(event) {
    setBladeAxisAngle(parseFloat(event.target.value));
  }
  function changeHubAndPlateAssembleFlag() {
    setAssembleHubAndPlate(!assembleHubAndPlate);
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
    rpm,
    bladeAxisAngle,
    assembleHubAndPlate
  ]);

  function render3D() {
    const camera = getCamera(10);
    const scene = getScene();
    const hubModel = hub(
      material,
      diameter,
      weight / 100,
      plateType,
      clampMaterial,
      numberOfBlades,
      scene,
      assembleHubAndPlate
    );
    let bladeModel = blade(bladeMaterial, bladeAngle);
    const bladeA = blade(bladeMaterial, bladeAngle);
    adjustBladeModelPosition(bladeModel);
    adjustBladeModelPositionX(bladeA)
    if (numberOfBlades >= 1) {
      hubModel.add(bladeModel);
     
    }
    if (numberOfBlades >= 2) {
      hubModel.add(mirronBaldeModelPosition(bladeModel.clone()));
    }
    if(numberOfBlades >= 4) {
      hubModel.add(bladeA);
      hubModel.add(mirrionBladeModelPostitionX(bladeA));
    }
    
    scene.add(hubModel);

    const renderer = getRenderer(animation);
    setGlobalRenderer(renderer);
    addRenderer(document.getElementById("platform3d"), renderer);

    // var wireframeGeometry = new THREE.EdgesGeometry(hubModel.geometry); // Edges geometry
    // var wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000,linewidth: 5 }); // Wireframe material
    // var wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    // scene.add(wireframe)

    //updateWireframePosition(wireframe,hubModel)

    function animation(time) {
      hubModel.rotation.y += rpm * 0.01;
      renderer.render(scene, camera);
      //updateWireframePosition(wireframe,hubModel)
      
    }
    movement(hubModel);
  }

  function updateWireframePosition(wireframe,mesh) {
    wireframe.position.copy(mesh.position);
    wireframe.rotation.copy(mesh.rotation);
    wireframe.scale.copy(mesh.scale);
}

  function adjustBladeModelPositionX(bladeModel) {
    bladeModel.position.set(0, 0, 6);
    bladeModel.rotation.x =  Math.PI/2; // TODO : Add Balde Rotation
    bladeModel.rotation.y = -(Math.PI/2)+bladeAxisAngle;
    bladeModel.rotation.z = 0;
  }



  function mirrionBladeModelPostitionX(bladeModel) {
    const blade = bladeModel.clone();
    blade.position.set(-blade.position.x,-blade.position.y,-blade.position.z);
    blade.rotation.x = -blade.rotation.x;
    blade.rotation.y = -blade.rotation.y;
    return blade;
  }

  function adjustBladeModelPosition(bladeModel) {
    bladeModel.position.set(6, 0, 0);
    bladeModel.rotation.x = bladeAxisAngle; // TODO : Add Balde Rotation
    bladeModel.rotation.y = 0;
    bladeModel.rotation.z = -1.6;
  }

  function mirronBaldeModelPosition(bladeModel) {
    bladeModel.position.set(-6, 0, 0);
    bladeModel.rotation.x = bladeAxisAngle; // TODO : Add Balde Rotation
    bladeModel.rotation.y = 3.1;
    bladeModel.rotation.z = -1.6;
    return bladeModel;
  }

  function getColor(colors, name) {
    return colors[name];
  }

  function exportImage() {
    if (rpm > 0) {
      alert("Please stop any animation before exporting.");
      return;
    }
    if (!globalRenderer) return;
    var imageData = globalRenderer.domElement.toDataURL();
    const tempLink = document.createElement("a");
    tempLink.href = imageData;
    tempLink.setAttribute("download", "drawing.png");
    tempLink.click();
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#">GeoVed 3D Model</Navbar.Brand>
          <Nav className="me-auto">
            <Button size="lg" onClick={showCustomizeOption}>
              Customize Hub
            </Button>
            <Button size="lg" onClick={openMaterialTable} className="ms-2">
              Material Table
            </Button>
            <Button size="lg" onClick={openUnitTable} className="ms-2">
              Unit Table
            </Button>
            <Button
              size="lg"
              variant="danger"
              onClick={exportImage}
              className="ms-2"
              id="download-link"
            >
              Export
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Offcanvas show={customize} onHide={hideCustomizeOption}>
        <OffcanvasHeader closeButton>
          <h2>Custommize Hub</h2>
        </OffcanvasHeader>
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
          <Form.Label className="mt-2">Blade Tip Angle</Form.Label>
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

          <Form.Label className="mt-2">
            Blade Angle : {bladeAxisAngle}
          </Form.Label>
          <Form.Range
            min={0}
            max={2}
            step={0.01}
            onChange={changeBladeAxisAngle}
            value={bladeAxisAngle}
          />
          <Form.Check
            checked={assembleHubAndPlate}
            onChange={changeHubAndPlateAssembleFlag}
            className="mt-2"
            type="switch"
            id="assemble-hub-panel"
            label="Assemble Hub And Plate"
          />
        </OffcanvasBody>
      </Offcanvas>
      {
        //=============================================================================
      }
      <Offcanvas
        show={materialTable}
        onHide={hideMaterialTable}
        placement="end"
      >
        <OffcanvasHeader closeButton>
          <h2>Materials</h2>
        </OffcanvasHeader>
        <OffcanvasBody>
          <span>
            <b>Hub Material</b>
          </span>
          <Table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_TYPE.map((element) => {
                return (
                  <tr>
                    <td style={{ cursor: "pointer" }}>
                      <OverlayTrigger
                        trigger="click"
                        placement="left"
                        overlay={popover}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: getColor(
                              MATERIAL_COLOR,
                              element.value
                            ),
                          }}
                        ></div>
                      </OverlayTrigger>
                    </td>
                    <td
                      className={
                        material === element.value ? "text-white bg-dark" : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => setMaterial(element.value)}
                    >
                      <div>
                        {element.name}
                        <br></br>Material Cost : <b>{element.cost}</b>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <span>
            <b>Clamp Material</b>
          </span>
          <Table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {CLAMP_MATERIAL_TYPE.map((element) => {
                return (
                  <tr>
                    <td style={{ cursor: "pointer" }}>
                      <OverlayTrigger
                        trigger="click"
                        placement="left"
                        overlay={popover}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: getColor(
                              CLAMP_MATERIAL_COLOR,
                              element.value
                            ),
                          }}
                        ></div>
                      </OverlayTrigger>
                    </td>
                    <td
                      className={
                        clampMaterial === element.value
                          ? "text-white bg-dark"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => setClampMaterial(element.value)}
                    >
                      <div>
                        {element.name}
                        <br></br>Material Cost : <b>{element.cost}</b>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <span>
            <b>Blade Material</b>
          </span>
          <Table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {BLADE_MATERIAL.map((element) => {
                return (
                  <tr>
                    <td style={{ cursor: "pointer" }}>
                      <OverlayTrigger
                        trigger="click"
                        placement="left"
                        overlay={popover}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: getColor(
                              BLADE_MATERIAL_COLOR,
                              element.value
                            ),
                          }}
                        ></div>
                      </OverlayTrigger>
                    </td>
                    <td
                      className={
                        bladeMaterial === element.value
                          ? "text-white bg-dark"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => setBladeMaterial(element.value)}
                    >
                      <div>
                        {element.name}
                        <br></br>Material Cost : <b>{element.cost}</b>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </OffcanvasBody>
      </Offcanvas>
      {
        //=============================================================================
      }
      <Offcanvas show={unitTable} onHide={hideUnitTable} placement="end">
        <OffcanvasHeader closeButton>
          <h2>Unit Table</h2>
        </OffcanvasHeader>
        <OffcanvasBody>
          <Table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Actual Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={unitpopover}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <Badge pill bg="primary">
                        !
                      </Badge>{" "}
                      <b>1 RPM</b>
                    </span>
                  </OverlayTrigger>
                </td>
                <td>0.02 RPS Rpm</td>
              </tr>
              <tr>
                <td>
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={anglepopover}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <Badge pill bg="primary">
                        !
                      </Badge>{" "}
                      <b>1 ' Blade Angle</b>
                    </span>
                  </OverlayTrigger>
                </td>
                <td>45 '</td>
              </tr>
              <tr>
                <td>
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={hubdiameterpopover}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <Badge pill bg="primary">
                        !
                      </Badge>{" "}
                      <b>Hub Diameter - {diameterName} mm</b>
                    </span>
                  </OverlayTrigger>
                </td>
                <td>{((diameterName + 1) * 0.0393701).toFixed(5)} Inch</td>
              </tr>
            </tbody>
          </Table>
        </OffcanvasBody>
      </Offcanvas>
      <div id="platform3d"></div>
    </>
  );
}

export default Hub;
