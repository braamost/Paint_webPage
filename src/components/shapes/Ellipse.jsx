import { Ellipse } from "fabric";
import Shape from "./Shape";

class myEllipse extends Shape {
    create(color , rx=80 ,ry=40, strokeWidth=3 , fillColor="white"){
        return new Ellipse({
            rx: rx,
            ry: ry, 
            fill: fillColor,
            stroke: color,
            strokeWidth: strokeWidth,
            left: 50,
            top: 50,
            type: "ellipse",
        });
    }
}

export default myEllipse;