import { ClickMode } from "../../../../Enums/Modes/ClickMode";
import type { IClickEvent } from "../../../Interfaces/Interactivity/Events/IClickEvent";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";
import type { SingleOrMultiple } from "../../../../Types/SingleOrMultiple";

/**
 * [[include:Options/Interactivity/Click.md]]
 * @category Options
 */
export class ClickEvent implements IClickEvent, IOptionLoader<IClickEvent> {
    /**
     * The click event handler enabling setting
     */
    enable;

    /**
     * Click mode values described in [[ClickMode]], an array of these values is also valid
     */
    mode: SingleOrMultiple<ClickMode | keyof typeof ClickMode | string>;

    constructor() {
        this.enable = false;
        this.mode = [];
    }

    load(data?: RecursivePartial<IClickEvent>): void {
        if (!data) {
            return;
        }

        if (data.enable !== undefined) {
            this.enable = data.enable;
        }

        if (data.mode !== undefined) {
            this.mode = data.mode;
        }
    }
}
