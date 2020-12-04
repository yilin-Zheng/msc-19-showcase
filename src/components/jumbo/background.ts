function getTextHeight(w) {
  if (w > 200) return w / 12;
  if (w > 150) return w / 6;
  if (w > 100) return w / 6;
  if (w > 0) return w / 6.5;
}

function createTextCanvas(w, h, text, fonts) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);
  let textHeight = getTextHeight(w);
  ctx.font = `800 ${textHeight}px ${fonts.title}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';

  const words = text.split(' ');
  const wordLen = (word) => ctx.measureText(word).width;

  // I'd rather not have functions in functions, but Gatsby seems to
  // freak out if you pass functions as arguments, i.e. wordLen
  function generateNewLine(newLine, unused, maxLen) {
    newLine.push(unused.shift());
    while (wordLen(newLine.join(' ') + ' ' + unused[0]) < maxLen) {
      newLine.push(unused.shift());
    }
  }

  function generateStringArray(final, unused, maxLen) {
    if (unused.length < 1) return final;
    else if (unused.length == 1) final.push(unused.pop());
    else if (unused.length >= 2) {
      let newLine = [];
      generateNewLine(newLine, unused, maxLen);
      final.push(newLine.join(' '));
    }
    generateStringArray(final, unused, maxLen);
  }

  let lines = [];
  generateStringArray(lines, words, w - 40);

  /* Recalculated line height based on line length */
  //const linesSortedByLength = lines.sort((a, b) => wordLen(b) - wordLen(a));
  //while(wordLen(linesSortedByLength[0]) < w - 20) {
  //ctx.font = textHeight++ + 'px sans-serif';
  //}
  const totalHeight = lines.length * textHeight;
  const yOffset = (h - totalHeight) / 2;

  for (let i = 0; i < lines.length; i++) {
    const lineYOffset = yOffset + i * textHeight;
    ctx.fillText(lines[i], w / 2, lineYOffset);
  }

  ctx.font = `800 1rem ${fonts.arrow}`;
  // ctx.fillText('↓', w * 0.5, h * 0.85);

  return ctx.canvas;
}

export { createTextCanvas };
