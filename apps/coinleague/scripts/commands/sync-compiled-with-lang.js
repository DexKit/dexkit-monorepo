// We are using AI to translate compiled files we should sync the files
const commander = require('commander');

const program = new commander.Command();

program.version('0.0.1').option('-t, --to <string>', 'language to sync');

program.parse(process.argv);

const options = program.opts();

if (options.to) {
  const to = options.to;

  const fromFile = JSON.parse(fs.readFileSync(`compiled-lang/${to}.json`));
  const toFile = JSON.parse(fs.readFileSync(`lang/${to}.json`));

  const allKeys = Object.keys(fromFile);

  for (let index = 0; index < allKeys.length; index++) {
    const key = allKeys[index];
    toFile[key].defaultMessage = fromFile[key];
  }

  fs.writeFileSync(`lang/${to}.json`, JSON.stringify(toFile, null, 2), 'utf-8');
}
