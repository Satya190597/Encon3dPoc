import { Button, Navbar, Container, Nav } from "react-bootstrap";

function Header({ exportFn }) {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#">GeoVed 3D Model</Navbar.Brand>
        <Nav className="me-auto">
          <Button
            size="lg"
            variant="danger"
            onClick={exportFn}
            className="ms-2"
            id="download-link"
          >
            Export
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
