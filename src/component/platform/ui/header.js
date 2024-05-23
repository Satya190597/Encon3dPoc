import { Button } from "react-bootstrap";

function Header({ exportFn }) {
  return (
    <>
      <div className="header">
        <span>GeoVed 3D Model</span>&nbsp;&nbsp;
        <Button variant="danger" onClick={() => exportFn()}>
          Export
        </Button>
      </div>
    </>
  );
}
export default Header;
