import type { ILightShadow } from "../../../Interfaces/Interactivity/Modes/ILightShadow";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { OptionsColor } from "../../OptionsColor";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";

export class LightShadow implements ILightShadow, IOptionLoader<ILightShadow> {
    color;
    length;

    constructor() {
        this.color = new OptionsColor();
        this.color.value = "#000000";

        this.length = 2000;
    }

    load(data?: RecursivePartial<ILightShadow>): void {
        if (!data) {
            return;
        }

        this.color = OptionsColor.create(this.color, data.color);

        if (data.length !== undefined) {
            this.length = data.length;
        }
    }
}
