import { Vector2 } from "@src/utils/Vector2";
import { Mesh2D } from "./Mesh2D";
import { Rotation } from "@src/utils/Rotation";

export class RenderBody2D {
  constructor(
    public position: Vector2,
    public rotation: Rotation,
    public mesh: Mesh2D
  ) {}
}
