import { Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";
import { EllipseMesh2D } from "@src/core/render/EllipseMesh2D";

export default function Example6() {
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
  spawnBingBong(game, mouse);
}

function spawnBingBong(game: GameEngine2D, mouse: Vector2) {
  const color = {
    body: "#dde52e",
    hat: { left: "yellow", mid: "red", right: "blue", top: "black" },
    eyeball: "white",
    pupil: "black",
    lips: "#ffa418",
  };

  const rotationSpeed = (2 * Math.random() - 1) * 0.02;
  function reactionForce(x: number): number {
    if (x >= 0 && x < 2) {
      return x - 2;
    } else {
      return 0;
    }
  }

  const body = game.createNewEllipse(40, 60, color.body);
  const initialPosition = new Vector2(
    window.innerWidth / 2 + (2 * Math.random() - 1) * 100,
    window.innerHeight / 2 + (2 * Math.random() - 1) * 100
  );
  body.position.Set(initialPosition);
  body.rigidbody.velocity.x = (2 * Math.random() - 1) * 2;
  body.rigidbody.velocity.y = (2 * Math.random() - 1) * 2;

  body.onFrameUpdate = () => {
    // body.rotation.LookAt(body.position, mouse);
    body.rotation.angle += rotationSpeed;
    const velocitySize = body.rigidbody.velocity.Magnitude();

    if (velocitySize > 5) {
      body.rigidbody.velocity.MultiplyScalar(0.95);
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

  const hat = game.createNewBall(0, "rgba(0,0,0,1)");
  hat.renderbody.renderPriority = -1;
  hat.rigidbody.collider.collidable = false;
  hat.rigidbody.onPhysicUpdate = () => {
    hat.rotation.angle = body.rotation.angle;
    hat.position.Set(
      Vector2.RotatedOffsetPosition(body.position, body.rotation.angle, 40, 0)
    );
  };

  hat.renderbody.onRender = (ctx) => {
    const forward = body.rotation.Vector().MultiplyScalar(15);
    const normal = body.rotation
      .Clone()
      .Rotate(Math.PI / 2)
      .Vector()
      .MultiplyScalar(10);

    ctx.fillStyle = color.hat.right;
    ctx.beginPath();
    ctx.ellipse(
      hat.position.x + normal.x,
      hat.position.y + normal.y,
      15,
      5,
      hat.rotation.angle - 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = color.hat.left;
    ctx.beginPath();
    ctx.ellipse(
      hat.position.x - normal.x,
      hat.position.y - normal.y,
      15,
      5,
      hat.rotation.angle + 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = color.hat.mid;
    ctx.beginPath();
    ctx.ellipse(
      hat.position.x,
      hat.position.y,
      15,
      8,
      hat.rotation.angle,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = color.hat.top;
    ctx.beginPath();
    ctx.ellipse(
      hat.position.x + forward.x + normal.x,
      hat.position.y + forward.y + normal.y,
      3,
      9,
      hat.rotation.angle,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      hat.position.x + forward.x - normal.x,
      hat.position.y + forward.y - normal.y,
      3,
      9,
      hat.rotation.angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const leftEye = game.createNewEllipse(15, 20, color.eyeball);
  leftEye.rigidbody.collider.collidable = false;
  leftEye.rigidbody.onPhysicUpdate = () => {
    leftEye.rotation.angle = body.rotation.angle + Math.PI / 2 - 0.3;
    leftEye.position.Set(
      Vector2.RotatedOffsetPosition(body.position, body.rotation.angle, -5, -42)
    );
  };

  leftEye.renderbody.onRender = (ctx) => {
    ctx.fillStyle = color.pupil;
    ctx.beginPath();
    ctx.arc(leftEye.position.x, leftEye.position.y, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const rightEye = game.createNewEllipse(15, 20, color.eyeball);
  rightEye.rigidbody.collider.collidable = false;
  rightEye.rigidbody.onPhysicUpdate = () => {
    rightEye.rotation.angle = body.rotation.angle + Math.PI / 2 - 0.4;
    rightEye.position.Set(
      Vector2.RotatedOffsetPosition(body.position, body.rotation.angle, 5, 42)
    );
  };

  rightEye.renderbody.onRender = (ctx) => {
    ctx.fillStyle = color.pupil;
    ctx.beginPath();
    ctx.arc(rightEye.position.x, rightEye.position.y, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const upperLip = game.createNewEllipse(5, 12, color.lips);
  upperLip.rigidbody.collider.collidable = false;
  upperLip.rigidbody.onPhysicUpdate = () => {
    upperLip.rotation.angle = body.rotation.angle - 0.5;
    upperLip.position.Set(
      Vector2.RotatedOffsetPosition(
        body.position,
        body.rotation.angle,
        -10 + 5,
        0
      )
    );
  };

  const lowerLip = game.createNewEllipse(5, 12, color.lips);
  lowerLip.rigidbody.collider.collidable = false;
  lowerLip.rigidbody.onPhysicUpdate = () => {
    lowerLip.rotation.angle = body.rotation.angle + 0.1;
    lowerLip.position.Set(
      Vector2.RotatedOffsetPosition(
        body.position,
        body.rotation.angle,
        -10 - 5,
        0
      )
    );
  };

  const leftHand = game.createNewBall(5, color.body);
  leftHand.renderbody.renderPriority = -1;
  leftHand.rigidbody.collider.collidable = false;
  leftHand.position.Set(body.position);
  leftHand.rigidbody.onPhysicUpdate = () => {
    const target = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      10 + (2 * Math.random() - 1) * 20,
      -70
    ).Add(new Vector2(Math.random() * 8, Math.random() * 8));

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
    const anchor = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      10,
      -55
    );
    ctx.strokeStyle = color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(leftHand.position.x, leftHand.position.y);
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  };

  const rightHand = game.createNewBall(5, color.body);
  rightHand.renderbody.renderPriority = -1;
  rightHand.rigidbody.collider.collidable = false;
  rightHand.position.Set(body.position);
  rightHand.rigidbody.onPhysicUpdate = () => {
    const target = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      10 + (2 * Math.random() - 1) * 20,
      70
    ).Add(new Vector2(Math.random() * 8, Math.random() * 8));

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
    const anchor = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      10,
      55
    );
    ctx.strokeStyle = color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightHand.position.x, rightHand.position.y);
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  };

  const leftFoot = game.createNewBall(5, color.body);
  leftFoot.rigidbody.collider.collidable = false;
  leftFoot.renderbody.renderPriority = -1;
  leftFoot.position.Set(body.position);
  leftFoot.rigidbody.onPhysicUpdate = () => {
    const target = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      -50,
      -10 - Math.random() * 20
    ).Add(new Vector2(Math.random() * 8, Math.random() * 8));

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
    const anchor = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      -35,
      -15
    );
    ctx.strokeStyle = color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(leftFoot.position.x, leftFoot.position.y);
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  };

  const rightFoot = game.createNewBall(5, color.body);
  rightFoot.rigidbody.collider.collidable = false;
  rightFoot.renderbody.renderPriority = -1;
  rightFoot.position.Set(body.position);
  rightFoot.rigidbody.onPhysicUpdate = () => {
    const target = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      -50,
      10 + Math.random() * 20
    ).Add(new Vector2(Math.random() * 8, Math.random() * 8));

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
    const anchor = Vector2.RotatedOffsetPosition(
      body.position,
      body.rotation.angle,
      -35,
      15
    );
    ctx.strokeStyle = color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(rightFoot.position.x, rightFoot.position.y);
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  };

  game.render.SortRenderSequence();
}

function setupHTML() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Bing Bong (PEAK)</h1>
  <div>Bing Bong!</div>
  <h2>Copyright Notice</h2>
  <div>The character design featured here is the intellectual property of Aggro Crab & Landfall, creators of the game PEAK. All rights reserved.</div>
`;
}
