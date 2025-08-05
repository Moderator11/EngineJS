import { Vector2 } from "./utils/Vector2";
import { GameEngine2D } from "@src/core/GameEngine2D";
import "./style.css";

(function () {
  const game = new GameEngine2D();

  game.onStart = () => {
    /* Just for display */
    setupHTML();

    document
      .querySelector<HTMLInputElement>("#gravitytoggle")!
      .addEventListener("change", (e) => {
        game.physic.gravity = (e.target as HTMLInputElement).checked;
      });

    document
      .querySelector<HTMLInputElement>("#simpledrag")!
      .addEventListener("change", (e) => {
        game.physic.simpleDrag = parseFloat(
          (e.target as HTMLInputElement).value
        );
      });

    document
      .querySelector<HTMLInputElement>("#substep")!
      .addEventListener("change", (e) => {
        game.physic.subStepIteration = parseInt(
          (e.target as HTMLInputElement).value
        );
      });
  };

  let mouse: Vector2 = new Vector2(0, 0);
  game.onMouseMove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  game.onMouseClick = (e) => {
    if (e.button === 1) {
      for (let i = 0; i < 10; i++) {
        const ball = game.createNewBall(10, "orange");
        ball.rigidbody.position.x = mouse.x;
        ball.rigidbody.position.y = mouse.y;
        ball.rigidbody.velocity.x = (2 * Math.random() - 1) * 10;
        ball.rigidbody.velocity.y = (2 * Math.random() - 1) * 10;
      }
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
    document.querySelector<HTMLDivElement>(
      "#simspeed"
    )!.innerText = `Simulation speed: ${game.physic.simulationSpeed}`;
  };

  game.start();

  function setupHTML() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>EngineJS</h1>
    <fieldset style="width: fit-content; display: flex; flex-direction: column;">
      <legend>Development environment display</legend>
      <div>Dev environment: Vite + TypeScript</div>
      <div id="simspeed">Simulation speed: ${game.physic.simulationSpeed}</div>
      <label><input type="checkbox" id="gravitytoggle" checked />Gravity</label>
      <label><input type="range" min="0.95" max="1" step="0.001" value="${game.physic.simpleDrag}" id="simpledrag" checked />Drag factor</label>
      <label><input type="number" value="${game.physic.subStepIteration}" id="substep" checked />Sub step</label>
    </fieldset>
    <fieldset style="width: fit-content">
      <legend>Input Map</legend>
      <fieldset>
        <legend>Key</legend>
        <div>1: Simulation speed x0.5</div>
        <div>2: Simulation speed x2</div>
      </fieldset>
      <fieldset>
        <legend>Mouse</legend>
        <div>MMB: Spawn orange ball</div>
      </fieldset>
    </fieldset>
  `;
  }
})();
