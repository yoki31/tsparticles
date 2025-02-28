import { TiltAnimation } from "./TiltAnimation";
import { TiltDirection, TiltDirectionAlt } from "../../../../Enums";
import type { RecursivePartial } from "../../../../Types";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { ValueWithRandom } from "../../ValueWithRandom";
import type { ITilt } from "../../../Interfaces/Particles/Tilt/ITilt";

/**
 * [[include:Options/Particles/Rotate.md]]
 * @category Options
 */
export class Tilt extends ValueWithRandom implements ITilt, IOptionLoader<ITilt> {
    animation;
    direction: TiltDirection | keyof typeof TiltDirection | TiltDirectionAlt;
    enable;

    constructor() {
        super();
        this.animation = new TiltAnimation();
        this.direction = TiltDirection.clockwise;
        this.enable = false;
        this.value = 0;
    }

    load(data?: RecursivePartial<ITilt>): void {
        if (!data) {
            return;
        }

        super.load(data);

        this.animation.load(data.animation);

        if (data.direction !== undefined) {
            this.direction = data.direction;
        }

        if (data.enable !== undefined) {
            this.enable = data.enable;
        }
    }
}
