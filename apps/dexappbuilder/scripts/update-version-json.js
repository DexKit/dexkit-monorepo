import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Updating version from:', __dirname);

try {
  if (__dirname) {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const versionPath = path.join(__dirname, '..', 'src', 'constants', 'app-version.json');
    const versionDir = path.dirname(versionPath);
    
    // Ensure directory exists
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
    }

    fs.writeFileSync(
      versionPath,
      JSON.stringify({ version: pkg.version }, null, '\t'),
    );
    
    console.log('Version updated to:', pkg.version);
  }
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
