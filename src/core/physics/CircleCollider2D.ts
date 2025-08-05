import { Collider2D } from "@src/core/physics/Collider2D";

export class CircleCollider2D extends Collider2D {
  constructor(public radius: number) {
    super();
  }
}
