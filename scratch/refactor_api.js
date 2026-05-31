const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../FE/src');
const configFile = path.resolve(srcDir, 'config.js');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('http://localhost:5000')) {
    return false;
  }
  
  // Calculate relative path to config.js
  let relPath = path.relative(path.dirname(filePath), configFile).replace(/\\/g, '/');
  if (!relPath.startsWith('.')) {
    relPath = './' + relPath;
  }
  // Strip '.js' extension
  if (relPath.endsWith('.js')) {
    relPath = relPath.substring(0, relPath.length - 3);
  }
  
  const importStmt = `import { API_URL } from "${relPath}";`;
  
  // Replace:
  // 1. "http://localhost:5000/api/xyz" -> `${API_URL}/api/xyz`
  content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`\${API_URL}$1`');
  // 2. 'http://localhost:5000/api/xyz' -> `${API_URL}/api/xyz`
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`\${API_URL}$1`');
  // 3. `http://localhost:5000/api/xyz` -> `${API_URL}/api/xyz`
  content = content.replace(/http:\/\/localhost:5000/g, '\${API_URL}');
  
  // Insert import statement after the last import line or at the top
  const lines = content.split('\n');
  let insertIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      insertIdx = i + 1;
    }
  }
  
  lines.splice(insertIdx, 0, importStmt);
  const newContent = lines.join('\n');
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Refactored: ${path.basename(filePath)}`);
  return true;
}

function traverse(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (stat.isFile() && item.endsWith('.jsx')) {
      refactorFile(fullPath);
    }
  }
}

traverse(srcDir);
