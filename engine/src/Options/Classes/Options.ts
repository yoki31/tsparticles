import { deepExtend, loadParticlesOptions } from "../../Utils/Utils";
import { Background } from "./Background/Background";
import { BackgroundMask } from "./BackgroundMask/BackgroundMask";
import type { Engine } from "../../engine";
import { FullScreen } from "./FullScreen/FullScreen";
import type { IOptionLoader } from "../Interfaces/IOptionLoader";
import type { IOptions } from "../Interfaces/IOptions";
import { Interactivity } from "./Interactivity/Interactivity";
import { ManualParticle } from "./ManualParticle";
import { Motion } from "./Motion/Motion";
import type { RangeValue } from "../../Types/RangeValue";
import type { RecursivePartial } from "../../Types/RecursivePartial";
import { Responsive } from "./Responsive";
import { ResponsiveMode } from "../../Enums/Modes/ResponsiveMode";
import type { SingleOrMultiple } from "../../Types/SingleOrMultiple";
import { Theme } from "./Theme/Theme";
import { ThemeMode } from "../../Enums/Modes/ThemeMode";

/**
 * [[include:Options.md]]
 * @category Options
 */
export class Options implements IOptions, IOptionLoader<IOptions> {
    readonly #engine;

    /**
     * @deprecated this property is obsolete, please use the new fpsLimit
     */
    get fps_limit(): number {
        return this.fpsLimit;
    }

    /**
     *
     * @deprecated this property is obsolete, please use the new fpsLimit
     * @param value
     */
    set fps_limit(value: number) {
        this.fpsLimit = value;
    }

    /**
     * @deprecated this property is obsolete, please use the new retinaDetect
     */
    get retina_detect(): boolean {
        return this.detectRetina;
    }

    /**
     * @deprecated this property is obsolete, please use the new retinaDetect
     * @param value
     */
    set retina_detect(value: boolean) {
        this.detectRetina = value;
    }

    /**
     * @deprecated this property is obsolete, please use the new fullScreen
     */
    get backgroundMode(): FullScreen {
        return this.fullScreen;
    }

    /**
     * @deprecated this property is obsolete, please use the new fullScreen
     * @param value
     */
    set backgroundMode(value: FullScreen) {
        this.fullScreen.load(value);
    }

    autoPlay;
    background;
    backgroundMask;
    detectRetina;
    duration: RangeValue;
    fpsLimit;
    fullScreen;
    interactivity;
    manualParticles: ManualParticle[];
    motion;
    particles;
    pauseOnBlur;
    pauseOnOutsideViewport;
    preset?: SingleOrMultiple<string>;
    style: RecursivePartial<CSSStyleDeclaration>;
    responsive: Responsive[];
    themes: Theme[];
    zLayers;
    defaultDarkTheme?: string;
    defaultLightTheme?: string;

    [name: string]: unknown;

    constructor(engine: Engine) {
        this.#engine = engine;
        this.autoPlay = true;
        this.background = new Background();
        this.backgroundMask = new BackgroundMask();
        this.fullScreen = new FullScreen();
        this.detectRetina = true;
        this.duration = 0;
        this.fpsLimit = 120;
        this.interactivity = new Interactivity();
        this.manualParticles = [];
        this.motion = new Motion();
        this.particles = loadParticlesOptions();
        this.pauseOnBlur = true;
        this.pauseOnOutsideViewport = true;
        this.responsive = [];
        this.style = {};
        this.themes = [];
        this.zLayers = 100;
    }

    /**
     * This methods loads the source object in the current instance
     * @param data the source data to load into the instance
     */
    load(data?: RecursivePartial<IOptions>): void {
        if (!data) {
            return;
        }

        if (data.preset !== undefined) {
            if (data.preset instanceof Array) {
                for (const preset of data.preset) {
                    this.importPreset(preset);
                }
            } else {
                this.importPreset(data.preset);
            }
        }

        if (data.autoPlay !== undefined) {
            this.autoPlay = data.autoPlay;
        }

        const detectRetina = data.detectRetina ?? data.retina_detect;

        if (detectRetina !== undefined) {
            this.detectRetina = detectRetina;
        }

        if (data.duration !== undefined) {
            this.duration = data.duration;
        }

        const fpsLimit = data.fpsLimit ?? data.fps_limit;

        if (fpsLimit !== undefined) {
            this.fpsLimit = fpsLimit;
        }

        if (data.pauseOnBlur !== undefined) {
            this.pauseOnBlur = data.pauseOnBlur;
        }

        if (data.pauseOnOutsideViewport !== undefined) {
            this.pauseOnOutsideViewport = data.pauseOnOutsideViewport;
        }

        if (data.zLayers !== undefined) {
            this.zLayers = data.zLayers;
        }

        this.background.load(data.background);

        const fullScreen = data.fullScreen ?? data.backgroundMode;

        if (typeof fullScreen === "boolean") {
            this.fullScreen.enable = fullScreen;
        } else {
            this.fullScreen.load(fullScreen);
        }

        this.backgroundMask.load(data.backgroundMask);
        this.interactivity.load(data.interactivity);

        if (data.manualParticles !== undefined) {
            this.manualParticles = data.manualParticles.map((t) => {
                const tmp = new ManualParticle();

                tmp.load(t);

                return tmp;
            });
        }

        this.motion.load(data.motion);
        this.particles.load(data.particles);

        this.style = deepExtend(this.style, data.style) as RecursivePartial<CSSStyleDeclaration>;

        this.#engine.plugins.loadOptions(this, data);

        if (data.responsive !== undefined) {
            for (const responsive of data.responsive) {
                const optResponsive = new Responsive();

                optResponsive.load(responsive);

                this.responsive.push(optResponsive);
            }
        }

        this.responsive.sort((a, b) => a.maxWidth - b.maxWidth);

        if (data.themes !== undefined) {
            for (const theme of data.themes) {
                const optTheme = new Theme();
                optTheme.load(theme);
                this.themes.push(optTheme);
            }
        }

        this.defaultDarkTheme = this.#findDefaultTheme(ThemeMode.dark)?.name;
        this.defaultLightTheme = this.#findDefaultTheme(ThemeMode.light)?.name;
    }

    setTheme(name?: string): void {
        if (name) {
            const chosenTheme = this.themes.find((theme) => theme.name === name);

            if (chosenTheme) {
                this.load(chosenTheme.options);
            }
        } else {
            const mediaMatch = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)"),
                clientDarkMode = mediaMatch && mediaMatch.matches,
                defaultTheme = this.#findDefaultTheme(clientDarkMode ? ThemeMode.dark : ThemeMode.light);

            if (defaultTheme) {
                this.load(defaultTheme.options);
            }
        }
    }

    setResponsive(width: number, pxRatio: number, defaultOptions: IOptions): number | undefined {
        this.load(defaultOptions);

        const responsiveOptions = this.responsive.find((t) =>
            t.mode === ResponsiveMode.screen && screen
                ? t.maxWidth * pxRatio > screen.availWidth
                : t.maxWidth * pxRatio > width
        );

        this.load(responsiveOptions?.options);

        return responsiveOptions?.maxWidth;
    }

    private importPreset(preset: string): void {
        this.load(this.#engine.plugins.getPreset(preset));
    }

    #findDefaultTheme(mode: ThemeMode): Theme | undefined {
        return (
            this.themes.find((theme) => theme.default.value && theme.default.mode === mode) ??
            this.themes.find((theme) => theme.default.value && theme.default.mode === ThemeMode.any)
        );
    }
}
