import { Vector2 } from "@src/utils/Vector2";
import { Object } from "@src/core/Object";
import { PhysicEngine2D } from "@src/core/physics/PhysicEngine2D";
import { RenderEngine2D } from "@src/core/render/RenderEngine2D";
import { CircleCollider2D } from "./physics/CircleCollider2D";
import { CircleMesh2D } from "./render/CircleMesh2D";
import { EllipseMesh2D } from "./render/EllipseMesh2D";

export class GameEngine2D {
  private FRAME_PER_SECOND: number = 60;
  private SECOND_PER_FRAME: number = 1 / this.FRAME_PER_SECOND;
  private MS_PER_FRAME: number = this.SECOND_PER_FRAME * 1000;
  private METER_TO_PIXEL: number = 50;

  public render: RenderEngine2D;
  public physic: PhysicEngine2D;

  public objectPool: Object[] = [];

  public onStart: () => void = () => {};
  public onKeyDown: (e: KeyboardEvent) => void = () => {};
  public onMouseMove: (e: MouseEvent) => void = () => {};
  public onMouseClick: (e: MouseEvent) => void = () => {};

  constructor() {
    this.render = new RenderEngine2D(window);
    this.physic = new PhysicEngine2D(
      new Vector2(this.render.cvs.width, this.render.cvs.height),
      this.SECOND_PER_FRAME,
      this.METER_TO_PIXEL
    );

    window.addEventListener("keydown", (e) => {
      this.onKeyDown(e);
    });

    window.addEventListener("mousemove", (e) => {
      this.onMouseMove(e);
    });

    window.addEventListener("mousedown", (e) => {
      this.onMouseClick(e);
    });
  }

  public start() {
    this.onStart();
    setInterval(() => {
      this.physic.UpdatePhysics();
      this.render.Render();
      for (let i = 0; i < this.objectPool.length; i++) {
        const object = this.objectPool[i];
        object.onUpdate();
      }
    }, this.MS_PER_FRAME);
  }

  public createNewEllipse(radiusX: number, radiusY: number, color: string) {
    const ellipse = new Object(
      new Vector2(0, 0),
      new CircleCollider2D(Math.max(radiusX, radiusY)),
      new EllipseMesh2D(color, radiusX, radiusY)
    );
    this.create(ellipse);
    return ellipse;
  }

  public createNewBall(radius: number, color: string) {
    const ball = new Object(
      new Vector2(0, 0),
      new CircleCollider2D(radius),
      new CircleMesh2D(color, radius)
    );
    this.create(ball);
    return ball;
  }

  public create(object: Object) {
    this.objectPool.push(object);
    this.physic.physicPool.push(object.rigidbody);
    this.render.renderPool.push(object.renderbody);
  }

  public remove(object: Object) {
    this.objectPool = this.objectPool.filter((o) => o.uuid !== object.uuid);
    this.physic.physicPool = this.physic.physicPool.filter(
      (rb) => rb !== object.rigidbody
    );
    this.render.renderPool = this.render.renderPool.filter(
      (rb) => rb !== object.renderbody
    );
  }
}
