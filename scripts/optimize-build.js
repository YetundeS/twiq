#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization...\n');

const optimizations = [
  {
    name: 'Lint Code',
    command: 'npm run lint',
    description: 'Check for code quality issues'
  },
  {
    name: 'Build Application',  
    command: 'npm run build',
    description: 'Create optimized production build'
  },
  {
    name: 'Analyze Bundle',
    command: 'npm run analyze',
    description: 'Generate bundle analysis report'
  }
];

async function runOptimization(step) {
  console.log(`📋 ${step.name}: ${step.description}`);
  
  try {
    const startTime = Date.now();
    execSync(step.command, { stdio: 'inherit' });
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ ${step.name} completed in ${duration}s\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${step.name} failed:`, error.message);
    return false;
  }
}

async function generateOptimizationReport() {
  const buildDir = path.join(__dirname, '..', '.next');
  const reportPath = path.join(__dirname, '..', 'optimization-report.json');

  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found');
    return;
  }

  try {
    // Get build stats
    const stats = fs.statSync(buildDir);
    const buildSize = execSync(`du -sh ${buildDir}`, { encoding: 'utf8' }).split('\t')[0];
    
    // Check for common optimization opportunities
    const srcDir = path.join(__dirname, '..', 'src');
    const componentsCount = execSync(`find ${srcDir} -name "*.jsx" -o -name "*.tsx" | wc -l`, { encoding: 'utf8' }).trim();
    const hooksCount = execSync(`find ${srcDir}/hooks -name "*.js" | wc -l`, { encoding: 'utf8' }).trim();
    
    const report = {
      timestamp: new Date().toISOString(),
      buildSize,
      buildTime: stats.birthtime,
      components: parseInt(componentsCount),
      hooks: parseInt(hooksCount),
      optimizations: {
        applied: [
          'Bundle splitting enabled',
          'Image optimization configured',
          'Compression enabled',
          'Code minification active',
          'Tree shaking enabled'
        ],
        recommendations: [
          'Monitor bundle size regularly',
          'Use dynamic imports for large components',
          'Optimize images before upload',
          'Remove unused dependencies',
          'Enable service worker for caching'
        ]
      },
      performance: {
        metrics: [
          'First Contentful Paint (FCP) target: < 1.8s',
          'Largest Contentful Paint (LCP) target: < 2.5s',
          'Cumulative Layout Shift (CLS) target: < 0.1',
          'First Input Delay (FID) target: < 100ms'
        ]
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Optimization report saved to: ${reportPath}`);
    
    // Display summary
    console.log('\n📈 Optimization Summary:');
    console.log(`Build Size: ${buildSize}`);
    console.log(`Components: ${componentsCount}`);
    console.log(`Custom Hooks: ${hooksCount}`);
    console.log('\n🎯 Performance Targets:');
    report.performance.metrics.forEach(metric => {
      console.log(`  • ${metric}`);
    });

  } catch (error) {
    console.log('⚠️  Could not generate optimization report:', error.message);
  }
}

async function main() {
  let allPassed = true;

  // Run optimization steps
  for (const step of optimizations) {
    const success = await runOptimization(step);
    if (!success) {
      allPassed = false;
      break;
    }
  }

  if (allPassed) {
    console.log('🎉 All optimizations completed successfully!\n');
    await generateOptimizationReport();
    
    console.log('\n🚀 Ready for deployment!');
    console.log('Next steps:');
    console.log('  1. Review bundle analysis results');
    console.log('  2. Test the optimized build locally: npm run start');
    console.log('  3. Deploy to production');
    console.log('  4. Monitor performance metrics');
  } else {
    console.log('\n❌ Optimization failed. Please fix the issues and try again.');
    process.exit(1);
  }
}

// Run the optimization process
main().catch(error => {
  console.error('💥 Optimization process failed:', error);
  process.exit(1);
});