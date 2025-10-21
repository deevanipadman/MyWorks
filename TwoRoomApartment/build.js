const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'app.js')],
  bundle: true,
  minify: false,
  sourcemap: true,
  outfile: path.join(__dirname, 'dist', 'bundle.js'),
  platform: 'browser',
  target: ['es2018']
}).then(() => {
  console.log('Build succeeded');
}).catch((err) => {
  console.error('Build failed', err);
  process.exit(1);
});
