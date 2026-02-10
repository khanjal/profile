const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '..', 'dist', 'profile-site', 'browser');
const indexPath = path.join(browserDir, 'index.html');
const csrPath = path.join(browserDir, 'index.csr.html');

if (fs.existsSync(indexPath)) {
  console.log('index.html already exists, nothing to do.');
  process.exit(0);
}

if (!fs.existsSync(csrPath)) {
  console.error('index.csr.html not found, cannot create index.html.');
  process.exit(1);
}

fs.copyFileSync(csrPath, indexPath);
console.log('Copied index.csr.html to index.html for static hosting.');
