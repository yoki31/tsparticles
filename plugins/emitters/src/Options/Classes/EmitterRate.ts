import type { IOptionLoader, RangeValue, RecursivePartial } from "tsparticles-engine";
import type { IEmitterRate } from "../Interfaces/IEmitterRate";
import { setRangeValue } from "tsparticles-engine";

/**
 * @category Emitters Plugin
 */
export class EmitterRate implements IEmitterRate, IOptionLoader<IEmitterRate> {
    quantity: RangeValue;
    delay: RangeValue;

    constructor() {
        this.quantity = 1;
        this.delay = 0.1;
    }

    load(data?: RecursivePartial<IEmitterRate>): void {
        if (data === undefined) {
            return;
        }

        if (data.quantity !== undefined) {
            this.quantity = setRangeValue(data.quantity);
        }

        if (data.delay !== undefined) {
            this.delay = setRangeValue(data.delay);
        }
    }
}
