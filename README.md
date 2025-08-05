# EngineJS

EngineJS is a modular and scalable game engine designed for rapid development and experimentation.

Originally written in JavaScript, it has been fully ported to TypeScript to improve type safety, maintainability, and development experience.

The build process outputs a single JavaScript file that can be loaded in to HTML. Once loaded, it dynamically creates and manages the HTML elements needed to display the engine’s content.

## Getting Started

1. Install [Node JS](https://nodejs.org)

   Make sure you have Node.js installed on your system.

2. Clone repository, install dependencies.

```BASH
git clone git@github.com:Moderator11/EngineJS.git
cd EngineJS
npm install
```

3. Run development server.

```BASH
npm run dev
```

4. Build cool project with EngineJS.

   Use the development environment to prototype and test your ideas.
   Read [manual](./docs/EngineJSManual.md) for details.

5. Build it into single JS file.

```BASH
npm run build
```

This will generate the bundled file in the `dist` folder.

6. Test it with `test.html`

Open `test.html` in your browser. It will load the built script from the dist directory.

7. Use the engine in any HTML file.

```HTML
<script src="script.js"></script>
```

8. Enjoy.

## Documentation

For detailed information on how to use the engine, please refer to the [EngineJS Manual](./docs/EngineJSManual.md).

It covers core concepts, usage examples, and code snippets.

## Tech Stack

This project is built using the following technologies:

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Related Works

- [Pato](https://github.com/Moderator11/Pato), a simple script that renders a duck using HTML Canvas on a web browser.
