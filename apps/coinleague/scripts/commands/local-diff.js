const fs = require('fs');
const commander = require('commander');

function addslashes(str = '') {
  console.log(str);

  return str
    .replace(/\\/g, '\\\\')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function jsonDiff(fromLang, toLang) {
  const keys = [];

  for (const key of Object.keys(fromLang)) {
    console.log(key);
    if (!toLang[key]) {
      keys.push(key);
    }
  }

  return keys;
}

const program = new commander.Command();

program.version('0.0.1').option('-t, --to <string>', 'to language');

program.parse(process.argv);

const options = program.opts();
console.log(options);

if (options.to) {
  const fromFile = JSON.parse(fs.readFileSync(`lang/main.json`).toString());

  const toFile = JSON.parse(
    fs.readFileSync(`lang/${options.to}.json`).toString()
  );

  const diff = jsonDiff(fromFile, toFile);

  const bufferArr = {};

  for (const key of diff) {
    bufferArr[key] = fromFile[key];
  }

  for (const key of Object.keys(toFile)) {
    bufferArr[key] = toFile[key];
  }
  // We sort here the keys
  const orderedKeys = Object.keys(bufferArr).sort(function (a, b) {
    return ('' + a.attr).localeCompare(b.attr);
  });

  const finalArr = {};

  for (const key of orderedKeys) {
    finalArr[key] = bufferArr[key];
  }

  fs.writeFileSync(
    `lang/${options.to}.json`,
    JSON.stringify(finalArr, null, '\t')
  );
}
