// From https://github.com/miracsengonul/json-translate-ai/blob/main/translate.js

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv = yargs
  .option('target', {
    alias: 't',
    describe: 'Target Language',
    default: 'fr-FR',
  })
  .option('key', {
    alias: 'k',
    describe: 'OpenAI API Key',
    default: '',
  }).argv;

if (!argv.key) {
  console.error(
    'OpenAI API Key is required. Please use --key or -k parameter.',
  );
  return;
}

const sourceLanguage = 'en-US';
const targetLanguage = argv.target;
const OPENAI_API_KEY = argv.key;

const currentWorkingDirectory = process.cwd();

const sourceFile = path.join(
  currentWorkingDirectory,
  `/compiled-lang/${sourceLanguage}.json`,
);
const targetFile = path.join(
  currentWorkingDirectory,
  `/compiled-lang/${targetLanguage}.json`,
);

let targetData = {};
if (fs.existsSync(targetFile)) {
  targetData = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
}

const jsonData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
const allLangKeys = Object.keys(jsonData);
async function main() {
  let reachedEndOfFile = false;

  while (!reachedEndOfFile) {
    let translatingKeyEnd = 0;
    const fileToTranslate = [];
    const keysOfTranslatedFile = [];
    let totalToTranslate = 0;
    const totalKeys = Object.keys(jsonData).length;
    for (let index = 0; index < totalKeys; index++) {
      const langKey = allLangKeys[index];
      const elementToTranslate = targetData[langKey];
      const sourceElement = jsonData[langKey];
      // if they are equal we need to translate it
      if (elementToTranslate === sourceElement) {
        if (totalToTranslate < 50) {
          fileToTranslate.push(elementToTranslate);
          // We just save the key of this element that needs to be translated
          keysOfTranslatedFile.push(langKey);
          translatingKeyEnd = index;
          reachedEndOfFile = totalKeys === index + 1;
        }
        totalToTranslate++;
      }
    }
    console.log(`Translating till key index ${translatingKeyEnd}/${totalKeys}`);

    const translateObject = async (data) => {
      if (data.length === 0) {
        throw new Error('no data to translate');
      }

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You will convert the provided json array to language ${targetLanguage}. Return json object with key called translated with the array of translated values. Don't touch on values inside {}, they are variables`,
            },
            {
              role: 'user',
              content: JSON.stringify(data, null, 2),
            },
          ],
        }),
      };

      const chatGPTResults = await fetch(
        'https://api.openai.com/v1/chat/completions',
        options,
      ).then((res) => res.json());

      return chatGPTResults.choices[0].message.content;
    };

    const translatedObject = await translateObject(fileToTranslate);

    let arrayOfTranslatedData = [];
    const translatedData = JSON.parse(translatedObject);
    console.log(translatedData);
    const keys = Object.keys(translatedData);
    if (keys.length === 1) {
      arrayOfTranslatedData = translatedData[keys[0]];

      if (arrayOfTranslatedData.length !== fileToTranslate.length) {
        throw Error('translated object not matches');
      }
    } else {
      throw Error('malformated response');
    }

    for (let index = 0; index < keysOfTranslatedFile.length; index++) {
      const translatedElement = arrayOfTranslatedData[index];
      targetData[keysOfTranslatedFile[index]] = translatedElement;
    }

    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf-8');
  }
}

main()
  .then(console.log)
  .catch((error) => {
    console.error('Error:', error);
  });
