import { Distance, Vector2 } from "@src//utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";

export default function Example2() {
  const game = new GameEngine2D();

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  game.start();

  game.physic.gravity = false;

  for (let i = 0; i < 100; i++) {
    const follower = game.createNewEllipse(30 / 2, 22.5 / 2, "#b5b8bd");
    follower.position.x = window.innerWidth / 2;
    follower.position.y = window.innerHeight / 2;
    follower.onFrameUpdate = () => {
      follower.rotation.LookAt(follower.position, mouse);

      if (Distance(follower.position, mouse) < 80) {
        follower.rigidbody.AddForce(
          game.physic.deltaTime *
            game.physic.meterToPixel *
            game.physic.simulationSpeed,
          mouse
            .Clone()
            .Subtract(follower.position)
            .Normalize()
            .MultiplyScalar(-1)
        );
      }
      if (Distance(follower.position, mouse) > 100) {
        follower.rigidbody.AddForce(
          game.physic.deltaTime *
            game.physic.meterToPixel *
            game.physic.simulationSpeed,
          mouse
            .Clone()
            .Subtract(follower.position)
            .Normalize()
            .MultiplyScalar(1)
        );
      }
    };
  }
}
