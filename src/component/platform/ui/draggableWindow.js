import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import CloseButton from "react-bootstrap/CloseButton";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
function DraggableWindow({ data, close, changeColor }) {
  const [details, setDetails] = useState();
  const [image, setImage] = useState();
  const [material, setMaterial] = useState([]);
  useEffect(() => {
    fetch("details/fan.json")
      .then((response) => response.json())
      .then((result) => {
        if (data.title.toLowerCase() === "screw") {
          setDetails(result["SCREW"]["DETAILS"]);
          setImage(result["SCREW"]["IMAGE"]);
        } else if (data.title.toLowerCase() === "hub") {
          setDetails(result["HUB"]["DETAILS"]);
          setImage(result["HUB"]["IMAGE"]);
        } else if (data.title.toLowerCase() === "plate") {
          setDetails(result["PLATE"]["DETAILS"]);
          setImage(result["PLATE"]["IMAGE"]);
        } else if (data.title.toLowerCase() === "blade") {
          //setDetails(result["BLADE"]["DETAILS"]);
          setImage(result["BLADE"]["IMAGE"]);
          debugger;
          if (result["BLADE"]["MATERIAL"]) {
            setMaterial(result["BLADE"]["MATERIAL"]);
          }
        } else if (data.title.toLowerCase() === "clamp") {
          setDetails(result["CLAMP"]["DETAILS"]);
          setImage(result["CLAMP"]["IMAGE"]);
        } else if (data.title.toLowerCase() === "taper bush") {
          setDetails(result["TAPER_BUSH"]["DETAILS"]);
          setImage(result["TAPER_BUSH"]["IMAGE"]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data]);
  useEffect(() => {
    // Innitialize Controls
    dragElements();
  }, []);
  function dragElements() {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const draggableElements = document.getElementsByClassName("draggable")[0];
    draggableElements.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - draggableElements.getBoundingClientRect().left;
      offsetY = e.clientY - draggableElements.getBoundingClientRect().top;
      draggableElements.style.cursor = "grabbing";
    });

    draggableElements.addEventListener("mousemove", (e) => {
      e.preventDefault();
      if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        draggableElements.style.left = `${x}px`;
        draggableElements.style.top = `${y}px`;
      }
    });

    draggableElements.addEventListener("mouseup", () => {
      isDragging = false;
      draggableElements.style.cursor = "move";
    });
  }
  return (
    <div className="draggable">
      <Navbar expand="lg">
        <Nav className="me-auto">
          <Nav.Item>
            <h1>{data.title}</h1>
          </Nav.Item>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Item>
            <CloseButton onClick={close} />
          </Nav.Item>
        </Nav>
      </Navbar>
      <p>{details}</p>
      <Image src={image} thumbnail width="300px" height="200px" />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Blade Natural Frequency Mode 1</td>
            <td>15 Hz</td>
          </tr>
          <tr>
            <td>Blade Type</td>
            <td>U-Type</td>
          </tr>
          <tr>
            <td>Blade Natural Frequency Mode 2</td>
            <td>15.25 Hz</td>
          </tr>
          <tr>
            <td>Shoulder Chord</td>
            <td>48.2 mm</td>
          </tr>
          <tr>
            <td>Tip Chord</td>
            <td>19.28</td>
          </tr>
          <tr>
            <td>Tip Angle Deviation From Chord</td>
            <td>7 o</td>
          </tr>
          <tr>
            <td>Twist</td>
            <td>15 o</td>
          </tr>
          <tr>
            <td>Blade Length</td>
            <td>241 mm</td>
          </tr>
          <tr>
            <td>Blade Material</td>
            <td>FRP</td>
          </tr>
          <tr>
            <td>Blade Angle min</td>
            <td>4 o</td>
          </tr>
          <tr>
            <td>Blade Angle max</td>
            <td>18 o</td>
          </tr>
        </tbody>
      </Table>
      {/*
          ================ These changes are deprecated as per client requirement. ================
        */}
      {/* {material.length > 0 && (
        <>
          <br />
          <label>Select Material</label>
          <br />
          <Form.Select
            onChange={(event) => {
              debugger;
              changeColor(data.title.toUpperCase() + "_", event.target.value);
            }}
          >
            {material.map((element) => {
              return <option value={element}>{element}</option>;
            })}
          </Form.Select>
        </>
      )} */}
    </div>
  );
}

export default DraggableWindow;
