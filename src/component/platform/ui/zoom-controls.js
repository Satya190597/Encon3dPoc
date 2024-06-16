import { BsZoomIn } from "react-icons/bs";
import { BsZoomOut } from "react-icons/bs";
import { Container, Button, Link } from "react-floating-action-button";
function ZoomControls({ zoomIn, zoomOut }) {
  return (
    <>
      <Container className="zoom-in">
        <Button
          tooltip="Zoom In"
          icon="fas fa-plus"
          onClick={() => zoomIn()}
        />
      </Container>
      <Container className="zoom-out">
        <Button
          tooltip="Zoom Out"
          icon="fas fa-minus"
          onClick={() => zoomOut()}
        />
      </Container>
    </>
  );
}

export default ZoomControls;
