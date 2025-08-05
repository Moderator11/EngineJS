import { Vector2 } from "@src/utils/Vector2";
import { Collider2D } from "@src/core/physics/Collider2D";

export class RigidBody2D {
  public bounceFactor: number = 0.75;
  public isStatic: boolean = false;
  public physicPriority: number = 0;

  public onPhysicUpdate: () => void = () => {};

  constructor(
    public mass: number,
    public position: Vector2,
    public velocity: Vector2,
    public collider: Collider2D
  ) {}

  UpdatePosition(timeElapsed: number) {
    this.position.AddWithScalar(this.velocity, timeElapsed);
  }

  AddForce(timeElapsed: number, acceleration: Vector2) {
    this.velocity.AddWithScalar(
      acceleration.MultiplyScalar(1 / this.mass),
      timeElapsed
    );
  }
}
