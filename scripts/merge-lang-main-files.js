const fs = require("fs");

const mainApp = JSON.parse(
  fs.readFileSync(`./apps/dexappbuilder/lang/main.json`)
);
const mainUI = JSON.parse(
  fs.readFileSync(`./packages/dexkit-ui/lang/main.json`)
);
const mainExchange = JSON.parse(
  fs.readFileSync(`./packages/dexkit-exchange/lang/main.json`)
);
const mainWidgets = JSON.parse(
  fs.readFileSync(`./packages/dexkit-widgets/lang/main.json`)
);

const mainUnlock = JSON.parse(
  fs.readFileSync(`./packages/dexkit-widgets/lang/main.json`)
);

const combinedMain = {
  ...mainApp,
  ...mainUI,
  ...mainExchange,
  ...mainWidgets,
  ...mainUnlock,
};

fs.writeFileSync(
  `./apps/dexappbuilder/lang/main.json`,
  JSON.stringify(combinedMain, null, 2),
  "utf-8"
);
