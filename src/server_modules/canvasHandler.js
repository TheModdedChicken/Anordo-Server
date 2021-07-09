const { createCanvas, loadImage } = require('canvas');

/**
 * 
 * @param {number} width 
 * @param {number} height 
 */
module.exports.newCanvas = (width, height) => {
  if (!width) width = 500;
  if (!height) height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  return ctx.getImageData(0, 0, width, height);
}