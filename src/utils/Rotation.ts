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
}
