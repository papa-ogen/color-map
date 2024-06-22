/**
 * Converts a hex color string to an HSL color object.
 * @param hex - The hex color string (e.g., "#RRGGBB").
 * @returns An object with properties h, s, and l representing the HSL values.
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the maximum and minimum values of r, g, b
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate luminance
  const l = (max + min) / 2;

  let h: number = 0;
  let s: number = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert h, s, l to percentages and return
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts an HSL color to a hex color string.
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns The hex color string (e.g., "#RRGGBB").
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const hex = (r << 16) + (g << 8) + b;
  return "#" + hex.toString(16).padStart(6, "0").toUpperCase();
}

function createHslPalette(hsl: { h: number; s: number; l: number }) {
  const palette = [];
  for (let i = 0; i <= 10; i++) {
    palette.push({ h: hsl.h, s: hsl.s, l: i * 10 });
  }

  return palette;
}

figma.parameters.on("input", ({ query, result }: ParameterInputEvent) => {
  if (query === "") {
    result.setSuggestions([]);
  } else {
    result.setSuggestions([query]);
  }
});
figma.on("run", ({ parameters }: RunEvent) => {
  if (!parameters) {
    return;
  }
  startPluginWithParameters(parameters);

  figma.closePlugin();
});

async function startPluginWithParameters(parameters: ParameterValues) {
  if (!parameters) return;

  const { primary } = parameters;

  const palette = createHslPalette(hexToHsl(primary));
  const hexPalette = palette.map((color) =>
    hslToHex(color.h, color.s, color.l)
  );

  const frame = figma.createFrame();
  const solidPaint = figma.util.solidPaint;

  frame.name = "Color Palette";
  frame.resize(1600, 100);
  frame.backgrounds = [solidPaint("#E9E9E9")];
  frame.y = -200;

  figma.currentPage.appendChild(frame);

  for (let i = 0; i < hexPalette.length; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [solidPaint(hexPalette[i])];
    rect.name = `Color ${hexPalette[i]}`;

    frame.appendChild(rect);
  }

  // figma.viewport.scrollAndZoomIntoView(frame);
  figma.notify(`Palette created!`);
}
