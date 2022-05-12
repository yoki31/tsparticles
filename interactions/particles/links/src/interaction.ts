import type { Engine } from "tsparticles-engine";
import { Linker } from "./Linker";

export async function loadInteraction(engine: Engine): Promise<void> {
    await engine.addInteractor("particlesLinks", (container) => new Linker(container));
}
