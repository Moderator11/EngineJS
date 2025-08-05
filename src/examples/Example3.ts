import { Distance, Vector2 } from "@src//utils/Vector2";
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
  body.onFrameUpdate = () => {
    body.rotation.LookAt(body.position, mouse);

    if (Distance(body.position, mouse) < 80) {
      body.rigidbody.AddForce(
        game.physic.deltaTime *
          game.physic.meterToPixel *
          game.physic.simulationSpeed,
        mouse.Clone().Subtract(body.position).Normalize().MultiplyScalar(-1)
      );
    }
    if (Distance(body.position, mouse) > 100) {
      body.rigidbody.AddForce(
        game.physic.deltaTime *
          game.physic.meterToPixel *
          game.physic.simulationSpeed,
        mouse.Clone().Subtract(body.position).Normalize().MultiplyScalar(1)
      );
    }
  };

  // Order is important, when cock is added prior to the head, cock update happens first than head, which creates delayed like movement
  const head = game.createNewEllipse(22.5 / 2, 30 / 2, "#353743");
  head.rigidbody.collider.collidable = false;
  head.rigidbody.isStatic = true;
  head.rigidbody.onPhysicUpdate = () => {
    head.rotation.LookAt(head.position, mouse);
    head.position.x = body.position.x + Math.cos(body.rotation.angle) * 5;
    head.position.y = body.position.y + Math.sin(body.rotation.angle) * 5;
  };

  const cock = game.createNewEllipse(10, 5, "orange");
  cock.rigidbody.collider.collidable = false;
  cock.rigidbody.isStatic = true;
  cock.rigidbody.onPhysicUpdate = () => {
    cock.rotation.angle = head.rotation.angle;
    cock.position.x = head.position.x + Math.cos(head.rotation.angle) * 10;
    cock.position.y = head.position.y + Math.sin(head.rotation.angle) * 10;
  };
}
