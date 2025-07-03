#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PLATFORMS = {
  vercel: {
    name: 'Vercel',
    buildCmd: 'npm run build',
    checkFiles: ['dist/index.js', 'dist/public/index.html'],
    envVars: { 'SKIP_ENV_VALIDATION': '1' }
  },
  'gh-pages': {
    name: 'GitHub Pages',
    buildCmd: 'npm run build',
    checkFiles: ['dist/public/index.html'],
    envVars: { 'SKIP_ENV_VALIDATION': '1' }
  },
  render: {
    name: 'Render',
    buildCmd: 'npm run build',
    checkFiles: ['dist/index.js', 'dist/public/index.html'],
    envVars: { 'NODE_ENV': 'production' }
  },
  fly: {
    name: 'Fly.io',
    buildCmd: 'npm run build',
    checkFiles: ['dist/index.js', 'dist/public/index.html'],
    envVars: { 'NODE_ENV': 'production', 'PORT': '8080' }
  },
  local: {
    name: 'Local Development',
    buildCmd: 'npm run build',
    checkFiles: ['dist/index.js', 'dist/public/index.html'],
    envVars: {}
  }
};

class BuildValidator {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, env = {}) {
    try {
      const result = execSync(command, {
        env: { ...process.env, ...env },
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 300000 // 5 minutes timeout
      });
      return { success: true, output: result };
    } catch (error) {
      return { 
        success: false, 
        output: error.stdout || error.stderr || error.message 
      };
    }
  }

  checkDependencies() {
    this.log('Checking dependencies...');
    this.totalTests++;

    try {
      // Check package.json
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      
      // Check for problematic dependencies
      const problematicDeps = [
        'fsevents', // Mac-specific
        'win32' // Windows-specific
      ];
      
      const foundProblematic = problematicDeps.filter(dep => 
        packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
      );
      
      if (foundProblematic.length > 0) {
        this.log(`Found platform-specific dependencies: ${foundProblematic.join(', ')}`, 'error');
        return false;
      }

      // Check Node.js version compatibility
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        this.log(`Node.js version ${nodeVersion} is too old. Minimum required: 18.0.0`, 'error');
        return false;
      }

      this.log('Dependencies check passed', 'success');
      this.passedTests++;
      return true;
    } catch (error) {
      this.log(`Dependencies check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testInstallation() {
    this.log('Testing npm installation...');
    this.totalTests++;

    const installResult = await this.runCommand('npm ci --legacy-peer-deps');
    
    if (!installResult.success) {
      this.log(`Installation failed: ${installResult.output}`, 'error');
      return false;
    }

    this.log('Installation successful', 'success');
    this.passedTests++;
    return true;
  }

  async testPlatformBuild(platform, config) {
    this.log(`Testing ${config.name} build...`);
    this.totalTests++;

    // Set environment variables
    const buildResult = await this.runCommand(config.buildCmd, config.envVars);
    
    if (!buildResult.success) {
      this.log(`${config.name} build failed: ${buildResult.output}`, 'error');
      this.results.push({
        platform: config.name,
        success: false,
        error: buildResult.output
      });
      return false;
    }

    // Check if required files exist
    const missingFiles = config.checkFiles.filter(file => !existsSync(file));
    
    if (missingFiles.length > 0) {
      this.log(`${config.name} build missing files: ${missingFiles.join(', ')}`, 'error');
      this.results.push({
        platform: config.name,
        success: false,
        error: `Missing files: ${missingFiles.join(', ')}`
      });
      return false;
    }

    this.log(`${config.name} build successful`, 'success');
    this.results.push({
      platform: config.name,
      success: true
    });
    this.passedTests++;
    return true;
  }

  async validateTypeScript() {
    this.log('Validating TypeScript...');
    this.totalTests++;

    const tscResult = await this.runCommand('npx tsc --noEmit --skipLibCheck');
    
    if (!tscResult.success) {
      this.log(`TypeScript validation failed: ${tscResult.output}`, 'error');
      return false;
    }

    this.log('TypeScript validation passed', 'success');
    this.passedTests++;
    return true;
  }

  async run() {
    this.log('Starting build validation for all platforms...');
    
    // Check dependencies
    if (!this.checkDependencies()) {
      return this.generateReport();
    }

    // Test installation
    if (!await this.testInstallation()) {
      return this.generateReport();
    }

    // Validate TypeScript
    await this.validateTypeScript();

    // Test each platform
    for (const [platform, config] of Object.entries(PLATFORMS)) {
      await this.testPlatformBuild(platform, config);
      
      // Clean dist folder between builds
      try {
        await this.runCommand('rm -rf dist');
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    return this.generateReport();
  }

  generateReport() {
    const successRate = this.totalTests > 0 ? (this.passedTests / this.totalTests * 100).toFixed(1) : 0;
    
    this.log('\n📊 BUILD VALIDATION REPORT');
    this.log('================================');
    this.log(`Overall Success Rate: ${successRate}%`);
    this.log(`Tests Passed: ${this.passedTests}/${this.totalTests}`);
    
    if (this.results.length > 0) {
      this.log('\nPlatform-specific Results:');
      this.results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        this.log(`${status} ${result.platform}`);
        if (!result.success && result.error) {
          this.log(`   Error: ${result.error}`);
        }
      });
    }

    const recommendations = this.generateRecommendations(successRate);
    if (recommendations.length > 0) {
      this.log('\n💡 RECOMMENDATIONS');
      this.log('==================');
      recommendations.forEach(rec => this.log(`• ${rec}`));
    }

    return {
      successRate: parseFloat(successRate),
      passed: this.passedTests,
      total: this.totalTests,
      results: this.results,
      recommendations
    };
  }

  generateRecommendations(successRate) {
    const recommendations = [];

    if (successRate < 95) {
      recommendations.push('Consider using --legacy-peer-deps flag for npm install');
      recommendations.push('Add SKIP_ENV_VALIDATION=1 for static builds');
      recommendations.push('Ensure Node.js version >= 18.0.0 across all platforms');
    }

    if (this.results.some(r => !r.success)) {
      recommendations.push('Review platform-specific configuration files');
      recommendations.push('Test builds locally before deploying');
    }

    return recommendations;
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new BuildValidator();
  
  validator.run()
    .then(report => {
      const exitCode = report.successRate >= 95 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

export default BuildValidator;