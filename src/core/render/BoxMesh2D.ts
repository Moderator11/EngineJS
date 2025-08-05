import { Mesh2D } from "@src/core/render/Mesh2D";

export class BoxMesh2D extends Mesh2D {
  constructor(
    public color: string,
    public width: number,
    public height: number
  ) {
    super(color);
  }
}
