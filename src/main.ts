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
  private canvas = document.querySelector(".app") as HTMLElement;
  private world = new b2World(new b2Vec2(0, 10));
  private selectedBox: any = null;
  private mouseJoint: any = null;
  private images: any[] = [];
  private texts = [
    "youtube",
    "instagram",
    "email",
    "facebook",
    "tiktok",
    "linkedin",
  ];
  private assets = {
    youtube: "public/Youtube_logo.png",
    instagram: "public/images.jpg",
    facebook: "public/Facebook_logo.png",
    tiktok: "public/images.png",
    linkedin: "public/LinkedIn_logo_initials.png",
    email: "public/pngtree-email-icon-png-image_1757854.jpg",
  };

  private scaleX = 1;
  private scaleY = 1;

  constructor() {
    Assets.addBundle("assets", this.assets);
  }

  init() {
    Assets.loadBundle(["assets"]).then(async () => {
      this.images = [
        this.assets.youtube,
        this.assets.instagram,
        this.assets.email,
        this.assets.facebook,
        this.assets.tiktok,
        this.assets.linkedin,
      ];
      await this.app.init({
        width: 610,
        height: 600,
        backgroundColor: "green",
        backgroundAlpha: 1,
        antialias: true,
      });
      if (this.canvas) {
        this.canvas.appendChild(this.app.canvas);
        this.handleResize(this.canvas);
      }
      this.addEvents(this.canvas);
      (globalThis as any).__PIXI_APP__ = this.app;

      this.createStaticBox(300, 580, 600, 50);
      this.createStaticBox(0, 300, 40, 600);
      this.createStaticBox(600, 300, 40, 600);
      this.createStaticBox(300, 0, 600, 40);

      const dynamicBoxes = [
        this.createDynamicBox(45, 100, 150, 50),
        this.createDynamicBox(220, 150, 150, 50),
        this.createDynamicBox(250, 1, 150, 50),
        this.createDynamicBox(420, 10, 150, 50),
        this.createDynamicBox(340, 130, 160, 50),
        this.createDynamicBox(500, 300, 160, 50),
      ];
      const boxGraphics = dynamicBoxes.map((_, index: number) => {
        const cont = new Container();
        const isntaText = new Text({
          text: this.texts[index],
          style: {
            fontSize: 14,
          },
        });

        const insta = new Sprite(Assets.get(this.images[index]));
        insta.anchor.set(0.5, 0.5);
        insta.width = 20;
        insta.height = 20;
        insta.x = -40;
        insta.y = 0;

        isntaText.anchor.set(0.5, 0.5);
        const box = new Graphics()
          .roundRect(-80, -25, 160, 50, 30)
          .fill({ color: 0xea19c9 });
        cont.addChild(box, insta, isntaText);
        return cont;
      });
      this.app.stage.addChild(...boxGraphics);

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
    let isMoved = false;

    this.app.canvas.addEventListener("pointerdown", (event: MouseEvent) => {
      let canvasWidth = 0;
      if (this.canvas.offsetWidth >= 610) {
        canvasWidth = 610;
      } else {
        canvasWidth = this.canvas.offsetWidth;
      }
      mouseX = event.offsetX / (canvasWidth / 21);
      mouseY = event.offsetY / (canvasWidth / 21);

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
          isMoved = false;
        }
      });
    });

    this.app.canvas.addEventListener("pointermove", (event: MouseEvent) => {
      let canvasWidth = 610;
      if (this.canvas.offsetWidth >= 610) {
        canvasWidth = 610;
      } else {
        canvasWidth = this.canvas.offsetWidth;
      }
      mouseX = event.offsetX / (canvasWidth / 21);
      mouseY = event.offsetY / (canvasWidth / 21);

      let isHovering = false;

      dynamicBoxes.forEach((box, index) => {
        const fixture = box.GetFixtureList();
        const shape = fixture.GetShape();

        const isInside = shape.TestPoint(
          box.GetTransform(),
          new b2Vec2(mouseX, mouseY)
        );
        const graphic = boxGraphics[index];

        if (isInside) {
          isHovering = true;
          const boxGraphic = graphic.getChildAt(0) as Graphics;
          boxGraphic.clear();
          boxGraphic.roundRect(-80, -25, 160, 50, 30);
          boxGraphic.fill({ color: 0x0000ff });
        } else {
          const boxGraphic = graphic.getChildAt(0) as Graphics;
          boxGraphic.clear();
          boxGraphic.roundRect(-80, -25, 160, 50, 30);
          boxGraphic.fill({ color: 0xea19c9 });
        }
      });

      this.app.canvas.style.cursor = isHovering ? "pointer" : "default";

      if (this.mouseJoint) {
        this.mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
        isMoved = true;
      }
    });

    this.app.canvas.addEventListener("pointerup", () => {
      if (this.mouseJoint) {
        const index = dynamicBoxes.indexOf(this.selectedBox);
        if (!isMoved && index !== -1) {
          switch (index) {
            case 0:
              window.open("https://www.youtube.com", "_blank");
              break;
            case 1:
              window.open("https://www.instagram.com", "_blank");
              break;
            case 2:
              window.open("https://www.gmail.com", "_blank");
              break;
            case 3:
              window.open("https://www.facbook.com", "_blank");
              break;
            case 4:
              window.open("https://www.tiktok.com", "_blank");
              break;
            case 5:
              window.open("https://www.linkedin.com", "_blank");
              break;
            default:
              break;
          }
        }

        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
        this.selectedBox = null;
        isMoved = false;
      }
    });

    this.app.canvas.addEventListener("pointerleave", () => {
      if (this.mouseJoint) {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
        this.selectedBox = null;
        isMoved = false;
      }

      this.app.canvas.style.cursor = "default";
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

    bodyDef.linearDamping = 0.1;
    bodyDef.angularDamping = 0.1;

    const shape = new b2PolygonShape();
    shape.SetAsBox(width / 30 / 2, height / 30 / 2);

    const body = this.world.CreateBody(bodyDef);

    const fixtureDef = new b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;

    fixtureDef.restitution = 0.5;

    body.CreateFixture(fixtureDef);

    return body;
  }

  addEvents = (nativeElement: HTMLElement) => {
    window?.addEventListener("resize", () => this.handleResize(nativeElement));
  };

  handleResize = (nativeElement: HTMLElement) => {
    if (!nativeElement || !this.app) return;

    const newWidth = nativeElement.offsetWidth;

    if (newWidth <= 600) {
      this.scaleX = newWidth / 610;
      this.scaleY = 600 / newWidth;

      this.app.renderer.resize(newWidth, newWidth * this.scaleX * this.scaleY);
      this.app.stage.scale.set(this.scaleX);
    } else {
      this.app.renderer.resize(610, 600);
      this.app.stage.scale.set(1);
    }
  };
}

const cavnas = new Canvas();
cavnas.init();
