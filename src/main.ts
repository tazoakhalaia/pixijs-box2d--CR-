import {
  b2BodyDef,
  b2BodyType,
  b2FixtureDef,
  b2MouseJointDef,
  b2PolygonShape,
  b2Vec2,
  b2World,
} from "box2d.ts";
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
  private cont = new Container();
  private world = new b2World(new b2Vec2(0, 10));
  private selectedBox: any = null;
  private mouseJoint: any = null;
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

  constructor() {
    Assets.addBundle("assets", this.assets);
  }

  init() {
    Assets.loadBundle(["assets"]).then(async () => {
      await this.app.init({
        width: 610,
        height: 600,
        backgroundColor: "green",
        backgroundAlpha: 1,
        antialias: true,
      });
      if (this.canvas) {
        this.canvas?.appendChild(this.app.canvas);
      }
      (globalThis as any).__PIXI_APP__ = this.app;

      const insta = new Sprite(Assets.get("insta"));
      insta.anchor.set(0.5, 0.5);
      insta.width = 20;
      insta.height = 20;
      insta.x = -40;
      insta.y = 0;

      this.isntaText.anchor.set(0.5, 0.5);

      this.createStaticBox(300, 580, 600, 50);
      this.createStaticBox(0, 300, 40, 600);
      this.createStaticBox(600, 300, 40, 600);
      this.createStaticBox(300, 0, 600, 40);

      const dynamicBoxes = [
        this.createDynamicBox(45, 100, 150, 50),
        this.createDynamicBox(230, 150, 150, 50),
        this.createDynamicBox(250, 0, 150, 50),
        this.createDynamicBox(420, 0, 150, 50),
        this.createDynamicBox(340, 20, 160, 50),
        this.createDynamicBox(500, 300, 160, 50),
      ];
      const boxGraphics = dynamicBoxes.map(() => {
        const box = new Graphics()
          .roundRect(-80, -25, 160, 50, 30)
          .fill({ color: 0xea19c9 });
        return box;
      });
      this.cont.addChild(insta);
      this.app.stage.addChild(this.cont, ...boxGraphics);

      this.app.ticker.add(() => {
        this.world.Step(1 / 30, 10, 10);
        dynamicBoxes.forEach((body, index) => {
          const position = body.GetPosition();
          const angle = body.GetAngle();
          const graphic = boxGraphics[index];
          graphic.x = position.x * 30;
          graphic.y = position.y * 30;
          graphic.rotation = angle;
        });
      });
      this.setupMouseEvents(dynamicBoxes, boxGraphics);
    });
  }

  setupMouseEvents(dynamicBoxes: any[], boxGraphics: any[]) {
    let mouseX = 0,
      mouseY = 0;

    this.app.view.addEventListener("mousedown", (event: MouseEvent) => {
      mouseX = event.offsetX / 30;
      mouseY = event.offsetY / 30;

      dynamicBoxes.forEach((box) => {
        const fixture = box.GetFixtureList();
        const shape = fixture.GetShape();

        const isInside = shape.TestPoint(
          box.GetTransform(),
          new b2Vec2(mouseX, mouseY)
        );
        if (isInside) {
          this.selectedBox = box;
          this.createMouseJoint(mouseX, mouseY, box);
        }
      });
    });

    this.app.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.mouseJoint) {
        mouseX = event.offsetX / 30;
        mouseY = event.offsetY / 30;
        this.mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
      }
    });

    this.app.canvas.addEventListener("mouseup", () => {
      if (this.mouseJoint) {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
        this.selectedBox = null;
      }
    });

    this.app.canvas.addEventListener("mouseleave", () => {
      if (this.mouseJoint) {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
        this.selectedBox = null;
      }
    });
  }

  createMouseJoint(mouseX: number, mouseY: number, body: any) {
    const mouseJointDef = new b2MouseJointDef();
    mouseJointDef.bodyA = this.world.CreateBody(new b2BodyDef());
    mouseJointDef.bodyB = body;
    mouseJointDef.target.Set(mouseX, mouseY);
    mouseJointDef.maxForce = 1000.0 * body.GetMass();
    this.mouseJoint = this.world.CreateJoint(mouseJointDef);
  }
  ////

  createStaticBox(x: number, y: number, width: number, height: number) {
    const bodyDef = new b2BodyDef();
    bodyDef.position.Set(x / 30, y / 30);
    bodyDef.type = b2BodyType.b2_staticBody;

    const shape = new b2PolygonShape();
    shape.SetAsBox(width / 30 / 2, height / 30 / 2);

    const body = this.world.CreateBody(bodyDef);
    body.CreateFixture(shape, 0);
  }
  createDynamicBox(x: number, y: number, width: number, height: number) {
    const bodyDef = new b2BodyDef();
    bodyDef.position.Set(x / 30, y / 30);
    bodyDef.type = b2BodyType.b2_dynamicBody;

    const shape = new b2PolygonShape();
    shape.SetAsBox(width / 30 / 2, height / 30 / 2);

    const body = this.world.CreateBody(bodyDef);
    const fixtureDef = new b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    body.CreateFixture(fixtureDef);

    return body;
  }
}

const cavnas = new Canvas();
cavnas.init();
