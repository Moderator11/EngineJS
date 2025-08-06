import { Vector2 } from "./Vector2";

export class Rotation {
  constructor(public angle: number) {}

  LookAt(from: Vector2, to: Vector2) {
    const targetVector = to.Clone().Subtract(from);
    this.angle = Math.atan2(targetVector.y, targetVector.x);
  }

  Degree() {
    return this.angle * (180 / Math.PI);
  }

  Vector() {
    return new Vector2(Math.cos(this.angle), Math.sin(this.angle));
  }

  Clone() {
    return new Rotation(this.angle);
  }

  Rotate(rotation: number) {
    this.angle += rotation;
    return this;
  }
}
