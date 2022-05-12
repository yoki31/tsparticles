import { AlterType, colorToHsl, getRangeValue } from "tsparticles-engine";
import type { IDelta, IParticleUpdater, Particle } from "tsparticles-engine";

function updateRoll(particle: Particle, delta: IDelta): void {
    const roll = particle.options.roll;

    if (!particle.roll || !roll.enable) {
        return;
    }

    const speed = particle.roll.speed * delta.factor;
    const max = 2 * Math.PI;

    particle.roll.angle += speed;

    if (particle.roll.angle > max) {
        particle.roll.angle -= max;
    }
}

export class RollUpdater implements IParticleUpdater {
    init(particle: Particle): void {
        const rollOpt = particle.options.roll;

        if (rollOpt.enable) {
            particle.roll = {
                angle: Math.random() * Math.PI * 2,
                speed: getRangeValue(rollOpt.speed) / 360,
            };

            if (rollOpt.backColor) {
                particle.backColor = colorToHsl(rollOpt.backColor);
            } else if (rollOpt.darken.enable && rollOpt.enlighten.enable) {
                const alterType = Math.random() >= 0.5 ? AlterType.darken : AlterType.enlighten;

                particle.roll.alter = {
                    type: alterType,
                    value: getRangeValue(
                        alterType === AlterType.darken ? rollOpt.darken.value : rollOpt.enlighten.value
                    ),
                };
            } else if (rollOpt.darken.enable) {
                particle.roll.alter = {
                    type: AlterType.darken,
                    value: getRangeValue(rollOpt.darken.value),
                };
            } else if (rollOpt.enlighten.enable) {
                particle.roll.alter = {
                    type: AlterType.enlighten,
                    value: getRangeValue(rollOpt.enlighten.value),
                };
            }
        } else {
            particle.roll = { angle: 0, speed: 0 };
        }
    }

    isEnabled(particle: Particle): boolean {
        const roll = particle.options.roll;

        return !particle.destroyed && !particle.spawning && roll.enable;
    }

    update(particle: Particle, delta: IDelta): void {
        if (!this.isEnabled(particle)) {
            return;
        }

        updateRoll(particle, delta);
    }
}
