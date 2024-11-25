import { Circle, Line, Rectangle, Triangle } from "fabric";

shapeFactory = (shape)=>{
    switch (shape){
        case "circle":
            return new Circle()
        case "line":
            return new Line()
        case "rectangle":
            return new Rectangle()
        case "triangle":
            return new Triangle()
        case "polygon":
            return new Polygon()
        case "square":
            return new Square()
        default:
            throw new Error(`${shape} is not valid`)
    }
}
export default shapeFactory