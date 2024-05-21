import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import CloseButton from "react-bootstrap/CloseButton";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
function DraggableWindow({ data, close }) {
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
          setDetails(result["BLADE"]["DETAILS"]);
          setImage(result["BLADE"]["IMAGE"]);
          debugger;
          if (result["BLADE"]["MATERIAL"]) {
            setMaterial(result["BLADE"]["MATERIAL"]);
          }
        } else if (data.title.toLowerCase() === "clamp") {
          setDetails(result["CLAMP"]["DETAILS"]);
          setImage(result["CLAMP"]["IMAGE"]);
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
            <td>Diameter</td>
            <td>20 MM</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>10 MM</td>
          </tr>
          <tr>
            <td>Width</td>
            <td>5 MM</td>
          </tr>
        </tbody>
      </Table>
      <label>Select Material</label>
      <Form.Select>
        {material.map((element) => {
          return <option value={element}>{element}</option>;
        })}
      </Form.Select>
    </div>
  );
}

export default DraggableWindow;
