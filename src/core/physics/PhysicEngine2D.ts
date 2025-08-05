import { Distance, MultiplyScalar, Vector2 } from "@src/utils/Vector2";
import { RigidBody2D } from "@src/core/physics/RigidBody2D";
import { CircleCollider2D } from "@src/core/physics/CircleCollider2D";

export class PhysicEngine2D {
  public physicPool: RigidBody2D[] = [];
  public constantForce: Vector2 = new Vector2(0, 0.981);
  public subStepIteration: number = 1;
  public simulationSpeed: number = 1;
  public gravity: boolean = true;
  public simpleDrag: number = 0.99;

  constructor(
    public domain: Vector2,
    public deltaTime: number,
    public meterToPixel: number
  ) {
    window.addEventListener("resize", () => {
      this.domain.x = window.innerWidth;
      this.domain.y = window.innerHeight;
    });
  }

  AddNewBody(b: RigidBody2D) {
    this.physicPool.push(b);
  }

  RemoveBall(b: RigidBody2D) {
    this.physicPool = this.physicPool.filter((ball) => ball !== b);
  }

  UpdatePhysics() {
    const timestep = this.deltaTime * this.meterToPixel * this.simulationSpeed;
    for (let substep = 0; substep < this.subStepIteration; substep++) {
      // Environmental Force Apply
      if (this.gravity) {
        for (let i = 0; i < this.physicPool.length; i++) {
          const rigidbody = this.physicPool[i];
          if (rigidbody.isStatic) continue;
          rigidbody.AddForce(
            timestep / this.subStepIteration,
            this.constantForce
          );
        }
      }

      // Position Update
      for (let i = 0; i < this.physicPool.length; i++) {
        const rigidbody = this.physicPool[i];
        if (rigidbody.isStatic) continue;
        rigidbody.UpdatePosition(timestep / this.subStepIteration);
      }

      // Collision Check
      for (let i = 0; i < this.physicPool.length; i++) {
        const rigidbody = this.physicPool[i];
        if (!rigidbody.collider.collidable) continue;
        this.CircleToCircleCollisionCheck(rigidbody);
        this.CircleToWallCollisionCheck(rigidbody);
      }

      // Custom Update function call
      for (let i = 0; i < this.physicPool.length; i++) {
        const rigidbody = this.physicPool[i];
        rigidbody.onPhysicUpdate();
      }
    }

    // Simple Drag (maybe dt based exponential deduction application later)
    for (let i = 0; i < this.physicPool.length; i++) {
      this.physicPool[i].velocity.MultiplyScalar(this.simpleDrag);
    }
  }

  CircleToCircleCollisionCheck(rigidbody: RigidBody2D) {
    if (rigidbody.collider instanceof CircleCollider2D) {
      const circlePool = this.physicPool.filter(
        (rb) => rb.collider instanceof CircleCollider2D && rb !== rigidbody
      ) as (RigidBody2D & { collider: CircleCollider2D })[];
      for (let i = 0; i < circlePool.length; i++) {
        const other = circlePool[i];
        if (!other.collider.collidable) continue;
        if (
          rigidbody.collider.radius + other.collider.radius >=
          Distance(rigidbody.position, other.position)
        ) {
          //Penetration removal
          const eps = 1e-6;
          const delta = rigidbody.position.Clone().Subtract(other.position);
          const distance = delta.Magnitude();
          const penetration =
            rigidbody.collider.radius +
            other.collider.radius -
            distance +
            2 * eps;
          const correction = delta
            .Normalize()
            .Clone()
            .MultiplyScalar(penetration / 2);
          rigidbody.position.Add(correction);
          other.position.Subtract(correction);

          //Velociry Calculation
          const v1 = rigidbody.velocity;
          const v2 = other.velocity;
          const m1 = rigidbody.mass;
          const m2 = other.mass;

          const normal = rigidbody.position
            .Clone()
            .Subtract(other.position)
            .Normalize();
          const relativeVelocity = v1.Clone().Subtract(v2);
          const velAlongNormal = relativeVelocity.Dot(normal);

          // 충돌이 없으면 return
          if (velAlongNormal > 0) return;

          // 탄성 계수 1 (완전 탄성)
          const e = rigidbody.bounceFactor;

          const impulseMagnitude =
            (-(1 + e) * velAlongNormal) / (1 / m1 + 1 / m2);
          const impulse = normal.Clone().MultiplyScalar(impulseMagnitude);

          rigidbody.velocity.Add(impulse.Clone().MultiplyScalar(1 / m1));
          other.velocity.Subtract(impulse.Clone().MultiplyScalar(1 / m2));
        }
      }
    }
  }

  CircleToWallCollisionCheck(rigidbody: RigidBody2D) {
    if (!(rigidbody.collider instanceof CircleCollider2D)) return;

    const r = rigidbody.collider.radius;
    const e = rigidbody.bounceFactor; // 반발계수 (0..1). 1 = 완전 탄성
    const friction = 0; // 0 = 마찰 없음, 0.1..0.5 등
    const eps = 1e-6;

    const applyCollision = (normal: Vector2, penetration: number) => {
      // 1) 위치 보정: penetration만큼 normal 방향으로 밀어냄
      // (normal은 외부로 향하는 단위벡터, 즉 벽 밖 방향)
      rigidbody.position.Add(normal.Clone().MultiplyScalar(penetration + eps));

      // 2) 법선 성분 계산
      const v_n = rigidbody.velocity.Dot(normal);
      // 이미 밖으로 향하는 속도이면(바깥방향) 충돌 반응을 하지 않음
      if (v_n >= 0) return;

      // 3) 속도 갱신: v' = v - (1 + e) * v_n * n
      // 이 식은 벽이 무한 질량이라 가정한 경우의 임펄스 결과와 동일
      const impulseFactor = -(1 + e) * v_n; // 양수
      rigidbody.velocity.Add(normal.Clone().MultiplyScalar(impulseFactor));

      // 4) 접선(탄젠트) 성분 감쇠로 간단한 마찰 흉내
      if (friction > 0) {
        // tangent: normal에 수직인 단위벡터 (2D에서는 간단히 회전)
        const tangent = new Vector2(-normal.y, normal.x); // 오른손 회전
        const v_t = rigidbody.velocity.Dot(tangent);
        // 감쇠: v_t' = v_t * (1 - friction)
        const newVt = v_t * Math.max(0, 1 - friction);
        // 현재 접선 성분을 제거하고 새로운 접선 성분을 더함
        // remove old: subtract tangent * v_t, add tangent * newVt
        rigidbody.velocity.Add(tangent.Clone().MultiplyScalar(newVt - v_t));
      }
    };

    // 바닥 (y = 0) : normal = (0, 1) (밖으로 향하는 방향)
    const bottomPen = r - rigidbody.position.y;
    if (bottomPen > 0) {
      applyCollision(new Vector2(0, 1), bottomPen);
    }

    // 천장 (y = domain.y) : normal = (0, -1)
    const topPen = rigidbody.position.y + r - this.domain.y;
    if (topPen > 0) {
      applyCollision(new Vector2(0, -1), topPen);
    }

    // 왼쪽 (x = 0) : normal = (1, 0)
    const leftPen = r - rigidbody.position.x;
    if (leftPen > 0) {
      applyCollision(new Vector2(1, 0), leftPen);
    }

    // 오른쪽 (x = domain.x) : normal = (-1, 0)
    const rightPen = rigidbody.position.x + r - this.domain.x;
    if (rightPen > 0) {
      applyCollision(new Vector2(-1, 0), rightPen);
    }
  }
}
