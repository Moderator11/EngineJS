import { Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";
import { CircleCollider2D } from "@src/core/physics/CircleCollider2D";

export default function Example4() {
  const game = new GameEngine2D();

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  let mouseDrag = false;
  game.onMouseDown = (e) => {
    if (e.button === 0) {
      const r = (ball.rigidbody.collider as CircleCollider2D).radius;
      if (Vector2.Distance(mouse, ball.position) < r) {
        mouseDrag = true;
        initialContact = ball.position.Clone().Subtract(mouse);
        vSum.x = 0;
        vSum.y = 0;
        vCount = 0;
      }
    }
  };
  game.onMouseUp = (e) => {
    if (e.button === 0) {
      mouseDrag = false;

      if (vCount > 0 && !(isNaN(vSum.x) || isNaN(vSum.y))) {
        vSum.MultiplyScalar(1 / vCount);
        ball.rigidbody.velocity.x = vSum.x;
        ball.rigidbody.velocity.y = vSum.y;
      }
      initialContact = null;
      vSum.x = 0;
      vSum.y = 0;
      vCount = 0;
    }
  };

  game.physic.simpleDrag = 0.925;
  game.physic.gravity = false;

  game.start();

  let vCount = 0;
  const vSum = new Vector2(0, 0);

  const ball = game.createNewBall(100, "rgba(100,100,100, 0.5)");
  ball.position.x = window.innerWidth / 2;
  ball.position.y = window.innerHeight / 2;
  ball.rigidbody.collider.collidable = false;
  let initialContact: Vector2 | null = null;
  ball.onFrameUpdate = () => {
    const r = (ball.rigidbody.collider as CircleCollider2D).radius;
    if (mouseDrag && Vector2.Distance(mouse, ball.position) < r) {
      if (!initialContact) return;
      vSum.x += mouse.x + initialContact.x - ball.position.x;
      vSum.y += mouse.y + initialContact.y - ball.position.y;
      vCount++;
      ball.position.x = mouse.x + initialContact.x;
      ball.position.y = mouse.y + initialContact.y;
      ball.rigidbody.velocity.MultiplyScalar(0);
    }
  };
  ball.renderbody.onRender = (ctx) => {
    ctx.font = "20pt Arial";
    ctx.fillText("Main Node", ball.position.x - 65, ball.position.y + 0);
    ctx.fillText("(Draggable)", ball.position.x - 70, ball.position.y + 30);
  };

  function reactionForce(x: number): number {
    return x - 1;
  }

  for (let i = 0; i < 8; i++) {
    const ball2 = game.createNewBall(20, "rgba(100,100,100, 0.5)");
    ball2.position.x = window.innerWidth / 2 + Math.random();
    ball2.position.y = window.innerHeight / 2 + Math.random();
    ball2.rigidbody.collider.collidable = false;
    ball2.rigidbody.onPhysicUpdate = () => {
      ball2.rigidbody.AddForce(
        game.physic.deltaTime *
          game.physic.meterToPixel *
          game.physic.simulationSpeed,
        ball.position
          .Clone()
          .Subtract(ball2.position)
          .Normalize()
          .MultiplyScalar(
            reactionForce(
              Vector2.Distance(ball2.position, ball.position) / 150
            ) * 4
          )
      );

      for (let i = 0; i < game.physic.physicPool.length; i++) {
        const o = game.physic.physicPool[i];
        if (o === ball2.rigidbody || o === ball.rigidbody) continue;
        ball2.rigidbody.AddForce(
          game.physic.deltaTime *
            game.physic.meterToPixel *
            game.physic.simulationSpeed,
          o.position
            .Clone()
            .Subtract(ball2.position)
            .Normalize()
            .MultiplyScalar(-0.1)
        );
      }
    };
    ball2.renderbody.onRender = (ctx) => {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "gray";
      const target = ball.position
        .Clone()
        .Subtract(ball2.position)
        .MultiplyScalar(0.1);
      ctx.moveTo(ball2.position.x + target.x, ball2.position.y + target.y);
      target.MultiplyScalar(4);
      ctx.lineTo(ball2.position.x + target.x, ball2.position.y + target.y);
      ctx.stroke();
      ctx.font = "10pt Arial";
      ctx.fillText("Sub", ball2.position.x - 15, ball2.position.y);
      ctx.fillText("Node", ball2.position.x - 15, ball2.position.y + 10);
    };
  }
}
