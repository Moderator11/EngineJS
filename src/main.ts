import { Object } from "./core/Object";
import { Vector2 } from "./utils/Vector2";
import { CircleCollider2D } from "./core/physics/CircleCollider2D";
import { CircleMesh2D } from "./core/render/CircleMesh2D";
import { GameEngine2D } from "@src/core/GameEngine2D";

(function () {
  const game = new GameEngine2D();

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  game.onMouseClick = (e) => {
    if (e.button === 0) {
      const ball = game.createNewBall(10, "orange");
      ball.rigidbody.position.x = mouse.x;
      ball.rigidbody.position.y = mouse.y;
      ball.rigidbody.velocity.x = (2 * Math.random() - 1) * 10;
      ball.rigidbody.velocity.y = (2 * Math.random() - 1) * 10;
    }
  };

  game.onKeyDown = (e) => {
    switch (e.key) {
      case "1":
        game.physic.simulationSpeed /= 2;
        break;
      case "2":
        game.physic.simulationSpeed *= 2;
        break;
    }
  };

  game.start();
})();

/* Just for display */
// import "./style.css";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//   <p>Vite + TypeScript</p>
//   <p>Development environment display</p>
// `;
