import Shape from "./Shape"
import { Rect } from "fabric"

class Rectangle extends Shape {
    create(){
        return new Rect({
            top: 100,
            left: 100,
            width: 100,
            height: 50,
            fill: "red",
        })
    }
}

export default Rectangle