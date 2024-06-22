import test from "tape";
import { hexToHsl, hslToHex, createHslPalette } from "./helpers.js";

test("Convert an array of hex colors to HSL", function (t) {
  const hexColors = ["#FF0000", "#00FF00", "#0000FF"];
  const hslColors = hexColors.map(hexToHsl);

  t.deepEqual(hslColors, [
    { h: 0, s: 100, l: 50 },
    { h: 120, s: 100, l: 50 },
    { h: 240, s: 100, l: 50 },
  ]);

  t.end();
});

test("Convert an array of HSL colors to hex", function (t) {
  const hslColors = [
    { h: 0, s: 100, l: 50 },
    { h: 120, s: 100, l: 50 },
    { h: 240, s: 100, l: 50 },
  ];
  const hexColors = hslColors.map((color) =>
    hslToHex(color.h, color.s, color.l)
  );

  t.deepEqual(hexColors, ["#FF0000", "#00FF00", "#0000FF"]);

  t.end();
});

test("Create a palette of HSL colors", function (t) {
  const primary = { h: 0, s: 100, l: 50 };
  const palette = createHslPalette(primary);

  t.deepEqual(palette, [
    { h: 0, s: 100, l: 0 },
    { h: 0, s: 100, l: 10 },
    { h: 0, s: 100, l: 20 },
    { h: 0, s: 100, l: 30 },
    { h: 0, s: 100, l: 40 },
    { h: 0, s: 100, l: 50 },
    { h: 0, s: 100, l: 60 },
    { h: 0, s: 100, l: 70 },
    { h: 0, s: 100, l: 80 },
    { h: 0, s: 100, l: 90 },
    { h: 0, s: 100, l: 100 },
  ]);

  t.end();
});

test("Create a palette of HSL colors and convert it back to hex", function (t) {
  const primary = { h: 0, s: 100, l: 50 };
  const palette = createHslPalette(primary);
  const hexPalette = palette.map((color) =>
    hslToHex(color.h, color.s, color.l)
  );

  t.deepEqual(hexPalette, [
    "#000000",
    "#330000",
    "#660000",
    "#990000",
    "#CC0000",
    "#FF0000",
    "#FF3333",
    "#FF6666",
    "#FF9999",
    "#FFCCCC",
    "#FFFFFF",
  ]);

  t.end();
});
