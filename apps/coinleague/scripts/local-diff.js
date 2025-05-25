const fs = require('fs');

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
    if (!toLang[key]) {
      keys.push(key);
    }
  }

  return keys;
}

const languages = [
  'de-DE',
  'en-US',
  'es-ES',
  'fr-FR',
  'it-IT',
  'nn-NO',
  'pt-BR',
  'cs-CZ',
];

for (let index = 0; index < languages.length; index++) {
  to = languages[index];

  const fromFile = JSON.parse(fs.readFileSync(`lang/main.json`).toString());

  const toFile = JSON.parse(fs.readFileSync(`lang/${to}.json`).toString());

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

  fs.writeFileSync(`lang/${to}.json`, JSON.stringify(finalArr, null, '\t'));
}
