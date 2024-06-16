import { Button } from "react-bootstrap";
import { MoonFill, SunFill } from "react-bootstrap-icons";

function Header({ exportFn, fnToggleDarkMode, isDarkMode }) {
  const getHeaderStyle = () => {
    return isDarkMode ? "header" : "header-light";
  };
  return (
    <>
      <div className={getHeaderStyle()}>
        <span>GeoVed 3D Model</span>
        &nbsp;&nbsp;
        <Button variant="danger" onClick={() => exportFn()}>
          Export
        </Button>
        {!isDarkMode && (
          <MoonFill
            style={{ marginLeft: "5px", cursor: "pointer" }}
            onClick={() => {
              fnToggleDarkMode();
            }}
          />
        )}
        {isDarkMode && (
          <SunFill
            style={{ marginLeft: "5px", cursor: "pointer" }}
            onClick={() => {
              fnToggleDarkMode();
            }}
          />
        )}
      </div>
    </>
  );
}
export default Header;
