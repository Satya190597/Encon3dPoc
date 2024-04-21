import { useEffect } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

function Platform() {
  useEffect(() => {
    render3D();
  }, []);
  function render3D() {
    const width = window.innerWidth,
      height = window.innerHeight;

    // init

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    const camera2D = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      10000
    );
    camera.position.z = 5;

    const scene = new THREE.Scene();

    const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
    const material = new THREE.MeshNormalMaterial();

    // ==================== # Create Geometry ====================
    const bottomCylinderGeometry = new THREE.CylinderGeometry(
      0.25,
      0.25,
      0.3,
      32
    );
    const bottomCylinderHolderGeometry = new THREE.CylinderGeometry(
      0.3,
      0.3,
      0.1,
      32
    );
    const bladeGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 3);
    const bladeSubstractGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 3);

    // ==================== # Create Mesh ====================
    const bottonCylinder = new THREE.Mesh(bottomCylinderGeometry, material);
    const bottonCylinderHolder = new THREE.Mesh(
      bottomCylinderHolderGeometry,
      material
    );
    const blade = new THREE.Mesh(bladeGeometry, material);
    const bladeSubstract = new THREE.Mesh(bladeSubstractGeometry, material);

    // ==================== # Set Position ====================
    bottonCylinderHolder.position.set(0, -0.2, 0);
    blade.position.set(0, 1.5, -0.1);
    blade.rotation.y = 1;

    bladeSubstract.position.set(0, 1.5, 0.4);
    // ==================== # Update Matrix ====================
    bottonCylinder.updateMatrix();
    bottonCylinderHolder.updateMatrix();
    blade.updateMatrix();
    bladeSubstract.updateMatrix();

    // ==================== # Perform CSG ====================
    const bladeHandle = CSG.union(bottonCylinderHolder, bottonCylinder);
    const fan = CSG.union(bladeHandle, blade);

    // const makeHoleCylinder = new THREE.CylinderGeometry(0.1, 0.1, 0.3,32);
    bladeHandle.position.y = -1.5;

    console.log(bladeHandle.position.x);
    console.log(bladeHandle.position.y);
    console.log(bladeHandle.position.z);

    fan.rotation.z = -1.6
    scene.add(fan);
    //scene.add(hole);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);
    const element = document.getElementById("App");

    element.appendChild(renderer.domElement);

    // animation

    function animation(time) {
      //mesh.rotation.x = time / 2000;
      //mesh.rotation.y = time / 1000;
      //bladeHandle.rotation.z += 0.01
      //blade.rotation.y += 0.01
      renderer.render(scene, camera);
    }

    // Movement.
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0,
    };
    document.addEventListener("mousedown", (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y,
        };
        console.log("X ---> ", bladeHandle.rotation.x);
        console.log("Y ---> ", bladeHandle.rotation.y);
        console.log("Z ---> ", bladeHandle.rotation.z);
        fan.rotation.y += deltaMove.x * 0.01;
        fan.rotation.x += deltaMove.y * 0.01;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    });

    // Function to handle mouse wheel events for zooming
    // function onMouseWheel(event) {
    //   // Adjust the camera's position along its local z-axis based on the mouse wheel delta
    //   camera.position.z += event.deltaY * 0.1;
    // }

    // Add event listener for mouse wheel events
    // document.addEventListener("wheel", onMouseWheel);
  }

  return <div id="platform3d"></div>;
}

export default Platform;
