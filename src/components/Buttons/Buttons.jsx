import { useEffect, useRef, useState } from "react";
import shapeFactory from "../shapeFactory/ShapeFactory";

function Buttons({ canvas, color }) {
  const factory = useRef(null);

  // Initialize Shape Factory
  useEffect(() => {
    const myFactory = new shapeFactory();
    factory.current = myFactory;
  }, []);

  const [selectedShape, setSelectedShape] = useState(null); // Track the selected shape
  const [properties, setProperties] = useState({
    width: 0,
    height: 0,
    radius: 0,
    fill: "#000000",
  });

  // Add Shape to Canvas
  const addShape = ({ typeOfShape, radius = 0, width = 0, height = 0 }) => {
    if (!canvas.current) return;

    // Create the shape
    const shape = factory.current.createShape({
      shape: typeOfShape,
      color: color,
      radius: radius,
      width: width,
      height: height,
    });
    canvas.current.add(shape);
    canvas.current.setActiveObject(shape);
    handleSelection({ target: shape }); // Simulate selection after adding
    canvas.current.renderAll();
  };
  
  // Handle Shape Selection
  useEffect(() => {
    if (!canvas.current) return;
    console.log("called")
    const handleSelectionCleared = () => {
      setSelectedShape(null);
      setProperties({
        width: 0,
        height: 0,
        radius: 0,
        fill: "#000000",
      });
    };
    canvas.current.on("selection:created", handleSelection);
    canvas.current.on("selection:updated", handleSelection);
    canvas.current.on("selection:cleared", handleSelectionCleared);
    return () => {
      canvas.current.off("selection:created", handleSelection);
      canvas.current.off("selection:updated", handleSelection);
      canvas.current.off("selection:cleared", handleSelectionCleared);
    }
  }, [canvas.current]);

  const handleSelection = () => {
    const activeObject = canvas.current.getActiveObject();
    if (!activeObject) return;
    setSelectedShape(activeObject);
    setProperties({
      width: activeObject.width * activeObject.scaleX || 0,
      height: activeObject.height * activeObject.scaleY || 0,
      radius: activeObject.radius || 0,
      fill: activeObject.fill || "#000000",
    });
  };

  const updateProperty = (property, value) => {
    if (!selectedShape) return;
    
    if (property === "width" || property === "height") {
      const scaleValue =
        value / (property === "width" ? selectedShape.width : selectedShape.height);
      if (property === "width") {
        selectedShape.scaleX = scaleValue;
      } else {
        selectedShape.scaleY = scaleValue;
      }
    } else if (property === "radius") {
      selectedShape.set("radius", value);
    } else {
      selectedShape.set(property, value);
    }
    setProperties((prev) => ({ ...prev, [property]: value }));
    canvas.current.renderAll();
  };

  return (
    <div className="container">
      <button onClick={() => addShape({ typeOfShape: "circle" })} className="button">⚫</button>
      <button onClick={() => addShape({typeOfShape: "line"})} className="button">📏</button>
      <button onClick={() => addShape({ typeOfShape: "rectangle" })} className="button">🟦</button>
      <button onClick={() => addShape({ typeOfShape: "triangle" })} className="button">🔺</button>

      {/* Toolbox for Selected Shape Properties */}
      {selectedShape && (
        <div style={{ marginTop: "20px", border: "1px solid black", padding: "10px" }}>
          <h4>Edit Shape Properties</h4>
          {(selectedShape.type === "rect" || selectedShape.type === "triangle") && (
            <>
              <label>
                Width:
                <input
                  type="number"
                  value={properties.width}
                  onChange={(e) => updateProperty("width", Number(e.target.value))}
                />
              </label>
              <label>
                Height:
                <input
                  type="number"
                  value={properties.height}
                  onChange={(e) => updateProperty("height", Number(e.target.value))}
                />
              </label>
            </>
          )}
          {selectedShape.type === "circle" && (
            <label>
              Radius:
              <input
                type="number"
                value={properties.radius}
                onChange={(e) => updateProperty("radius", Number(e.target.value))}
              />
            </label>
          )}
          <label>
            Fill Color:
            <input
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
