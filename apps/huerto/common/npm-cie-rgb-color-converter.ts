/**
 * This comes from https://github.com/Shnoo/js-CIE-1931-rgb-color-converter
 * which is somehow on npm without a package.json …
 */

import { objectKeys } from '@chakra-ui/utils';

type Gamut = {
  red: XYVector;
  green: XYVector;
  blue: XYVector;
};
type XYVector = [number, number];
type XYRecord = { x: number; y: number };
type XYInput = XYVector | XYRecord;

const allGamutRanges = {
  gamutA: {
    red: [0.704, 0.296],
    green: [0.2151, 0.7106],
    blue: [0.138, 0.08],
  },
  gamutB: {
    red: [0.675, 0.322],
    green: [0.409, 0.518],
    blue: [0.167, 0.04],
  },
  gamutC: {
    red: [0.692, 0.308],
    green: [0.17, 0.7],
    blue: [0.153, 0.048],
  },
  default: {
    red: [1.0, 0],
    green: [0.0, 1.0],
    blue: [0.0, 0.0],
  },
} as const;

type PhilipsModel = keyof typeof philipsModels;
const philipsModels = {
  LST001: allGamutRanges.gamutA,
  LLC010: allGamutRanges.gamutA,
  LLC011: allGamutRanges.gamutA,
  LLC012: allGamutRanges.gamutA,
  LLC006: allGamutRanges.gamutA,
  LLC005: allGamutRanges.gamutA,
  LLC007: allGamutRanges.gamutA,
  LLC014: allGamutRanges.gamutA,
  LLC013: allGamutRanges.gamutA,

  LCT001: allGamutRanges.gamutB,
  LCT007: allGamutRanges.gamutB,
  LCT002: allGamutRanges.gamutB,
  LCT003: allGamutRanges.gamutB,
  LLM001: allGamutRanges.gamutB,

  LCT010: allGamutRanges.gamutC,
  LCT014: allGamutRanges.gamutC,
  LCT015: allGamutRanges.gamutC,
  LCT016: allGamutRanges.gamutC,
  LCT011: allGamutRanges.gamutC,
  LLC020: allGamutRanges.gamutC,
  LST002: allGamutRanges.gamutC,
  LCT012: allGamutRanges.gamutC,
} as const;

export class ColorConverter {
  static getGamutRanges() {
    return allGamutRanges;
  }

  static getLightColorGamutRange(modelId?: PhilipsModel | string): Gamut {
    // @ts-expect-error: readonly const values causing problems …
    return philipsModels[modelId as PhilipsModel] ?? allGamutRanges.default;
  }

  static rgbToXy(
    red: number,
    green: number,
    blue: number,
    modelId?: PhilipsModel,
  ) {
    function getGammaCorrectedValue(value: number) {
      return value > 0.04045
        ? Math.pow((value + 0.055) / (1.0 + 0.055), 2.4)
        : value / 12.92;
    }

    let colorGamut = ColorConverter.getLightColorGamutRange(modelId);

    // @ts-expect-error: this is not the way
    red = parseFloat(red / 255);
    // @ts-expect-error: this is not the way
    green = parseFloat(green / 255);
    // @ts-expect-error: this is not the way
    blue = parseFloat(blue / 255);

    red = getGammaCorrectedValue(red);
    green = getGammaCorrectedValue(green);
    blue = getGammaCorrectedValue(blue);

    let x = red * 0.649926 + green * 0.103455 + blue * 0.197109;
    let y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
    let z = red * 0.0 + green * 0.053077 + blue * 1.035763;

    let xy = {
      x: x / (x + y + z),
      y: y / (x + y + z),
    };

    if (!ColorConverter.xyIsInGamutRange(xy, colorGamut)) {
      xy = ColorConverter.getClosestColor(xy, colorGamut);
    }

    return xy;
  }

