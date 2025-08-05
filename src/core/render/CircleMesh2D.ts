import { Mesh2D } from "@src/core/render/Mesh2D";

export class CircleMesh2D extends Mesh2D {
  constructor(public color: string, public radius: number) {
    super(color);
  }
}
