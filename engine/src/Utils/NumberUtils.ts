import { IPositionFromSizeParams, IRangedPositionFromSizeParams } from "../Core/Interfaces/IPositionFromSizeParams";
import { MoveDirection, MoveDirectionAlt } from "../Enums/Directions/MoveDirection";
import { EasingType } from "../Enums/Types/EasingType";
import type { ICoordinates } from "../Core/Interfaces/ICoordinates";
import type { IValueWithRandom } from "../Options/Interfaces/IValueWithRandom";
import type { RangeValue } from "../Types/RangeValue";
import { Vector } from "../Core/Utils/Vector";

/**
 * Clamps a number between a minimum and maximum value
 * @param num the source number
 * @param min the minimum value
 * @param max the maximum value
 */
export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

/**
 *
 * @param comp1
 * @param comp2
 * @param weight1
 * @param weight2
 */
export function mix(comp1: number, comp2: number, weight1: number, weight2: number): number {
    return Math.floor((comp1 * weight1 + comp2 * weight2) / (weight1 + weight2));
}

export function randomInRange(r: RangeValue): number {
    const max = getRangeMax(r);
    let min = getRangeMin(r);

    if (max === min) {
        min = 0;
    }

    return Math.random() * (max - min) + min;
}

export function getRangeValue(value: RangeValue): number {
    return typeof value === "number" ? value : randomInRange(value);
}

export function getRangeMin(value: RangeValue): number {
    return typeof value === "number" ? value : value.min;
}

export function getRangeMax(value: RangeValue): number {
    return typeof value === "number" ? value : value.max;
}

export function setRangeValue(source: RangeValue, value?: number): RangeValue {
    if (source === value || (value === undefined && typeof source === "number")) {
        return source;
    }

    const min = getRangeMin(source),
        max = getRangeMax(source);

    return value !== undefined
        ? {
              min: Math.min(min, value),
              max: Math.max(max, value),
          }
        : setRangeValue(min, max);
}

export function getValue(options: IValueWithRandom): number {
    const random = options.random,
        { enable, minimumValue } =
            typeof random === "boolean"
                ? {
                      enable: random,
                      minimumValue: 0,
                  }
                : random;

    return enable ? getRangeValue(setRangeValue(options.value, minimumValue)) : getRangeValue(options.value);
}

/**
 * Gets the distance between two coordinates
 * @param pointA the first coordinate
 * @param pointB the second coordinate
 */
export function getDistances(pointA: ICoordinates, pointB: ICoordinates): { dx: number; dy: number; distance: number } {
    const dx = pointA.x - pointB.x,
        dy = pointA.y - pointB.y;

    return { dx: dx, dy: dy, distance: Math.sqrt(dx * dx + dy * dy) };
}

/**
 * Gets the distance between two coordinates
 * @param pointA the first coordinate
 * @param pointB the second coordinate
 */
export function getDistance(pointA: ICoordinates, pointB: ICoordinates): number {
    return getDistances(pointA, pointB).distance;
}

export function getParticleDirectionAngle(
    direction: MoveDirection | keyof typeof MoveDirection | MoveDirectionAlt | number,
    position: ICoordinates,
    center: ICoordinates
): number {
    if (typeof direction === "number") {
        return (direction * Math.PI) / 180;
    } else {
        switch (direction) {
            case MoveDirection.top:
                return -Math.PI / 2;
            case MoveDirection.topRight:
                return -Math.PI / 4;
            case MoveDirection.right:
                return 0;
            case MoveDirection.bottomRight:
                return Math.PI / 4;
            case MoveDirection.bottom:
                return Math.PI / 2;
            case MoveDirection.bottomLeft:
                return (3 * Math.PI) / 4;
            case MoveDirection.left:
                return Math.PI;
            case MoveDirection.topLeft:
                return (-3 * Math.PI) / 4;
            case MoveDirection.inside:
                return Math.atan2(center.y - position.y, center.x - position.x);
            case MoveDirection.outside:
                return Math.atan2(position.y - center.y, position.x - center.x);
            case MoveDirection.none:
            default:
                return Math.random() * Math.PI * 2;
        }
    }
}

