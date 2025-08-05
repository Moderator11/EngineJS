import { Vector2 } from "@src/utils/Vector2";
import { Mesh2D } from "./Mesh2D";

export class RenderBody2D {
  constructor(public position: Vector2, public mesh: Mesh2D) {}
}
