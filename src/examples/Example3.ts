import { Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";
import { EllipseMesh2D } from "@src/core/render/EllipseMesh2D";

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

  const PENGUIN_COUNT = 2;
  for (let i = 0; i < PENGUIN_COUNT; i++) spawnPenguin(game, mouse);
  for (let i = 0; i < PENGUIN_COUNT; i++) spawnBabyPenguin(game, mouse);
}

function spawnBabyPenguin(game: GameEngine2D, mouse: Vector2) {
  const body = game.createNewEllipse(22.5, 30, "#b5b8bd");
  body.position.x = window.innerWidth / 2 + Math.random();
  body.position.y = window.innerHeight / 2 + Math.random();

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
    const forward = head.rotation.Vector().MultiplyScalar(10);
    cock.rotation.angle = head.rotation.angle;
    cock.position.x = head.position.x + forward.x;
    cock.position.y = head.position.y + forward.y;
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
    const forward = body.rotation.Vector().MultiplyScalar(20);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(20);
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
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 8;
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
    const forward = body.rotation.Vector().MultiplyScalar(20);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-20);
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
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightFeet.position.x, rightFeet.position.y);
    const to = body.position.Clone().Add(normal.MultiplyScalar(-10));
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const leftFacialArea = game.createNewEllipse(8, 5, "white");
  leftFacialArea.rigidbody.collider.collidable = false;
  leftFacialArea.rigidbody.isStatic = true;
  leftFacialArea.renderbody.renderPriority = 2;
  game.render.SortRenderSequence();
  leftFacialArea.rigidbody.onPhysicUpdate = () => {
    leftFacialArea.rotation.angle = head.rotation.angle + 1;
    const forward = head.rotation.Vector().MultiplyScalar(5.5);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-5);
    leftFacialArea.position.x = head.position.x + forward.x + normal.x;
    leftFacialArea.position.y = head.position.y + forward.y + normal.y;
  };

  const rightFacialArea = game.createNewEllipse(8, 5, "white");
  rightFacialArea.rigidbody.collider.collidable = false;
  rightFacialArea.rigidbody.isStatic = true;
  rightFacialArea.renderbody.renderPriority = 2;
  game.render.SortRenderSequence();
  rightFacialArea.rigidbody.onPhysicUpdate = () => {
    rightFacialArea.rotation.angle = head.rotation.angle - 1;
    const forward = head.rotation.Vector().MultiplyScalar(5.5);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(5);
    rightFacialArea.position.x = head.position.x + forward.x + normal.x;
    rightFacialArea.position.y = head.position.y + forward.y + normal.y;
  };

  const leftEye = game.createNewEllipse(2, 2, "black");
  leftEye.rigidbody.collider.collidable = false;
  leftEye.rigidbody.isStatic = true;
  leftEye.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  leftEye.rigidbody.onPhysicUpdate = () => {
    leftEye.rotation.angle = head.rotation.angle + 1;
    const forward = head.rotation.Vector().MultiplyScalar(8);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-6);
    leftEye.position.x = head.position.x + forward.x + normal.x;
    leftEye.position.y = head.position.y + forward.y + normal.y;
  };

  const rightEye = game.createNewEllipse(2, 2, "black");
  rightEye.rigidbody.collider.collidable = false;
  rightEye.rigidbody.isStatic = true;
  rightEye.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  rightEye.rigidbody.onPhysicUpdate = () => {
    rightEye.rotation.angle = head.rotation.angle - 1;
    const forward = head.rotation.Vector().MultiplyScalar(8);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(6);
    rightEye.position.x = head.position.x + forward.x + normal.x;
    rightEye.position.y = head.position.y + forward.y + normal.y;
  };

  const leftArm = game.createNewEllipse(15, 5, "#b5b8bd");
  leftArm.rigidbody.collider.collidable = false;
  leftArm.rigidbody.isStatic = true;
  leftArm.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  leftArm.rigidbody.onPhysicUpdate = () => {
    const velocitySize = body.rigidbody.velocity.Magnitude();
    const swing =
      (Math.sin((Date.now() * game.physic.simulationSpeed) / 50) *
        velocitySize) /
      25;

    (leftArm.renderbody.mesh as EllipseMesh2D).radiusX = velocitySize + 5;

    leftArm.rotation.angle = body.rotation.angle + Math.PI / 2 + swing * 2;
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(29);
    leftArm.position.x = head.position.x + normal.x;
    leftArm.position.y = head.position.y + normal.y;
  };

  const rightArm = game.createNewEllipse(15, 5, "#b5b8bd");
  rightArm.rigidbody.collider.collidable = false;
  rightArm.rigidbody.isStatic = true;
  rightArm.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  rightArm.rigidbody.onPhysicUpdate = () => {
    const velocitySize = body.rigidbody.velocity.Magnitude();
    const swing =
      (Math.sin((Date.now() * game.physic.simulationSpeed) / 50) *
        velocitySize) /
      25;

    (rightArm.renderbody.mesh as EllipseMesh2D).radiusX = velocitySize + 5;

    rightArm.rotation.angle = body.rotation.angle + Math.PI / 2 + swing * 2;
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-29);
    rightArm.position.x = head.position.x + normal.x;
    rightArm.position.y = head.position.y + normal.y;
  };
}

