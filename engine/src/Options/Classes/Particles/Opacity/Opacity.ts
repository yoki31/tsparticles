import type { IOpacity } from "../../../Interfaces/Particles/Opacity/IOpacity";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { OpacityAnimation } from "./OpacityAnimation";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";
import { ValueWithRandom } from "../../ValueWithRandom";
import { setRangeValue } from "../../../../Utils/NumberUtils";

/**
 * [[include:Options/Particles/Opacity.md]]
 * @category Options
 */
export class Opacity extends ValueWithRandom implements IOpacity, IOptionLoader<IOpacity> {
    /**
     *
     * @deprecated this property is obsolete, please use the new animation
     */
    get anim(): OpacityAnimation {
        return this.animation;
    }

    /**
     *
     * @deprecated this property is obsolete, please use the new animation
     * @param value
     */
    set anim(value: OpacityAnimation) {
        this.animation = value;
    }

    animation;

    constructor() {
        super();
        this.animation = new OpacityAnimation();
        this.random.minimumValue = 0.1;
        this.value = 1;
    }

    load(data?: RecursivePartial<IOpacity>): void {
        if (!data) {
            return;
        }

        super.load(data);

        const animation = data.animation ?? data.anim;

        if (animation !== undefined) {
            this.animation.load(animation);

            this.value = setRangeValue(this.value, this.animation.enable ? this.animation.minimumValue : undefined);
        }
    }
}
