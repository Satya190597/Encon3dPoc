import { Container, Button, Link } from "react-floating-action-button";
function ThemeControls(props) {
  return (
    <>
      <Container className="theme-controls">
        <Button tooltip="Dark Mode" icon="fas fa-moon" onClick={() => {}} />
      </Container>
    </>
  );
}

export default ThemeControls;
