import { useEffect, useRef, useState } from "react";
import shapeFactory from "../shapeFactory/ShapeFactory";
import { makeLine } from "./Line";
import { stopLineDrawingMode } from "./Line";
import { handleSave } from "../SaveStateToBack/SaveStateToBack";

function Buttons({ canvas, color }) {
  const factory = useRef(null);
  const lineRef = useRef(null);
  // Initialize Shape Factory
  useEffect(() => {
    const myFactory = new shapeFactory();
    factory.current = myFactory;
  }, []);
  const [isLine, setIsLine] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null); // Track the selected shape
  const [properties, setProperties] = useState({
    width: 0,
    height: 0,
    radius: 0,
    side:0 ,
    rx:0 ,
    ry:0 ,
    strokeWidth: 3,
    fill: "#FFFFFF",
  });

  // Add Shape to Canvas
  const addShape = ({ typeOfShape, radius = 0, width = 0,strokeWidth = 3, height = 0 , x1=100 , y1=100 , x2 =200, y2=200}) => {
    if (!canvas.current) return;
    setIsLine(false);
    const shape = factory.current.createShape({
      shape: typeOfShape,
      color: color,
      radius: radius,
      width: width,
      strokeWidth: strokeWidth,
      height: height,
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    });
    if (shape.get("width")===shape.get("height")) shape.set("type", "square")
    console.log(shape)
    canvas.current.add(shape);
    canvas.current.setActiveObject(shape);
    handleSelection({ target: shape }); // Simulate selection after adding
    handleSave({canvas});
    canvas.current.renderAll();
  };
  
  
  // Handle Shape Selection
  useEffect(() => {
    if (!canvas.current) return;
    const handleSelectionCleared = () => {
      setSelectedShape(null);
      setProperties({
        width: 0,
        height: 0,
        radius: 0,
        side :0 ,
        rx :0,
        ry :0,
        strokeWidth: 3,
        fill: "#FFFFFF",
      });
    };
    canvas.current.on("selection:created", handleSelection);
    canvas.current.on("selection:updated", handleSelection);
    canvas.current.on("object:modified", handleSelection);
    canvas.current.on("selection:cleared", handleSelectionCleared);
    return () => {
      canvas.current.off("selection:created", handleSelection);
      canvas.current.off("selection:updated", handleSelection);
      canvas.current.off("object:modified", handleSelection);
      canvas.current.off("selection:cleared", handleSelectionCleared);
    }
  }, [canvas.current]);


  const handleSelection = () => {
    const activeObject = canvas.current.getActiveObject();
    if (!activeObject) return;
    // console.log(activeObject.type)
    // console.log(activeObject.get("width"))
    // console.log(activeObject.get("height"))
    setSelectedShape(activeObject);
    setProperties({
      width: activeObject.width * activeObject.scaleX || 0,
      height: activeObject.height * activeObject.scaleY || 0,
      rx: activeObject.rx * activeObject.scaleX || 0,
      ry: activeObject.ry * activeObject.scaleY || 0,
      side :activeObject.width * activeObject.scaleX || 0,
      radius: activeObject.radius || 0,
      strokeWidth: activeObject.strokeWidth || 3,
      fill: activeObject.fill || "#FFFFFF",
    });
    handleSave({canvas});
    canvas.current.renderAll();
  };

  const updateProperty = (property, value) => {
    if (!selectedShape) return;
    if (property === "width" || property === "height") {
      const scaleValue = value / (property === "width" ? selectedShape.width : selectedShape.height);
      if (property === "width") {
        selectedShape.scaleX = scaleValue;
      } else {
        selectedShape.scaleY = scaleValue;
      }
    } else if (property === "radius") {
      selectedShape.set("radius", value);
    } else if (property === "side") {
      selectedShape.set("width", value);
      selectedShape.set("height", value);
    } else if (property === "rx" || property === "ry"){
      const scaleValue = value / (property === "rx" ? selectedShape.rx : selectedShape.ry);
      if (property === "rx") {
        selectedShape.scaleX = scaleValue;
      } else {
        selectedShape.scaleY = scaleValue;
      }
    }
     else if (property === "strokeWidth") {
      selectedShape.set("strokeWidth", value);
    } 
    else {
      selectedShape.set(property, value);
    }
    setProperties((prev) => ({ ...prev, [property]: value }));
    handleSave({canvas});
    canvas.current.renderAll();
  };

  return (
    <div className="container">
      <button onClick={() => addShape({ typeOfShape: "circle" })} title="Circle" className="button">⚫</button>
      <button onClick={() => addShape({ typeOfShape: "ellipse" })} title="Ellipse" className="button">⬭</button>
      <button onClick={() => makeLine(canvas.current, color, setIsLine, lineRef)} title="Line" className="button">📏</button>
      <button onClick={() => addShape({ typeOfShape: "rectangle" })} title="Rectangle" className="button">█</button>
      <button onClick={() => addShape({ typeOfShape: "square" })} title="Square"className="button">⬛</button>
      <button onClick={() => addShape({ typeOfShape: "triangle" })} title="Triangle" className="button">🔺</button>

      {/* Toolbox for Selected Shape Properties */}
      {selectedShape && (
        <div className="toolbox">
          <p>Edit Shape Properties</p>
          {(selectedShape.type === "rect" || selectedShape.type === "triangle") && ( selectedShape.get("width")!== selectedShape.get("height") ) && (
            <>
              <label>
                Width:
                <input
                  type="range"
                  min="10"
                  max={canvas.current.getWidth()}
                  step="1"
                  value={properties.width}
                  onChange={(e) => updateProperty("width", Number(e.target.value))}
                />
                <label>{Math.round(properties.width)}</label>
                <br/><br/>
              </label>
              <label>
                Height:
                <input
                  type="range"
                  min="10"
                  max={canvas.current.getHeight()}
                  step="1"
                  value={properties.height}
                  onChange={(e) => updateProperty("height", Number(e.target.value))}
                />
                <label>{Math.round(properties.height)}</label>
                <br/><br/>
              </label>
            </>
          )}
          {selectedShape.type === "circle" && (
            <label>
              Radius:
              <input
                type="range"
                min="10"
                max={canvas.current.getWidth()/2}
                step="1"
                value={properties.radius}
                onChange={(e) => updateProperty("radius", Number(e.target.value))}
              />
              <label>{Math.round(properties.radius*selectedShape.get("scaleX"))}</label>
              <br/><br/>
            </label>
          )}
          {selectedShape.type === "rect" && selectedShape.get("width")===selectedShape.get("height") && (
            <label>
              Side:
              <input
                type="range"
                min="10"
                max={canvas.current.getWidth()/2}
                step="1"
                value={properties.side}
                onChange={(e) => updateProperty("side", Number(e.target.value))}
              />
              <label>{Math.round(properties.side*selectedShape.get("scaleX"))}</label>
              <br/><br/>
            </label>
          )}
          {selectedShape.type === "ellipse" && (
            <>
            <label>
              RadiusX:
              <input
                type="range"
                min="10"
                max={canvas.current.getWidth()/2}
                step="1"
                value={properties.rx}
                onChange={(e) => updateProperty("rx", Number(e.target.value))}
              />
              <label>{Math.round(properties.rx*selectedShape.get("scaleX"))}</label>
              <br/><br/>
            </label>
            <label>
              RadiusY:
              <input
                type="range"
                min="10"
                max={canvas.current.getWidth()/2}
                step="1"
                value={properties.ry}
                onChange={(e) => updateProperty("ry", Number(e.target.value))}
              />
              <label>{Math.round(properties.ry*selectedShape.get("scaleY"))}</label>
              <br/><br/>
            </label>
            </>
          )}
          <label>
              StrokeWidth:
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={properties.strokeWidth}
                onChange={(e) => updateProperty("strokeWidth", Number(e.target.value))}
              />
              <label>{properties.strokeWidth}</label>
              <br/><br/>
            </label>
          <label>
            Fill Color:
            <input
              className="picker"
              type="color"
              value={properties.fill}
              onChange={(e) => updateProperty("fill", e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
export default Buttons;
