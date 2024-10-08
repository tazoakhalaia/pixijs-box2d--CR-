import Matter, { Composite, Mouse, MouseConstraint, Runner } from "matter-js";
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
} from "pixi.js";

class Canvas {
  private app = new Application();
  private canvas = document.querySelector(".app");
  private engine = Matter.Engine.create();
  private mouseConstraint?: MouseConstraint;
  private cont = new Container();

  private assets = {
    insta:
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
  };

  private isntaText = new Text({
    text: "Intagram",
    style: {
      fontSize: 14,
    },
  });

  private ground = Matter.Bodies.rectangle(300, 580, 600, 50, {
    isStatic: true,
  });
  private leftWall = Matter.Bodies.rectangle(0, 300, 40, 600, {
    isStatic: true,
  });
  private rightWall = Matter.Bodies.rectangle(600, 300, 40, 600, {
    isStatic: true,
  });
  private ceiling = Matter.Bodies.rectangle(300, 0, 600, 40, {
    isStatic: true,
  });
  private box = Matter.Bodies.rectangle(45, 100, 150, 50);
  private box1 = Matter.Bodies.rectangle(230, 150, 150, 50);
  private box2 = Matter.Bodies.rectangle(250, 0, 150, 50);
  private box3 = Matter.Bodies.rectangle(420, 0, 150, 50);
  private box4 = Matter.Bodies.rectangle(340, 20, 160, 50);
  private box5 = Matter.Bodies.rectangle(500, 300, 160, 50);

  constructor() {
    Assets.addBundle("assets", this.assets);
  }

  init() {
    Assets.loadBundle(["assets"]).then(async () => {
      await this.app.init({
        width: 610,
        height: 600,
        backgroundColor: 'green',
        backgroundAlpha: 1,
        antialias: true,
      });
      if (this.canvas) {
        this.canvas?.appendChild(this.app.canvas);
      }
      (globalThis as any).__PIXI_APP__ = this.app;

      const boxGraphics = new Graphics()
        .roundRect(-90, -25, 180, 50, 30)
        .fill({ color: "#ea19c9" });

      const insta = new Sprite(Assets.get("insta"));
      insta.anchor.set(0.5, 0.5);
      insta.width = 20;
      insta.height = 20;
      insta.x = -40;
      insta.y = 0;

      this.isntaText.anchor.set(0.5, 0.5);

      this.cont.addChild(boxGraphics, insta, this.isntaText);

      const boxGraphics1 = new Graphics()
        .roundRect(-75, -25, 150, 50, 30)
        .fill({ color: "#ea19c9" });
      const boxGraphics2 = new Graphics()
        .roundRect(-75, -25, 150, 50, 30)
        .fill({ color: "#ea19c9" });

      const boxGraphics3 = new Graphics()
        .roundRect(-75, -25, 150, 50, 30)
        .fill({ color: "#ea19c9" });
      const boxGraphics4 = new Graphics()
        .roundRect(-80, -25, 160, 50, 30)
        .fill({ color: "#ea19c9" });
      const boxGraphics5 = new Graphics()
        .roundRect(-80, -25, 160, 50, 30)
        .fill({ color: "#ea19c9" });

      const groundGraphics = new Graphics()
        .rect(-300, -20, 600, 40)
        .fill({ color: "transparent" });

      const leftWallGraphics = new Graphics()
        .rect(-20, -300, 40, 600)
        .fill({ color: "transparent" });

      const rightWallGraphics = new Graphics()
        .rect(-20, -300, 40, 600)
        .fill({ color: "transparent" });

      const ceilingGraphics = new Graphics()
        .rect(-300, -20, 600, 40)
        .fill({ color: "transparent" });

      this.app.stage.addChild(
        groundGraphics,
        this.cont,
        boxGraphics1,
        boxGraphics2,
        boxGraphics3,
        boxGraphics4,
        boxGraphics5,
        leftWallGraphics,
        rightWallGraphics,
        ceilingGraphics
      );

      this.app.ticker.add(() => {
        this.cont.x = this.box.position.x;
        this.cont.y = this.box.position.y;
        this.cont.rotation = this.box.angle;

        boxGraphics1.x = this.box1.position.x;
        boxGraphics1.y = this.box1.position.y;
        boxGraphics1.rotation = this.box1.angle;

        boxGraphics2.x = this.box2.position.x;
        boxGraphics2.y = this.box2.position.y;
        boxGraphics2.rotation = this.box2.angle;

        boxGraphics3.x = this.box3.position.x;
        boxGraphics3.y = this.box3.position.y;
        boxGraphics3.rotation = this.box3.angle;

        boxGraphics4.x = this.box4.position.x;
        boxGraphics4.y = this.box4.position.y;
        boxGraphics4.rotation = this.box4.angle;

        boxGraphics5.x = this.box5.position.x;
        boxGraphics5.y = this.box5.position.y;
        boxGraphics5.rotation = this.box5.angle;

        groundGraphics.x = this.ground.position.x;
        groundGraphics.y = this.ground.position.y;
        groundGraphics.rotation = this.ground.angle;

        leftWallGraphics.x = this.leftWall.position.x;
        leftWallGraphics.y = this.leftWall.position.y;

        rightWallGraphics.x = this.rightWall.position.x;
        rightWallGraphics.y = this.rightWall.position.y;

        ceilingGraphics.x = this.ceiling.position.x;
        ceilingGraphics.y = this.ceiling.position.y;
      });

      const mouse = Mouse.create(this.app.canvas);
      this.mouseConstraint = MouseConstraint.create(this.engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
        },
      });

      Matter.Events.on(this.mouseConstraint, "mouseup", () => {
        if (this.mouseConstraint)
          Matter.World.remove(this.engine.world, this.mouseConstraint);
      });

      Matter.Events.on(this.mouseConstraint, "mousedown", () => {
        if (this.mouseConstraint)
          Matter.World.add(this.engine.world, this.mouseConstraint);
      });

      Composite.add(this.engine.world, [
        this.ground,
        this.leftWall,
        this.rightWall,
        this.ceiling,
        this.box,
        this.box1,
        this.box2,
        this.box3,
        this.box4,
        this.box5,
        this.mouseConstraint,
      ]);

      const runner = Runner.create();
      Matter.Runner.run(runner, this.engine);
    });
  }

  addMouseConstraint() {
    if (this.mouseConstraint)
      Matter.World.add(this.engine.world, this.mouseConstraint);
  }
}

const cavnas = new Canvas();
cavnas.init();
