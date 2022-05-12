import { ClickMode, ExternalInteractorBase } from "tsparticles-engine";
import type { Container } from "tsparticles-engine";

/**
 * Particle attract manager
 * @category Interactions
 */
export class Pauser extends ExternalInteractorBase {
    handleClickMode: (mode: string) => void;

    constructor(container: Container) {
        super(container);

        this.handleClickMode = (mode) => {
            if (mode !== ClickMode.pause) {
                return;
            }

            const container = this.container;

            if (container.getAnimationStatus()) {
                container.pause();
            } else {
                container.play();
            }
        };
    }

    isEnabled(): boolean {
        return true;
    }

    reset(): void {
        // do nothing
    }

    async interact(): Promise<void> {
        // do nothing
    }
}
