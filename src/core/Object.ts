import { Vector2 } from "@src/utils/Vector2";
import { RigidBody2D } from "@src/core/physics/RigidBody2D";
import { RenderBody2D } from "@src/core/render/RenderBody2D";
import { Collider2D } from "@src/core/physics/Collider2D";
import { Mesh2D } from "./render/Mesh2D";
import { Rotation } from "@src/utils/Rotation";

export class Object {
  public uuid: string = crypto.randomUUID();
  public position: Vector2;
  public rotation: Rotation = new Rotation(0);

  public rigidbody: RigidBody2D;
  public renderbody: RenderBody2D;

  public onUpdate: () => void = () => {};

  constructor(
    position: Vector2 = new Vector2(0, 0),
    collider: Collider2D,
    mesh: Mesh2D
  ) {
    this.position = position;
    this.rigidbody = new RigidBody2D(
      1,
      this.position,
      new Vector2(0, 0),
      collider
    );
    this.renderbody = new RenderBody2D(this.position, this.rotation, mesh);
  }
}
