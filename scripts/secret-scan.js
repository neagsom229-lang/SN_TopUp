const { execSync } = require('child_process');

try {
  let logOutput = '';
  try {
    logOutput = execSync('git log -p --all', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    // If no commits exist yet, fallback to git status / staged
    logOutput = execSync('git diff HEAD', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();
  }

  const forbiddenPatterns = [
    /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!your-|\s*$|dummy)[a-zA-Z0-9_\-\.]{20,}/i,
    /KHQR_RBK_TOKEN\s*=\s*(?!your-|\s*$|mock)[a-zA-Z0-9_\-\.]{20,}/i,
    /KHQR_WEBHOOK_SECRET\s*=\s*(?!your-|\s*$|mock)[a-zA-Z0-9_\-\.]{20,}/i,
    /SUPPLIER_API_KEY\s*=\s*(?!your-|\s*$|mock)[a-zA-Z0-9_\-\.]{20,}/i,
    /TELEGRAM_BOT_TOKEN\s*=\s*[0-9]{8,}:[a-zA-Z0-9_\-]{20,}/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(logOutput)) {
      console.error('ERROR: Real secret detected in git history matching pattern ' + pattern);
      process.exit(1);
    }
  }

  console.log('Secret scan passed: 0 secrets detected across git history.');
} catch (err) {
  console.error('Secret scan failed with error:', err.message);
  process.exit(1);
}
