import { TextAlign } from "pota-8";
import Ship, { ShipState } from "./ship";
import { light, dark } from "./colors";
import Plant, { PlantState } from "./plant";

export default class Gui {
  text: (string | null)[] = [];

  draw() {
    if (this.text) {
      let y = 6;
      for (const line of this.text) {
        if (!line) {
          y += 3;
          continue;
        }

        const w = p.textWidth(line);
        p.rect(p.width / 2 - Math.floor(w / 2) - 1, y - 1, w + 2, 7, dark);
        p.text(line, p.width / 2, y, { color: light, align: TextAlign.Center });
        y += 6;
      }
    }
  }

  showMining(ore: number) {
    this.text = ["mining", `${Math.floor(ore)}/1000 ore`];
  }

  holdFull() {
    this.text = ["cargo", "hold full", null, "time to", "rest"];
  }

  showDrivingControls() {
    this.text = ["Ⓩ forward", "Ⓧ reverse", "←→↑↓ turn", null, "Ⓒ cancel"];
  }

  miningInstructions() {
    this.text = [
      "carefully approach",
      "an asteroid",
      null,
      null,
      null,
      "to extract ores"
    ];
  }

  showShipState(ship: Ship) {
    if (ship.state === ShipState.Accelerating) {
      this.text = ["accelerating"];
    } else if (ship.state === ShipState.Braking) {
      this.text = ["braking"];
    }
  }

  interactConsole() {
    this.text = ["Ⓒ drive"];
  }

  interactBed() {
    this.text = ["Ⓒ rest"];
  }

  interactCalendar() {
    this.text = ["Ⓒ check calendar"];
  }

  interactHatchClosed() {
    this.text = ["Ⓒ open hatch"];
  }

  needScrewdriver() {
    this.text = ["you need a", "screwdriver", "for that"];
  }

  toggleHardMode(isHardMode: boolean) {
    if (isHardMode) {
      this.text = ["Ⓒ re-enable", "auto-braking", null, "mind your", "velcity"];
    } else {
      this.text = ["Ⓒ disable", "auto-braking", null, "caution!", "(hard mode)"];
    }
  }

  calendarText(day: number) {
    this.text = ["kuiper shift", "contract", null, `day ${day}`];
  }

  interactPlant(plant: Plant) {
    switch (plant.state()) {
      case PlantState.Happy:
        this.text = ["the plant", "looks happy"];
        break;
      case PlantState.Thirsty:
        this.text = ["the plant", "looks thirsty"];
        break;
    }

    this.text = [...this.text, null, "Ⓒ water", "Ⓧ move"];
  }

  holdingPlant(canChangeLevel: boolean) {
    this.text = ["Ⓧ place"];

    if (canChangeLevel) {
      this.text.push("↑↓ move");
    }
  }

  collided(ship: Ship) {
    if (p.elapsed % 0.5 < 2 / 6) {
      const hullIntegrity = `${Math.floor(ship.hullIntegrity * 100)}%`;
      this.text = ["collision", "detected", null, "hull: " + hullIntegrity];
    } else {
      this.text = [];
    }
  }
}
