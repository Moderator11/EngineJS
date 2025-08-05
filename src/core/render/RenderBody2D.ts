import { Vector2 } from "@src/utils/Vector2";
import { Mesh2D } from "./Mesh2D";
import { Rotation } from "@src/utils/Rotation";

export class RenderBody2D {
  public renderPriority: number = 0;

  public onRender: (ctx: CanvasRenderingContext2D) => void = () => {};

  constructor(
    public position: Vector2,
    public rotation: Rotation,
    public mesh: Mesh2D
  ) {}
}