function spawnPenguin(game: GameEngine2D, mouse: Vector2) {
  const body = game.createNewEllipse(22.5, 30, "#353743");
  body.position.x = window.innerWidth / 2 + Math.random();
  body.position.y = window.innerHeight / 2 + Math.random();

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
  cock.renderbody.renderPriority = 1;
  game.physic.SortPhysicSequence();
  cock.rigidbody.onPhysicUpdate = () => {
    const forward = head.rotation.Vector().MultiplyScalar(10);
    cock.rotation.angle = head.rotation.angle;
    cock.position.x = head.position.x + forward.x;
    cock.position.y = head.position.y + forward.y;
  };

  const belly = game.createNewEllipse(10, 20, "white");
  belly.rigidbody.collider.collidable = false;
  belly.rigidbody.isStatic = true;
  belly.renderbody.renderPriority = 0;
  game.physic.SortPhysicSequence();
  belly.rigidbody.onPhysicUpdate = () => {
    const forward = head.rotation.Vector().MultiplyScalar(10);
    belly.rotation.angle = body.rotation.angle;
    belly.position.x = body.position.x + forward.x;
    belly.position.y = body.position.y + forward.y;
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
    const forward = body.rotation.Vector().MultiplyScalar(20);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(20);
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
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 8;
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
    const forward = body.rotation.Vector().MultiplyScalar(20);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-20);
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
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightFeet.position.x, rightFeet.position.y);
    const to = body.position.Clone().Add(normal.MultiplyScalar(-10));
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const leftFacialArea = game.createNewEllipse(8, 5, "white");
  leftFacialArea.rigidbody.collider.collidable = false;
  leftFacialArea.rigidbody.isStatic = true;
  leftFacialArea.renderbody.renderPriority = 2;
  game.render.SortRenderSequence();
  leftFacialArea.rigidbody.onPhysicUpdate = () => {
    leftFacialArea.rotation.angle = head.rotation.angle + 1;
    const forward = head.rotation.Vector().MultiplyScalar(5.5);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-5);
    leftFacialArea.position.x = head.position.x + forward.x + normal.x;
    leftFacialArea.position.y = head.position.y + forward.y + normal.y;
  };

  const rightFacialArea = game.createNewEllipse(8, 5, "white");
  rightFacialArea.rigidbody.collider.collidable = false;
  rightFacialArea.rigidbody.isStatic = true;
  rightFacialArea.renderbody.renderPriority = 2;
  game.render.SortRenderSequence();
  rightFacialArea.rigidbody.onPhysicUpdate = () => {
    rightFacialArea.rotation.angle = head.rotation.angle - 1;
    const forward = head.rotation.Vector().MultiplyScalar(5.5);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(5);
    rightFacialArea.position.x = head.position.x + forward.x + normal.x;
    rightFacialArea.position.y = head.position.y + forward.y + normal.y;
  };

  const leftEye = game.createNewEllipse(2, 2, "black");
  leftEye.rigidbody.collider.collidable = false;
  leftEye.rigidbody.isStatic = true;
  leftEye.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  leftEye.rigidbody.onPhysicUpdate = () => {
    leftEye.rotation.angle = head.rotation.angle + 1;
    const forward = head.rotation.Vector().MultiplyScalar(8);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-6);
    leftEye.position.x = head.position.x + forward.x + normal.x;
    leftEye.position.y = head.position.y + forward.y + normal.y;
  };

  const rightEye = game.createNewEllipse(2, 2, "black");
  rightEye.rigidbody.collider.collidable = false;
  rightEye.rigidbody.isStatic = true;
  rightEye.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  rightEye.rigidbody.onPhysicUpdate = () => {
    rightEye.rotation.angle = head.rotation.angle - 1;
    const forward = head.rotation.Vector().MultiplyScalar(8);
    const normal = head.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(6);
    rightEye.position.x = head.position.x + forward.x + normal.x;
    rightEye.position.y = head.position.y + forward.y + normal.y;
  };

  const leftArm = game.createNewEllipse(15, 8, "#353743");
  leftArm.rigidbody.collider.collidable = false;
  leftArm.rigidbody.isStatic = true;
  leftArm.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  leftArm.rigidbody.onPhysicUpdate = () => {
    const velocitySize = body.rigidbody.velocity.Magnitude();
    const swing =
      (Math.sin((Date.now() * game.physic.simulationSpeed) / 50) *
        velocitySize) /
      25;

    (leftArm.renderbody.mesh as EllipseMesh2D).radiusX = velocitySize + 5;

    leftArm.rotation.angle = body.rotation.angle + Math.PI / 2 + swing * 2;
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(29);
    leftArm.position.x = head.position.x + normal.x;
    leftArm.position.y = head.position.y + normal.y;
  };

  const rightArm = game.createNewEllipse(15, 8, "#353743");
  rightArm.rigidbody.collider.collidable = false;
  rightArm.rigidbody.isStatic = true;
  rightArm.renderbody.renderPriority = 3;
  game.render.SortRenderSequence();
  rightArm.rigidbody.onPhysicUpdate = () => {
    const velocitySize = body.rigidbody.velocity.Magnitude();
    const swing =
      (Math.sin((Date.now() * game.physic.simulationSpeed) / 50) *
        velocitySize) /
      25;

    (rightArm.renderbody.mesh as EllipseMesh2D).radiusX = velocitySize + 5;

    rightArm.rotation.angle = body.rotation.angle + Math.PI / 2 + swing * 2;
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-29);
    rightArm.position.x = head.position.x + normal.x;
    rightArm.position.y = head.position.y + normal.y;
  };
}