/**
 * Get Particle base velocity
 * @param direction the direction to use for calculating the velocity
 */
export function getParticleBaseVelocity(direction: number): Vector {
    const baseVelocity = Vector.origin;

    baseVelocity.length = 1;
    baseVelocity.angle = direction;

    return baseVelocity;
}

export function collisionVelocity(v1: Vector, v2: Vector, m1: number, m2: number): Vector {
    return Vector.create((v1.x * (m1 - m2)) / (m1 + m2) + (v2.x * 2 * m2) / (m1 + m2), v1.y);
}

export function calcEasing(value: number, type: EasingType): number {
    switch (type) {
        case EasingType.easeOutQuad:
            return 1 - (1 - value) ** 2;
        case EasingType.easeOutCubic:
            return 1 - (1 - value) ** 3;
        case EasingType.easeOutQuart:
            return 1 - (1 - value) ** 4;
        case EasingType.easeOutQuint:
            return 1 - (1 - value) ** 5;
        case EasingType.easeOutExpo:
            return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
        case EasingType.easeOutSine:
            return Math.sin((value * Math.PI) / 2);
        case EasingType.easeOutBack: {
            const c1 = 1.70158,
                c3 = c1 + 1;

            return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
        }
        case EasingType.easeOutCirc:
            return Math.sqrt(1 - Math.pow(value - 1, 2));
        default:
            return value;
    }
}

/**
 * Gets exact position from percent position based on the given size
 * @param data the data to use for calculating the position
 * @returns the exact position
 */
export function calcPositionFromSize(data: IPositionFromSizeParams): ICoordinates | undefined {
    return data.position?.x !== undefined && data.position?.y !== undefined
        ? {
              x: (data.position.x * data.size.width) / 100,
              y: (data.position.y * data.size.height) / 100,
          }
        : undefined;
}

/**
 * Gets exact position from percent position, or a random one if not specified, based on the given size
 * @param data the data to use for calculating the position
 * @returns the exact position
 */
export function calcPositionOrRandomFromSize(data: IPositionFromSizeParams): ICoordinates {
    return {
        x: ((data.position?.x ?? Math.random() * 100) * data.size.width) / 100,
        y: ((data.position?.y ?? Math.random() * 100) * data.size.height) / 100,
    };
}

/**
 * Gets exact position from percent position, or a random one if not specified, based on the given size
 * @param data the data to use for calculating the position
 * @returns the exact position
 */
export function calcPositionOrRandomFromSizeRanged(data: IRangedPositionFromSizeParams): ICoordinates {
    const position = {
        x: data.position?.x !== undefined ? getRangeValue(data.position.x) : undefined,
        y: data.position?.y !== undefined ? getRangeValue(data.position.y) : undefined,
    };

    return calcPositionOrRandomFromSize({ size: data.size, position });
}

/**
 * Gets exact position from exact position, or a random one if not specified, based on the given size
 * @param data the data to use for calculating the position
 * @returns the exact position
 */
export function calcExactPositionOrRandomFromSize(data: IPositionFromSizeParams): ICoordinates {
    return {
        x: data.position?.x ?? Math.random() * data.size.width,
        y: data.position?.y ?? Math.random() * data.size.height,
    };
}

/**
 * Gets exact position from exact position, or a random one if not specified, based on the given size
 * @param data the data to use for calculating the position
 * @returns the exact position
 */
export function calcExactPositionOrRandomFromSizeRanged(data: IRangedPositionFromSizeParams): ICoordinates {
    const position = {
        x: data.position?.x !== undefined ? getRangeValue(data.position.x) : undefined,
        y: data.position?.y !== undefined ? getRangeValue(data.position.y) : undefined,
    };

    return calcExactPositionOrRandomFromSize({ size: data.size, position });
}
