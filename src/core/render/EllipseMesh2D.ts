import { Mesh2D } from "@src/core/render/Mesh2D";

export class EllipseMesh2D extends Mesh2D {
  constructor(
    public color: string,
    public radiusX: number,
    public radiusY: number
  ) {
    super(color);
  }
}
