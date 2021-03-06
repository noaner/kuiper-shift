import Asteroid from "./asteroid";
import { Vec3, Matrix } from "./math";

export enum ShipState {
  Accelerating,
  Braking,
  Idle
}

export default class Ship {
  // prettier-ignore
  rot = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  pos = [0, 0, 0];
  vel = [0, 0, 0];
  hasControl = false;
  miningDistance = 0.6;
  asteroidShrinkRate = 0.1;
  miningRate = 50;
  state = ShipState.Idle;
  ore = 0;
  credits = 0;
  onDamage: () => any = () => {};
  hullIntegrity = 1;
  isBrakingEnabled = true;

  update() {
    this.state = ShipState.Idle;

    if (this.hullIntegrity > 0) {
      if (this.hasControl) {
        // turn ship
        if (p.keyDown("left")) this.turn(0, p.deltaTime);
        if (p.keyDown("right")) this.turn(0, -p.deltaTime);
        if (p.keyDown("up")) this.turn(p.deltaTime, 0);
        if (p.keyDown("down")) this.turn(-p.deltaTime, 0);

        // accelerate forwards/backwards
        if (p.keyDown("z")) this.thrust([0, 0, p.deltaTime]);
        if (p.keyDown("x")) this.thrust([0, 0, -p.deltaTime]);
      }

      if ((p.keyDown("z") || p.keyDown("x")) && this.hasControl) {
        this.state = ShipState.Accelerating;
      } else if (this.isBrakingEnabled) {
        // apply braking force if in motion
        const speed = Vec3.mag(this.vel);
        if (speed > 10e-4) {
          this.state = ShipState.Braking;
          const brakingForce = -Math.min(p.deltaTime, Vec3.mag(this.vel));
          const drag = Vec3.scale(Vec3.normalize(this.vel), brakingForce);
          this.vel = Vec3.add(drag, this.vel);
        } else {
          this.vel = [0, 0, 0];
        }
      }
    } else {
      // slowly drift away after ship explodes
      this.vel = Vec3.scale(Vec3.normalize(this.vel), 0.5);
    }

    this.pos = Vec3.add(this.pos, Vec3.scale(this.vel, p.deltaTime));
  }

  mine(asteroid: Asteroid) {
    asteroid.radius -= p.deltaTime * this.asteroidShrinkRate;
    this.ore += p.deltaTime * this.miningRate;
    this.ore = Math.min(this.ore, 1000);
  }

  turn(pitch: number, yaw: number) {
    this.rot = Matrix.mult3x3(
      Matrix.pitch(pitch),
      Matrix.mult3x3(Matrix.yaw(yaw), this.rot)
    );
  }

  thrust(acc: number[]) {
    this.vel = Vec3.add(this.vel, Matrix.mult3x3vec(this.rot, acc));
  }

  collideWithAsteroid(a: Asteroid) {
    const asteroidToShip = Vec3.sub(this.pos, a.pos);

    this.pos = Vec3.add(
      a.pos,
      Vec3.scale(Vec3.normalize(asteroidToShip), a.radius + 10e-5)
    );

    this.vel = Vec3.sub(
      this.vel,
      Vec3.scale(
        asteroidToShip,
        (2 * Vec3.dot(this.vel, asteroidToShip)) / Vec3.magSq(asteroidToShip)
      )
    );

    const damage = Math.min(Vec3.mag(this.vel) * 0.5, 0.4 + Math.random() * 0.1);
    this.hullIntegrity -= damage;
    this.onDamage();
  }

  get speed() {
    return Vec3.mag(this.vel);
  }

  get forward() {
    return Matrix.mult3x3vec(this.rot, [0, 0, 1]);
  }

  get isMoving() {
    return Vec3.magSq(this.vel) > 0;
  }
}
