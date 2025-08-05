import { BoxMesh2D } from "./BoxMesh2D";
import { CircleMesh2D } from "./CircleMesh2D";
import { EllipseMesh2D } from "./EllipseMesh2D";
import { Mesh2D } from "./Mesh2D";
import { RenderBody2D } from "./RenderBody2D";

export class RenderEngine2D {
  public window: Window;
  public renderPool: RenderBody2D[] = [];
  public cvs: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(window: Window) {
    this.window = window;
    this.cvs = this.CreateCanvas();
    this.ctx = this.cvs.getContext("2d")!; //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
    document.body.appendChild(this.cvs);
    this.window.addEventListener("resize", () => {
      let inMemCvs = document.createElement("canvas");
      let inMemCtx = inMemCvs.getContext("2d")!;
      inMemCvs.width = this.cvs.width;
      inMemCvs.height = this.cvs.height;
      inMemCtx.drawImage(this.cvs, 0, 0);

      this.cvs.width = window.innerWidth;
      this.cvs.height = window.innerHeight;
      this.ctx.drawImage(inMemCvs, 0, 0);

      inMemCvs.remove();
    });
  }

  CreateCanvas() {
    let canvas = document.createElement("canvas");
    canvas.id = "cursorTrail";
    canvas.style.setProperty("position", "fixed");
    canvas.style.setProperty("left", "0");
    canvas.style.setProperty("top", "0");
    canvas.style.setProperty("width", "100%");
    canvas.style.setProperty("height", "100%");
    canvas.style.setProperty("z-index", "10");
    canvas.style.setProperty("pointer-events", "none"); //https://stackoverflow.com/questions/5398787/how-can-i-pass-a-click-through-an-element
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas;
  }

  Render() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    for (let i = 0; i < this.renderPool.length; i++) {
      const renderObject = this.renderPool[i];

      if (renderObject.mesh instanceof CircleMesh2D) {
        this.ctx.fillStyle = renderObject.mesh.color;
        this.ctx.beginPath();
        this.ctx.arc(
          renderObject.position.x,
          renderObject.position.y,
          renderObject.mesh.radius,
          0,
          2 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
      }

      if (renderObject.mesh instanceof EllipseMesh2D) {
        this.ctx.fillStyle = renderObject.mesh.color;
        this.ctx.beginPath();
        this.ctx.ellipse(
          renderObject.position.x,
          renderObject.position.y,
          renderObject.mesh.radiusX,
          renderObject.mesh.radiusY,
          0,
          0,
          2 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
      }

      if (renderObject.mesh instanceof BoxMesh2D) {
        this.ctx.fillStyle = renderObject.mesh.color;
        this.ctx.beginPath();

        const x = renderObject.position.x;
        const y = renderObject.position.y;
        const w = renderObject.mesh.width;
        const h = renderObject.mesh.height;
        this.ctx.rect(x - w / 2, y - h / 2, w, h);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
    //requestAnimationFrame(Render);
  }
}
