let imageData = null;
let IconPixles = [];
let pixle_size = 0;

const rgbaToRgb = (rgba) => {
  rgba[0] /= 255;
  rgba[1] /= 255;
  rgba[2] /= 255;
  rgba[3] /= 255;

  let res = [0, 0, 0];
  res[0] = (1 - rgba[3] + rgba[3] * rgba[0]) * 255;
  res[1] = (1 - rgba[3] + rgba[3] * rgba[1]) * 255;
  res[2] = (1 - rgba[3] + rgba[3] * rgba[2]) * 255;
  res[0] = Math.min(res[0], 255);
  res[1] = Math.min(res[1], 255);
  res[2] = Math.min(res[2], 255);

  return res;
};

const nearestPixle = (rgb) => {
  let mnDist = Infinity;
  let pixle = null;
  for (let i of IconPixles) {
    let res =
      (rgb[0] - i.rgb[0]) * (rgb[0] - i.rgb[0]) +
      (rgb[1] - i.rgb[1]) * (rgb[1] - i.rgb[1]) +
      (rgb[2] - i.rgb[2]) * (rgb[2] - i.rgb[2]);
    if (res < mnDist) {
      mnDist = res;
      pixle = i;
    }
  }

  return pixle;
};

const redraw = (row) => {
  if (row >= imageData.height) return;
  let resultImageDataArray = Array(
    imageData.width * pixle_size * pixle_size * 4
  ).fill(0);

  for (let i = 0; i < imageData.width * 4; i += 4) {
    let curpixRGB = rgbaToRgb([
      imageData.data[row * imageData.width * 4 + i],
      imageData.data[row * imageData.width * 4 + i + 1],
      imageData.data[row * imageData.width * 4 + i + 2],
      imageData.data[row * imageData.width * 4 + i + 3],
    ]);

    let nearest = nearestPixle(curpixRGB);
    let x = i / 4;

    for (let ii = 0; ii < pixle_size; ii++) {
      for (let jj = 0; jj < pixle_size; jj++) {
        let pos = (jj * imageData.width * pixle_size + x * pixle_size + ii) * 4;
        for (let k = 0; k < 4; k++) {
          resultImageDataArray[pos + k] =
            nearest.image.data[jj * pixle_size * 4 + ii * 4 + k];
        }
      }
    }
  }

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "process-image",
        resultImageDataArray: resultImageDataArray,
        width: imageData.width,
        height: imageData.height,
        row: row,
      });
      redraw(row + 1);
    });
  });
};

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "process-image") {

    imageData = event.data.imageData;
    IconPixles = event.data.IconPixles;
    pixle_size = event.data.pixle_size;

    redraw(0);
  }
});
