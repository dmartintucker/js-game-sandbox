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

      // Draw map lower layer
      this.map.drawLowerImage(this.ctx);

      // Draw game objects
      Object.values(this.map.gameObjects).forEach((o) => {
        o.update({
          arrow: this.directionInput.direction,
        });
        o.sprite.draw(this.ctx);
      });

      // Draw map upper layer
      this.map.drawUpperImage(this.ctx);

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
    // Enable direction input
    this.directionInput = new DirectionInput();
    this.directionInput.init();
    // Initialize game loop
    this.startGameLoop();
  }
}
