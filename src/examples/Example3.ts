import { Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";

export default function Example3() {
  const game = new GameEngine2D();

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  game.physic.simpleDrag = 0.95;
  game.physic.gravity = false;

  game.start();

  const body = game.createNewEllipse(22.5, 30, "#b5b8bd");
  body.position.x = window.innerWidth / 2;
  body.position.y = window.innerHeight / 2;

  function reactionForce(x: number): number {
    if (x >= 0 && x < 2) {
      return x - 1;
    } else if (x >= 2 && x < 3) {
      return -x + 3;
    } else {
      return 0;
    }
  }

  body.onFrameUpdate = () => {
    body.rotation.LookAt(body.position, mouse);
    const velocitySize = body.rigidbody.velocity.Magnitude();
    body.rotation.angle +=
      (Math.sin((Date.now() * game.physic.simulationSpeed) / 50) *
        velocitySize) /
      25;

    body.rigidbody.AddForce(
      game.physic.deltaTime *
        game.physic.meterToPixel *
        game.physic.simulationSpeed,
      mouse
        .Clone()
        .Subtract(body.position)
        .Normalize()
        .MultiplyScalar(
          reactionForce(Vector2.Distance(body.position, mouse) / 100)
        )
    );
  };

  // Order is important, when cock is added prior to the head, cock update happens first than head, which creates delayed like movement
  const head = game.createNewEllipse(22.5 / 2, 30 / 2, "#353743");
  head.rigidbody.collider.collidable = false;
  head.rigidbody.isStatic = true;
  head.renderbody.renderPriority = 1;
  game.render.SortRenderSequence();
  head.rigidbody.onPhysicUpdate = () => {
    const velocitySize = body.rigidbody.velocity.Magnitude();
    let bobbing =
      ((Math.sin((Date.now() * game.physic.simulationSpeed) / 50) + 1) *
        velocitySize) /
      10;

    head.rotation.LookAt(head.position, mouse);

    const forward = body.rotation.Vector().MultiplyScalar(velocitySize);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(bobbing);

    head.position.x = body.position.x + forward.x + normal.x;
    head.position.y = body.position.y + forward.y + normal.y;
  };

  const cock = game.createNewEllipse(10, 5, "orange");
  cock.rigidbody.collider.collidable = false;
  cock.rigidbody.isStatic = true;
  cock.rigidbody.onPhysicUpdate = () => {
    cock.rotation.angle = head.rotation.angle;
    cock.position.x = head.position.x + Math.cos(head.rotation.angle) * 10;
    cock.position.y = head.position.y + Math.sin(head.rotation.angle) * 10;
  };

  const leftFeetTarget = body.position.Clone();
  const leftFeet = game.createNewEllipse(10, 8, "orange");
  leftFeet.position.x = leftFeetTarget.x;
  leftFeet.position.y = leftFeetTarget.y;
  leftFeet.rigidbody.collider.collidable = false;
  leftFeet.rigidbody.isStatic = true;
  leftFeet.renderbody.renderPriority = -1;
  game.render.SortRenderSequence();
  leftFeet.rigidbody.onPhysicUpdate = () => {
    leftFeet.rotation.angle = body.rotation.angle;
    const forward = new Vector2(
      Math.cos(body.rotation.angle),
      Math.sin(body.rotation.angle)
    ).MultiplyScalar(20);
    const normal = new Vector2(
      Math.cos(body.rotation.angle + Math.PI / 2),
      Math.sin(body.rotation.angle + Math.PI / 2)
    ).MultiplyScalar(20);
    const desiredPosition = body.position.Clone().Add(forward).Add(normal);
    if (Vector2.Distance(desiredPosition, leftFeet.position) > 40) {
      const target = desiredPosition.Clone().Subtract(leftFeet.position);
      leftFeetTarget.Add(target.MultiplyScalar(1.75));
    }
    const lerped = Vector2.Lerp(leftFeet.position, leftFeetTarget, 0.2);
    leftFeet.position.x = lerped.x;
    leftFeet.position.y = lerped.y;
  };
  leftFeet.renderbody.onRender = (ctx) => {
    const normal = new Vector2(
      Math.cos(body.rotation.angle + Math.PI / 2),
      Math.sin(body.rotation.angle + Math.PI / 2)
    );
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(leftFeet.position.x, leftFeet.position.y);
    const to = body.position.Clone().Add(normal.MultiplyScalar(10));
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const rightFeetTarget = body.position.Clone();
  const rightFeet = game.createNewEllipse(10, 8, "orange");
  rightFeet.position.x = rightFeetTarget.x;
  rightFeet.position.y = rightFeetTarget.y;
  rightFeet.rigidbody.collider.collidable = false;
  rightFeet.rigidbody.isStatic = true;
  rightFeet.renderbody.renderPriority = -1;
  game.render.SortRenderSequence();
  rightFeet.rigidbody.onPhysicUpdate = () => {
    rightFeet.rotation.angle = body.rotation.angle;
    const forward = new Vector2(
      Math.cos(body.rotation.angle),
      Math.sin(body.rotation.angle)
    ).MultiplyScalar(20);
    const normal = new Vector2(
      Math.cos(body.rotation.angle + Math.PI / 2),
      Math.sin(body.rotation.angle + Math.PI / 2)
    ).MultiplyScalar(-20);
    const desiredPosition = body.position.Clone().Add(forward).Add(normal);
    if (Vector2.Distance(desiredPosition, rightFeet.position) > 40) {
      const target = desiredPosition.Clone().Subtract(rightFeet.position);
      rightFeetTarget.Add(target.MultiplyScalar(1.75));
    }
    const lerped = Vector2.Lerp(rightFeet.position, rightFeetTarget, 0.2);
    rightFeet.position.x = lerped.x;
    rightFeet.position.y = lerped.y;
  };
  rightFeet.renderbody.onRender = (ctx) => {
    const normal = new Vector2(
      Math.cos(body.rotation.angle + Math.PI / 2),
      Math.sin(body.rotation.angle + Math.PI / 2)
    );
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(rightFeet.position.x, rightFeet.position.y);
    const to = body.position.Clone().Add(normal.MultiplyScalar(-10));
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };
}
