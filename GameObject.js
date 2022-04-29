class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/people/hero.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }

  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If there's a behavior, initialize it after short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 200);
  }

  update() {}

  async doBehaviorEvent(map) {
    // Do nothing if there's a cutscene or no object behavior
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }

    // Setting up our event with relevant config
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event
    const eventHandler = new OverworldEvent({
      map,
      event: eventConfig,
    });
    await eventHandler.init();

    // Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Repeat
    this.doBehaviorEvent(map);
  }
}
