// Top-level parent state component

class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // Clear the canvas (memory management)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish the camera focus sprite
      const cameraPerson = this.map.gameObjects.hero;

      // Update all game objects
      Object.values(this.map.gameObjects).forEach((o) => {
        o.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw map lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw all game objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((o) => {
          o.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw map upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      // Animation frame
      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    // Create map
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    // Enable direction input
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Initialize game loop
    this.startGameLoop();

    this.map.startCutscene([
      { who: "hero", type: "walk", direction: "down" },
      { who: "hero", type: "walk", direction: "down" },
      { who: "npcA", type: "walk", direction: "left" },
      { who: "npcA", type: "walk", direction: "left" },
      { who: "npcA", type: "stand", direction: "up", time: 2000 },
    ]);
  }
}
