import fs from "node:fs";
import { PNG } from "pngjs";
import { RendererUtils } from "./utils";

function render(qrData, options) {
  const opts = RendererUtils.getOptions(options);
  const pngOpts = opts.rendererOpts;
  const size = RendererUtils.getImageWidth(qrData.modules.size, opts);

  pngOpts.width = size;
  pngOpts.height = size;

  const pngImage = new PNG(pngOpts);
  RendererUtils.qrToImageData(pngImage.data, qrData, opts);

  return pngImage;
}

function renderToDataURL(qrData, options, cb) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  renderToBuffer(qrData, options, (err, output) => {
    if (err) cb(err);
    let url = "data:image/png;base64,";
    url += output.toString("base64");
    cb(null, url);
  });
}

function renderToBuffer(qrData, options, cb) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  const png = render(qrData, options);
  const buffer = [];

  png.on("error", cb);

  png.on("data", (data) => {
    buffer.push(data);
  });

  png.on("end", () => {
    cb(null, Buffer.concat(buffer));
  });

  png.pack();
}

function renderToFile(path, qrData, options, cb) {
  if (typeof cb === "undefined") {
    cb = options;
    options = undefined;
  }

  let called = false;
  const done = (...args) => {
    if (called) return;
    called = true;
    cb.apply(null, args);
  };
  const stream = fs.createWriteStream(path);

  stream.on("error", done);
  stream.on("close", done);

  renderToFileStream(stream, qrData, options);
}

function renderToFileStream(stream, qrData, options) {
  const png = render(qrData, options);
  png.pack().pipe(stream);
}

export const RendererPng = {
  render,
  renderToBuffer,
  renderToFile,
  renderToFileStream,
  renderToDataURL,
};
