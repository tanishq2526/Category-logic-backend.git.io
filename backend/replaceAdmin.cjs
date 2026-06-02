const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // replace import { protect, admin } from '../middleware/authMiddleware.js';
      // with import { protect, requireAuth } from '../middleware/authMiddleware.js';
      if (content.includes('admin') && content.includes('../middleware/authMiddleware.js')) {
        content = content.replace(/import\s*\{\s*protect\s*,\s*admin\s*\}\s*from\s*['"]\.\.\/middleware\/authMiddleware\.js['"];/g, "import { protect, requireAuth } from '../middleware/authMiddleware.js';");
        content = content.replace(/,\s*admin\s*,/g, ", requireAuth('admin'),");
        content = content.replace(/\(\s*protect\s*,\s*admin\s*,/g, "(protect, requireAuth('admin'),");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'routes'));
