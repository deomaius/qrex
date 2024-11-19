import type { QRCodeToStringOptionsTerminal as QRCodeOptions, QRCode } from "qrcode";
import type { ArbitaryFunction } from "../../core/utils.js";

export function render(qrData: QRCode, options: QRCodeOptions, cb: ArbitaryFunction): string {
  const size = qrData.modules.size;
  const data = qrData.modules.data;

  // use same scheme as https://github.com/gtanner/qrcode-terminal because it actually works! =)
  const black = "\x1b[40m  \x1b[0m";
  const white = "\x1b[47m  \x1b[0m";

  let output = "";
  const hMargin = Array(size + 3).join(white);
  const vMargin = Array(2).join(white);

  output += `${hMargin}
`;
  for (let i = 0; i < size; ++i) {
    output += white;
    for (let j = 0; j < size; j++) {
      // let topModule = data[i * size + j]
      // let bottomModule = data[(i + 1) * size + j]

      output += data[i * size + j] ? black : white; // getBlockChar(topModule, bottomModule)
    }
    // output += white+'\n'
    output += `${vMargin}
`;
  }

  output += `${hMargin}
`;

  if (typeof cb === "function") {
    cb(null, output);
  }

  return output;
}

export const Terminal = {
  render,
};
