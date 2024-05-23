import Spinner from "react-bootstrap/Spinner";

function Loaders() {
  return (
    <div
      style={{
        minWidth: "100vh",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow:"hidden"
      }}
    >
      <Spinner animation="grow" variant="info" />
    </div>
  );
}

export default Loaders;
