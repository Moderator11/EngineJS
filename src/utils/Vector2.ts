export class Vector2 {
  constructor(public x: number, public y: number) {}

  MultiplyScalar(value: number): Vector2 {
    this.x *= value;
    this.y *= value;
    return this;
  }

  AddWithScalar(vector: Vector2, value: number): Vector2 {
    this.x += vector.x * value;
    this.y += vector.y * value;
    return this;
  }

  Magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  Normalize(): Vector2 {
    let l2norm = this.Magnitude();
    if (l2norm == 0) return this;
    this.x /= l2norm;
    this.y /= l2norm;
    return this;
  }

  Clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  Add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  Subtract(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  Dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  Set(vector: Vector2): Vector2 {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  static Add(vectorX: Vector2, VectorY: Vector2) {
    return new Vector2(vectorX.x + VectorY.x, vectorX.y + VectorY.y);
  }

  static MultiplyScalar(vector: Vector2, x: number) {
    return new Vector2(vector.x * x, vector.y * x);
  }

  static Normalize(vector: Vector2): Vector2 {
    let l2norm = vector.Magnitude();
    return new Vector2(vector.x / l2norm, vector.y / l2norm);
  }

  static Distance(vectorX: Vector2, vectorY: Vector2): number {
    return new Vector2(
      vectorX.x - vectorY.x,
      vectorX.y - vectorY.y
    ).Magnitude();
  }

  static RotationToVector(rotation: number): Vector2 {
    return new Vector2(Math.cos(rotation), Math.sin(rotation));
  }

  static Lerp(vectorX: Vector2, vectorY: Vector2, t: number): Vector2 {
    return new Vector2(
      vectorX.x + (vectorY.x - vectorX.x) * t,
      vectorX.y + (vectorY.y - vectorX.y) * t
    );
  }

  static RotatedOffsetPosition(
    targetPosition: Vector2,
    rotation: number,
    mainOffset: number,
    subOffset: number
  ): Vector2 {
    const mainAxis = this.RotationToVector(rotation).MultiplyScalar(mainOffset);
    const subAxis = this.RotationToVector(
      rotation + Math.PI / 2
    ).MultiplyScalar(subOffset);
    return targetPosition.Clone().Add(mainAxis).Add(subAxis);
  }
}
