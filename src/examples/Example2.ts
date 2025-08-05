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
    const body = game.createNewEllipse(30 / 2, 22.5 / 4, "#b5b8bd");
    body.position.x = window.innerWidth / 2;
    body.position.y = window.innerHeight / 2;
    body.onUpdate = () => {
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
  }

  // const head = game.createNewEllipse(30, 22.5, "#b5b8bd");
  // head.position.x = window.innerWidth / 2;
  // head.position.y = window.innerHeight / 2;
  // head.onUpdate = () => {
  //   head.rotation.LookAt(head.position, mouse);

  //   if (Distance(head.position, mouse) < 80) {
  //     head.rigidbody.AddForce(
  //       game.physic.deltaTime *
  //         game.physic.meterToPixel *
  //         game.physic.simulationSpeed,
  //       mouse.Clone().Subtract(head.position).Normalize().MultiplyScalar(-1)
  //     );
  //   }
  //   if (Distance(head.position, mouse) > 100) {
  //     head.rigidbody.AddForce(
  //       game.physic.deltaTime *
  //         game.physic.meterToPixel *
  //         game.physic.simulationSpeed,
  //       mouse.Clone().Subtract(head.position).Normalize().MultiplyScalar(1)
  //     );
  //   }
  // };
}
