function toHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) return new Error("Invalid hex color");

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
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

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);

  return { h, s, l };
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

  const numberOfRectangles = 5;
  const frame = figma.createFrame();
  const solidPaint = figma.util.solidPaint;

  // frame.name = "Color Palette";
  frame.name = "Color Palette " + JSON.stringify(toHSL(primary));
  frame.resize(800, 100);
  frame.backgrounds = [solidPaint("#E9E9E9")];
  frame.y = -200;

  figma.currentPage.appendChild(frame);

  for (let i = 0; i < numberOfRectangles; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [solidPaint(primary)];
    rect.name = `Color ${i + 1}`;

    frame.appendChild(rect);
  }

  // figma.viewport.scrollAndZoomIntoView(frame);
  figma.notify(`Created ${numberOfRectangles} rectangles`);
}
