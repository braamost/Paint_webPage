import { useState } from "react";
import ColorPicker from "../ColorPicker/ColorPicker";
import "./MenuBar.css";
import Buttons from "../Buttons/Buttons.jsx";
import FreeHand from "../FreeHand/FreeHand.jsx";
import SaveLoad from "../SaveLoad/SaveLoad.jsx";
import Delete from "../Delete/Delete.jsx";
import UndoRedo from "../UndoRedo/UndoRedo.jsx";
import Copy from "../Copy/Copy.jsx";


function MenuBar({ canvas, selectedShape, setSelectedShape, properties, setProperties }) {
    const [color, setColor] = useState("#000000"); // Manage color state in MenuBar
    const [size, setSize] = useState(5); // Manage size state in MenuBar

    return (
        <div className="menuBar_container">
            <ColorPicker color={color} setColor={setColor} canvas={canvas} /> {/* Pass color and setColor to ColorPicker */}
            <Buttons canvas={canvas} color={color} selectedShape={selectedShape} setSelectedShape={setSelectedShape} properties={properties} setProperties={setProperties}/> {/* Pass size to Buttons */}
            <FreeHand canvas={canvas} color={color} size={size} setSize={setSize} /> {/* Pass size to FreeHand */}  
            <SaveLoad canvas={canvas}/>
            <Copy canvas={canvas}/>
            <Delete canvas={canvas} setSelectedShape={setSelectedShape} />
            <UndoRedo canvas={canvas} setSelectedShape={setSelectedShape}/>
            
        </div>
    );
}

export default MenuBar;
