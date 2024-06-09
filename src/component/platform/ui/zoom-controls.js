import { BsZoomIn } from "react-icons/bs";
import { BsZoomOut } from "react-icons/bs";
function ZoomControls({zoomIn,zoomOut}) {
  return (
    <>
      <div className="zoom-controls">
        <BsZoomIn onClick={zoomIn}/>
        <br/>
        <BsZoomOut onClick={zoomOut}/>
      </div>
    </>
  );
}

export default ZoomControls;
