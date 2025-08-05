# Examples

## How to use examples

We’ll use `Example1.ts` as a basic showcase.

To run it, simply import the `Example1()` function into `main.ts` and call it as shown below:

```TypeScript
import Example1 from "./examples/Example1";
import "./style.css";

(function () {
  Example1();
})();

```

Test it by running development server then [open it in your browser](http://localhost:5173)

```CMD
npm run dev
```

## Example1

`Example1` demonstrates a simple physics simulation with **basic object movement and collision**. It also includes **keyboard event handling** to trigger the spawning of new objects into the scene.

## Example2

`Example2` showcases **object interaction based on mouse position tracking.** It also demonstrates object collision with environmental elements, such as walls.

## Example3

`Example3` contains a more advanced scenario involving a **complex object setup**. This complex object is composed of multiple individual objects that interact with each other.
