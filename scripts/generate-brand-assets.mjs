import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  vectorize,
  ColorMode,
  Hierarchical,
  PathSimplifyMode,
} from "@neplex/vectorizer";
import sharp from "sharp";

const INPUT = path.resolve("public/logo.png");
const OUTPUT_DIR = path.resolve("public/brand");

const DARK = [21, 25, 36];
const ORANGE = [199, 122, 8];

const CANVAS_SIZE = 4096;
const LOGO_WIDTH_RATIO = 0.64;

const VECTOR_CONFIG = {
  colorMode: ColorMode.Binary,
  hierarchical: Hierarchical.Stacked,
  filterSpeckle: 20,
  colorPrecision: 6,
  layerDifference: 5,
  mode: PathSimplifyMode.Spline,
  cornerThreshold: 90,
  lengthThreshold: 8,
  maxIterations: 10,
  spliceThreshold: 60,
  pathPrecision: 5,
};

function createMasks(data, width, height) {
  const darkMask = Buffer.alloc(width * height * 4);
  const orangeMask = Buffer.alloc(width * height * 4);

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];

    const isTransparent = alpha < 128;
    const isWhite = red > 230 && green > 230 && blue > 230;

    const distanceToDark =
      (red - DARK[0]) ** 2 + (green - DARK[1]) ** 2 + (blue - DARK[2]) ** 2;
    const distanceToOrange =
      (red - ORANGE[0]) ** 2 + (green - ORANGE[1]) ** 2 + (blue - ORANGE[2]) ** 2;

    const isDark =
      !isTransparent && !isWhite && distanceToDark <= distanceToOrange;
    const isOrange = !isTransparent && !isWhite && !isDark;

    darkMask[index] = isDark ? 0 : 255;
    darkMask[index + 1] = isDark ? 0 : 255;
    darkMask[index + 2] = isDark ? 0 : 255;
    darkMask[index + 3] = 255;

    orangeMask[index] = isOrange ? 0 : 255;
    orangeMask[index + 1] = isOrange ? 0 : 255;
    orangeMask[index + 2] = isOrange ? 0 : 255;
    orangeMask[index + 3] = 255;
  }

  return { darkMask, orangeMask };
}

function extractPaths(svg) {
  return svg.match(/<path[^>]*\/>/g) ?? [];
}

function recolorPath(pathTag, fill) {
  return pathTag.replace('fill="#000000"', `fill="${fill}"`);
}

function buildLogoSvg({
  width,
  height,
  darkPath,
  orangePaths,
  darkFill,
  orangeFill,
  background,
  canvasSize,
  logoWidthRatio,
}) {
  const scale = (canvasSize * logoWidthRatio) / width;
  const logoWidth = width * scale;
  const logoHeight = height * scale;
  const translateX = (canvasSize - logoWidth) / 2;
  const translateY = (canvasSize - logoHeight) / 2;

  const backgroundRect = background
    ? `<rect width="${canvasSize}" height="${canvasSize}" fill="${background}" />`
    : "";

  const paths = [
    recolorPath(darkPath, darkFill),
    ...orangePaths.map((path) => recolorPath(path, orangeFill)),
  ].join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">${backgroundRect}<g transform="translate(${translateX} ${translateY}) scale(${scale})">${paths}</g></svg>`;
}

async function renderPngToFile(svg, filePath) {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(filePath);
  return filePath;
}

async function renderPng(svg, filename) {
  return renderPngToFile(svg, path.join(OUTPUT_DIR, filename));
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const source = await readFile(INPUT);
  const { data, info } = await sharp(source)
    .trim({ threshold: 10 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { darkMask, orangeMask } = createMasks(data, info.width, info.height);
  const raw = { width: info.width, height: info.height, channels: 4 };

  const darkMaskPng = await sharp(darkMask, { raw })
    .median(3)
    .png()
    .toBuffer();
  const orangeMaskPng = await sharp(orangeMask, { raw })
    .median(3)
    .png()
    .toBuffer();

  const darkSvg = await vectorize(darkMaskPng, VECTOR_CONFIG);
  const orangeSvg = await vectorize(orangeMaskPng, VECTOR_CONFIG);

  const darkPaths = extractPaths(darkSvg);
  const orangePaths = extractPaths(orangeSvg);

  const darkPath = darkPaths.reduce((largest, path) =>
    path.length > largest.length ? path : largest
  );

  const tightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}">${recolorPath(darkPath, "#151924")}${orangePaths.map((path) => recolorPath(path, "#C77A08")).join("")}</svg>`;
  await writeFile(path.join(OUTPUT_DIR, "madfix-logo.svg"), tightSvg);

  const whiteSvg = buildLogoSvg({
    width: info.width,
    height: info.height,
    darkPath,
    orangePaths,
    darkFill: "#151924",
    orangeFill: "#C77A08",
    background: "#FFFFFF",
    canvasSize: CANVAS_SIZE,
    logoWidthRatio: LOGO_WIDTH_RATIO,
  });

  const blackSvg = buildLogoSvg({
    width: info.width,
    height: info.height,
    darkPath,
    orangePaths,
    darkFill: "#FFFFFF",
    orangeFill: "#C77A08",
    background: "#000000",
    canvasSize: CANVAS_SIZE,
    logoWidthRatio: LOGO_WIDTH_RATIO,
  });

  const whiteFile = await renderPng(whiteSvg, "madfix-logo-white-4096.png");
  const blackFile = await renderPng(blackSvg, "madfix-logo-black-4096.png");

  const createIconSvg = (size) =>
    buildLogoSvg({
      width: info.width,
      height: info.height,
      darkPath,
      orangePaths,
      darkFill: "#151924",
      orangeFill: "#C77A08",
      background: "#FFF9F5",
      canvasSize: size,
      logoWidthRatio: 0.64,
    });

  await renderPngToFile(
    createIconSvg(512),
    path.resolve("public/icon.png")
  );
  await renderPngToFile(
    createIconSvg(192),
    path.resolve("public/icon-192.png")
  );
  await renderPngToFile(
    createIconSvg(180),
    path.resolve("public/apple-icon.png")
  );
  await renderPngToFile(
    createIconSvg(512),
    path.resolve("src/app/icon.png")
  );

  for (const filePath of [whiteFile, blackFile]) {
    const metadata = await sharp(filePath).metadata();
    const fileStat = await stat(filePath);
    console.log(
      `${path.basename(filePath)} -> ${metadata.width}x${metadata.height} (${(
        fileStat.size / 1024
      ).toFixed(1)} KB)`
    );
  }

  console.log("madfix-logo.svg -> vector source");
  console.log("public/icon.png -> 512x512");
  console.log("public/icon-192.png -> 192x192");
  console.log("public/apple-icon.png -> 180x180");
  console.log("src/app/icon.png -> 512x512");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
