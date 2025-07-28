#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting bundle analysis...\n');

// Set environment variables
process.env.ANALYZE = 'true';
process.env.NODE_ENV = 'production';

try {
  // Build the application with analysis
  console.log('📦 Building application...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' }
  });

  console.log('\n✅ Bundle analysis complete!');
  console.log('📊 Bundle analyzer will open in your browser automatically.');
  console.log('\n📈 Key metrics to check:');
  console.log('- Total bundle size should be < 1MB for initial load');
  console.log('- Largest chunks should be < 250KB');
  console.log('- Check for duplicate dependencies');
  console.log('- Identify unused code');

  // Generate bundle report
  generateBundleReport();

} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}

function generateBundleReport() {
  const buildDir = path.join(__dirname, '..', '.next');
  const reportPath = path.join(__dirname, '..', 'bundle-report.json');

  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found, skipping detailed report');
    return;
  }

  try {
    // Analyze build output
    const buildManifest = path.join(buildDir, 'build-manifest.json');
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      
      const report = {
        timestamp: new Date().toISOString(),
        pages: Object.keys(manifest.pages).length,
        totalFiles: Object.values(manifest.pages).flat().length,
        analysis: {
          recommendations: [
            'Consider code splitting for large pages',
            'Use dynamic imports for heavy components',
            'Optimize images with Next.js Image component',
            'Remove unused dependencies',
            'Enable tree shaking for better optimization'
          ]
        }
      };

      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Bundle report saved to: ${reportPath}`);
    }
  } catch (error) {
    console.log('⚠️  Could not generate detailed report:', error.message);
  }
}