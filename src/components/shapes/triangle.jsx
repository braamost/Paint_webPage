import { Triangle } from "fabric"
import Shape from "./Shape"

class myTriangle extends Shape {
    create(){
        return new Triangle({
            top: this.options.top || 100,
            left: this.options.left || 100,
            width: this.options.width || 100,
            height: this.options.height || 100,
            fill: this.options.fill || "red",
        })
    }
}

export default myTriangle