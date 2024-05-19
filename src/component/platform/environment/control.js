export function movement(object) {
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };
  document.getElementById("platform3d").addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  });

  document.getElementById("platform3d").addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.getElementById("platform3d").addEventListener("mousemove", (event) => {
    if (isDragging) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      object.rotation.y += deltaMove.x * 0.01;
      object.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  });
}
