import { Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";
import { EllipseMesh2D } from "@src/core/render/EllipseMesh2D";

export default function Example5() {
  setupHTML();
  const game = new GameEngine2D();

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  game.physic.simpleDrag = 1;
  game.physic.gravity = false;

  game.start();
  spawn(game, mouse);
}

function spawn(game: GameEngine2D, mouse: Vector2) {
  const rotationSpeed = (2 * Math.random() - 1) * 0.02;
  function reactionForce(x: number): number {
    if (x >= 0 && x < 2) {
      return x - 2;
    } else {
      return 0;
    }
  }

  const body = game.createNewEllipse(30, 30, "#FFAE19");
  body.position.x = window.innerWidth / 2 + (2 * Math.random() - 1) * 100;
  body.position.y = window.innerHeight / 2 + (2 * Math.random() - 1) * 100;
  body.rigidbody.velocity.x = (2 * Math.random() - 1) * 2;
  body.rigidbody.velocity.y = (2 * Math.random() - 1) * 2;

  body.onFrameUpdate = () => {
    // body.rotation.LookAt(body.position, mouse);
    body.rotation.angle += rotationSpeed;
    const velocitySize = body.rigidbody.velocity.Magnitude();

    if (velocitySize > 5) {
      body.rigidbody.velocity.MultiplyScalar(0.9);
    }

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

  const leftEye = game.createNewBall(10, "white");
  leftEye.rigidbody.collider.collidable = false;
  leftEye.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(10);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-10);

    leftEye.position.x = body.position.x + forward.x + normal.x;
    leftEye.position.y = body.position.y + forward.y + normal.y;
  };

  leftEye.renderbody.onRender = (ctx) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(leftEye.position.x, leftEye.position.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const rightEye = game.createNewBall(10, "white");
  rightEye.rigidbody.collider.collidable = false;
  rightEye.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(10);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(10);

    rightEye.position.x = body.position.x + forward.x + normal.x;
    rightEye.position.y = body.position.y + forward.y + normal.y;
  };

  rightEye.renderbody.onRender = (ctx) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(rightEye.position.x, rightEye.position.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const Mouth = game.createNewEllipse(5, 10, "red");
  Mouth.rigidbody.collider.collidable = false;
  Mouth.rigidbody.onPhysicUpdate = () => {
    Mouth.rotation.angle = body.rotation.angle;
    const forward = body.rotation.Vector().MultiplyScalar(-10);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(0);

    Mouth.position.x = body.position.x + forward.x + normal.x;
    Mouth.position.y = body.position.y + forward.y + normal.y;
    (Mouth.renderbody.mesh as EllipseMesh2D).radiusX =
      5 + body.rigidbody.velocity.Magnitude() / 2;
    (Mouth.renderbody.mesh as EllipseMesh2D).radiusY =
      10 + body.rigidbody.velocity.Magnitude() / 2;
  };

  const Leaf = game.createNewEllipse(5, 12, "#4BCE5D");
  Leaf.rigidbody.collider.collidable = false;
  Leaf.rigidbody.onPhysicUpdate = () => {
    Leaf.rotation.angle = body.rotation.angle + 0.5;
    const forward = body.rotation.Vector().MultiplyScalar(30);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(0);

    Leaf.position.x = body.position.x + forward.x + normal.x;
    Leaf.position.y = body.position.y + forward.y + normal.y;
  };

  const leftHand = game.createNewBall(5, "#FFAE19");
  leftHand.renderbody.renderPriority = -1;
  leftHand.rigidbody.collider.collidable = false;
  leftHand.position.x = body.position.x;
  leftHand.position.y = body.position.y;
  leftHand.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(10);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-37.5);

    const target = new Vector2(
      body.position.x + forward.x + normal.x + Math.random() * 8,
      body.position.y + forward.y + normal.y + Math.random() * 8
    );
    leftHand.rigidbody.velocity.MultiplyScalar(0.95);
    target.Subtract(leftHand.position).MultiplyScalar(0.1);
    leftHand.rigidbody.AddForce(
      game.physic.deltaTime *
        game.physic.meterToPixel *
        game.physic.simulationSpeed,
      target
    );
  };
  leftHand.renderbody.onRender = (ctx) => {
    ctx.strokeStyle = "#FFAE19";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(leftHand.position.x, leftHand.position.y);
    ctx.lineTo(body.position.x, body.position.y);
    ctx.stroke();
  };

  const rightHand = game.createNewBall(5, "#FFAE19");
  rightHand.renderbody.renderPriority = -1;
  rightHand.rigidbody.collider.collidable = false;
  rightHand.position.x = body.position.x;
  rightHand.position.y = body.position.y;
  rightHand.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(10);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(37.5);

    const target = new Vector2(
      body.position.x + forward.x + normal.x + Math.random() * 8,
      body.position.y + forward.y + normal.y + Math.random() * 8
    );
    rightHand.rigidbody.velocity.MultiplyScalar(0.95);
    target.Subtract(rightHand.position).MultiplyScalar(0.1);
    rightHand.rigidbody.AddForce(
      game.physic.deltaTime *
        game.physic.meterToPixel *
        game.physic.simulationSpeed,
      target
    );
  };
  rightHand.renderbody.onRender = (ctx) => {
    ctx.strokeStyle = "#FFAE19";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightHand.position.x, rightHand.position.y);
    ctx.lineTo(body.position.x, body.position.y);
    ctx.stroke();
  };

  const leftFoot = game.createNewBall(5, "#FFAE19");
  leftFoot.rigidbody.collider.collidable = false;
  leftFoot.renderbody.renderPriority = -1;
  leftFoot.position.x = body.position.x;
  leftFoot.position.y = body.position.y;
  leftFoot.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(-40);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(-10);

    const target = new Vector2(
      body.position.x + forward.x + normal.x + Math.random() * 8,
      body.position.y + forward.y + normal.y + Math.random() * 8
    );
    leftFoot.rigidbody.velocity.MultiplyScalar(0.95);
    target.Subtract(leftFoot.position).MultiplyScalar(0.1);
    leftFoot.rigidbody.AddForce(
      game.physic.deltaTime *
        game.physic.meterToPixel *
        game.physic.simulationSpeed,
      target
    );
  };
  leftFoot.renderbody.onRender = (ctx) => {
    ctx.strokeStyle = "#FFAE19";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(leftFoot.position.x, leftFoot.position.y);
    ctx.lineTo(body.position.x, body.position.y);
    ctx.stroke();
  };

  const rightFoot = game.createNewBall(5, "#FFAE19");
  rightFoot.rigidbody.collider.collidable = false;
  rightFoot.renderbody.renderPriority = -1;
  rightFoot.position.x = body.position.x;
  rightFoot.position.y = body.position.y;
  rightFoot.rigidbody.onPhysicUpdate = () => {
    const forward = body.rotation.Vector().MultiplyScalar(-40);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(10);

    const target = new Vector2(
      body.position.x + forward.x + normal.x + Math.random() * 8,
      body.position.y + forward.y + normal.y + Math.random() * 8
    );
    rightFoot.rigidbody.velocity.MultiplyScalar(0.95);
    target.Subtract(rightFoot.position).MultiplyScalar(0.1);
    rightFoot.rigidbody.AddForce(
      game.physic.deltaTime *
        game.physic.meterToPixel *
        game.physic.simulationSpeed,
      target
    );
  };
  rightFoot.renderbody.onRender = (ctx) => {
    ctx.strokeStyle = "#FFAE19";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightFoot.position.x, rightFoot.position.y);
    ctx.lineTo(body.position.x, body.position.y);
    ctx.stroke();
  };

  game.render.SortRenderSequence();
}

function setupHTML() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Orange</h1>
  <div>Cute Orange</div>
`;
}