  static xyIsInGamutRange(xy: XYInput, gamut: Gamut) {
    gamut = gamut || ColorConverter.getGamutRanges().gamutC;
    xy = xyRecordFor(xy);

    let v0 = [gamut.blue[0] - gamut.red[0], gamut.blue[1] - gamut.red[1]];
    let v1 = [gamut.green[0] - gamut.red[0], gamut.green[1] - gamut.red[1]];
    let v2 = [xy.x - gamut.red[0], xy.y - gamut.red[1]];

    let dot00 = v0[0] * v0[0] + v0[1] * v0[1];
    let dot01 = v0[0] * v1[0] + v0[1] * v1[1];
    let dot02 = v0[0] * v2[0] + v0[1] * v2[1];
    let dot11 = v1[0] * v1[0] + v1[1] * v1[1];
    let dot12 = v1[0] * v2[0] + v1[1] * v2[1];

    let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

    let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v < 1;
  }

  static getClosestColor(xy: XYInput, gamut: Gamut) {
    xy = xyRecordFor(xy);

    function getLineDistance(pointA: XYRecord, pointB: XYRecord) {
      return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
    }

    function getClosestPoint(xy: XYRecord, pointA: XYRecord, pointB: XYRecord) {
      let xy2a = [xy.x - pointA.x, xy.y - pointA.y];
      let a2b = [pointB.x - pointA.x, pointB.y - pointA.y];
      let a2bSqr = Math.pow(a2b[0], 2) + Math.pow(a2b[1], 2);
      let xy2a_dot_a2b = xy2a[0] * a2b[0] + xy2a[1] * a2b[1];
      let t = xy2a_dot_a2b / a2bSqr;

      return {
        x: pointA.x + a2b[0] * t,
        y: pointA.y + a2b[1] * t,
      };
    }

    let greenBlue = {
      a: {
        x: gamut.green[0],
        y: gamut.green[1],
      },
      b: {
        x: gamut.blue[0],
        y: gamut.blue[1],
      },
    };

    let greenRed = {
      a: {
        x: gamut.green[0],
        y: gamut.green[1],
      },
      b: {
        x: gamut.red[0],
        y: gamut.red[1],
      },
    };

    let blueRed = {
      a: {
        x: gamut.red[0],
        y: gamut.red[1],
      },
      b: {
        x: gamut.blue[0],
        y: gamut.blue[1],
      },
    };

    let closestColorPoints = {
      greenBlue: getClosestPoint(xy, greenBlue.a, greenBlue.b),
      greenRed: getClosestPoint(xy, greenRed.a, greenRed.b),
      blueRed: getClosestPoint(xy, blueRed.a, blueRed.b),
    };

    let distance = {
      greenBlue: getLineDistance(xy, closestColorPoints.greenBlue),
      greenRed: getLineDistance(xy, closestColorPoints.greenRed),
      blueRed: getLineDistance(xy, closestColorPoints.blueRed),
    };

    let closestDistance;
    let closestColor;
    for (let key of objectKeys(distance)) {
      if (distance.hasOwnProperty(key)) {
        if (!closestDistance) {
          closestDistance = distance[key];
          closestColor = key;
        }

        if (closestDistance > distance[key]) {
          closestDistance = distance[key];
          closestColor = key;
        }
      }
    }
    return closestColorPoints[closestColor ?? 'blueRed'];
  }

  static xyBriToRgb(x: number, y: number, bri: number) {
    function getReversedGammaCorrectedValue(value: number) {
      return value <= 0.0031308
        ? 12.92 * value
        : (1.0 + 0.055) * Math.pow(value, 1.0 / 2.4) - 0.055;
    }

    let xy = {
      x: x,
      y: y,
    };

    let z = 1.0 - xy.x - xy.y;
    let Y = bri / 255;
    let X = (Y / xy.y) * xy.x;
    let Z = (Y / xy.y) * z;
    let r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    let b = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

    r = getReversedGammaCorrectedValue(r);
    g = getReversedGammaCorrectedValue(g);
    b = getReversedGammaCorrectedValue(b);

    // this is not the way
    let red = r * 255 > 255 ? 255 : r * 255;
    // this is not the way
    let green = g * 255 > 255 ? 255 : g * 255;
    // this is not the way
    let blue = b * 255 > 255 ? 255 : b * 255;

    red = Math.abs(red);
    green = Math.abs(green);
    blue = Math.abs(blue);

    return { r: red, g: green, b: blue };
  }
}

function xyRecordFor(input: XYInput): XYRecord {
  return Array.isArray(input) ? { x: input[0], y: input[1] } : input;
}

const parseInt = (v: number) => v;
const parseFloat = (v: number) => v;
