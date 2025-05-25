import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

if (__dirname) {
  const pkg = JSON.parse(
    fs.readFileSync(`${__dirname}/../package.json`).toString(),
  );

  fs.writeFileSync(
    `${__dirname}/../src/constants/app-version.json`,
    JSON.stringify({ version: pkg.version }, null, '\t'),
  );
}
