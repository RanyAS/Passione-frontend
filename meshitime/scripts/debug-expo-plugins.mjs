import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const endpoint = 'http://127.0.0.1:7930/ingest/e91d4414-1d72-4684-a867-1b6177ed9157';
const sessionId = 'b9999c';
const runId = process.argv.includes('--post-fix') ? 'post-fix' : 'pre-fix';

function log(hypothesisId, message, data) {
  const payload = {
    sessionId,
    runId,
    hypothesisId,
    location: 'scripts/debug-expo-plugins.mjs',
    message,
    data,
    timestamp: Date.now(),
  };

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': sessionId,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});

  console.log(JSON.stringify(payload));
}

const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const plugins = appJson.expo.plugins ?? [];
const expoImageRoot = path.join('node_modules', 'expo-image');

// #region agent log
log('A', 'expo-image listed in app.json plugins', {
  plugins,
  hasExpoImagePlugin: plugins.includes('expo-image'),
});
// #endregion

const pluginCandidates = ['app.plugin.js', 'app.plugin.ts', 'app.plugin.mjs'];
const existingPluginFiles = pluginCandidates.filter((file) =>
  fs.existsSync(path.join(expoImageRoot, file))
);

// #region agent log
log('A', 'expo-image config plugin files on disk', {
  existingPluginFiles,
});
// #endregion

const imageTypesTs = fs.existsSync(path.join(expoImageRoot, 'src', 'Image.types.ts'));
const imageTypesJs = fs.existsSync(path.join(expoImageRoot, 'src', 'Image.types.js'));

// #region agent log
log('C', 'Image.types resolution files', {
  imageTypesTs,
  imageTypesJs,
});
// #endregion

try {
  require(path.join(process.cwd(), expoImageRoot, 'src', 'index.ts'));
  // #region agent log
  log('C', 'require expo-image main succeeded', { ok: true });
  // #endregion
} catch (error) {
  // #region agent log
  log('C', 'require expo-image main failed', {
    ok: false,
    error: error?.message,
    code: error?.code,
  });
  // #endregion
}
