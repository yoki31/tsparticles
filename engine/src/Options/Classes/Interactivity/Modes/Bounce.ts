import type { IBounce } from "../../../Interfaces/Interactivity/Modes/IBounce";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";

export class Bounce implements IBounce, IOptionLoader<IBounce> {
    distance: number;

    constructor() {
        this.distance = 200;
    }

    load(data?: RecursivePartial<IBounce>): void {
        if (!data) {
            return;
        }

        if (data.distance !== undefined) {
            this.distance = data.distance;
        }
    }
}
