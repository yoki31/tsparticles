import type { IOptionLoader, RecursivePartial } from "tsparticles-engine";
import type { IEmitterLife } from "../Interfaces/IEmitterLife";

/**
 * @category Emitters Plugin
 */
export class EmitterLife implements IEmitterLife, IOptionLoader<IEmitterLife> {
    count?: number;
    delay?: number;
    duration?: number;
    wait;

    constructor() {
        this.wait = false;
    }

    load(data?: RecursivePartial<IEmitterLife>): void {
        if (data === undefined) {
            return;
        }

        if (data.count !== undefined) {
            this.count = data.count;
        }

        if (data.delay !== undefined) {
            this.delay = data.delay;
        }

        if (data.duration !== undefined) {
            this.duration = data.duration;
        }

        if (data.wait !== undefined) {
            this.wait = data.wait;
        }
    }
}
