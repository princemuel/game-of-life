import { Universe } from "game-of-life";
import { getElement } from "./dom";

const pre = getElement("#game-of-life-canvas", HTMLPreElement);
const universe = Universe.new();

const renderLoop = () => {
  pre.textContent = universe.render();
  universe.tick();

  window.requestAnimationFrame(renderLoop);
};

window.requestAnimationFrame(renderLoop);
