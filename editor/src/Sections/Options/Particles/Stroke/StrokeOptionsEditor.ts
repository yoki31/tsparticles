import type { Container, IStroke } from "tsparticles-engine";
import { EditorGroup, EditorType, SingleOrMultiple } from "object-gui";
import { ColorOptionsEditor } from "../Color/ColorOptionsEditor";
import { EditorBase } from "../../../../EditorBase";

export class StrokeOptionsEditor extends EditorBase {
    group!: EditorGroup;
    private options!: SingleOrMultiple<IStroke>;

    constructor(particles: Container) {
        super(particles);
    }

    addToGroup(parent: EditorGroup): void {
        this.group = parent.addGroup("stroke", "Stroke");
        this.options = this.group.data as SingleOrMultiple<IStroke>;

        if (this.options instanceof Array) {
            for (let i = 0; i < this.options.length; i++) {
                const group = this.group.addGroup(i.toString(10), `Stroke_${i + 1}`, true, this.options);

                this.addStroke(group);
            }
        } else {
            this.addStroke(this.group);
        }
    }

    private addStroke(group: EditorGroup): void {
        const particles = this.particles;
        const options = group.data as IStroke;

        if (options.color === undefined) {
            options.color = {
                value: "",
                animation: {
                    count: 0,
                    enable: false,
                    offset: { max: 0, min: 0 },
                    speed: 0,
                    sync: false,
                },
            };
        }

        const colorOptions = new ColorOptionsEditor(this.particles);

        colorOptions.addToGroup(group, options);

        group
            .addProperty("opacity", "Opacity", EditorType.number)
            .change(async () => {
                await particles.refresh();
            })
            .step(0.01)
            .min(0)
            .max(1);

        group.addProperty("width", "Width", EditorType.number).change(async () => {
            await particles.refresh();
        });
    }
}
