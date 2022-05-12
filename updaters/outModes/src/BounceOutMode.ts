import type { Container, IDelta, OutModeAlt, OutModeDirection, Particle } from "tsparticles-engine";
import { OutMode, calculateBounds } from "tsparticles-engine";
import { bounceHorizontal, bounceVertical } from "./Utils";
import type { IOutModeManager } from "./IOutModeManager";

export class BounceOutMode implements IOutModeManager {
    modes: (OutMode | OutModeAlt | keyof typeof OutMode)[];

    constructor(private readonly container: Container) {
        this.modes = [
            OutMode.bounce,
            OutMode.bounceVertical,
            OutMode.bounceHorizontal,
            "bounceVertical",
            "bounceHorizontal",
            OutMode.split,
        ];
    }

    update(
        particle: Particle,
        direction: OutModeDirection,
        delta: IDelta,
        outMode: OutMode | OutModeAlt | keyof typeof OutMode
    ): void {
        if (!this.modes.includes(outMode)) {
            return;
        }

        const container = this.container;
        let handled = false;

        for (const [, plugin] of container.plugins) {
            if (plugin.particleBounce !== undefined) {
                handled = plugin.particleBounce(particle, delta, direction);
            }

            if (handled) {
                break;
            }
        }

        if (handled) {
            return;
        }

        const pos = particle.getPosition(),
            offset = particle.offset,
            size = particle.getRadius(),
            bounds = calculateBounds(pos, size),
            canvasSize = container.canvas.size;

        bounceHorizontal({ particle, outMode, direction, bounds, canvasSize, offset, size });
        bounceVertical({ particle, outMode, direction, bounds, canvasSize, offset, size });
    }
}
