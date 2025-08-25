#!/usr/bin/env node

/**
 * Security Check Script
 * Verifies that all security headers are properly implemented
 */

import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_HEADERS = {
  'Content-Security-Policy': 'CSP header for XSS protection',
  'Strict-Transport-Security': 'HSTS header for HTTPS enforcement',
  'Cross-Origin-Opener-Policy': 'COOP header for origin isolation',
  'Cross-Origin-Embedder-Policy': 'COEP header for CORS enforcement',
  'X-Frame-Options': 'XFO header for clickjacking protection',
  'Referrer-Policy': 'Referrer policy for privacy',
  'Permissions-Policy': 'Permissions policy for feature restrictions',
  'X-Content-Type-Options': 'MIME type sniffing protection',
  'X-DNS-Prefetch-Control': 'DNS prefetch control',
  'X-Download-Options': 'Download options control',
  'X-Permitted-Cross-Domain-Policies': 'Cross-domain policy control'
};

const HSTS_REQUIREMENTS = {
  'max-age': 'HSTS max-age directive',
  'includeSubDomains': 'HSTS includeSubDomains directive',
  'preload': 'HSTS preload directive'
};

const CSP_REQUIREMENTS = {
  'default-src': 'CSP default-src directive',
  'frame-ancestors': 'CSP frame-ancestors directive',
  'require-trusted-types-for': 'CSP Trusted Types directive',
  'trusted-types': 'CSP trusted-types directive'
};

class SecurityChecker {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async checkUrl(url) {
    console.log(`\n🔍 Checking security headers for: ${url}`);

    const protocol = url.startsWith('https:') ? https : http;

    return new Promise((resolve, reject) => {
      const req = protocol.get(url, (res) => {
        this.analyzeHeaders(res.headers, url);
        resolve();
      });

      req.on('error', (err) => {
        console.error(`❌ Error checking ${url}:`, err.message);
        reject(err);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  analyzeHeaders(headers, url) {
    const foundHeaders = {};
    const missingHeaders = [];
    const warnings = [];

    for (const [header, description] of Object.entries(REQUIRED_HEADERS)) {
      const headerValue = headers[header.toLowerCase()];

      if (headerValue) {
        foundHeaders[header] = headerValue;
        console.log(`✅ ${header}: ${headerValue}`);

        this.validateSpecificHeaders(header, headerValue, warnings);
      } else {
        missingHeaders.push(header);
        console.log(`❌ Missing: ${header} - ${description}`);
      }
    }

    const hstsHeader = headers['strict-transport-security'];
    if (hstsHeader) {
      this.validateHSTS(hstsHeader, warnings);
    }

    const cspHeader = headers['content-security-policy'];
    if (cspHeader) {
      this.validateCSP(cspHeader, warnings);
    }

    if (missingHeaders.length === 0) {
      this.results.passed++;
      this.results.details.push({
        url,
        status: 'PASSED',
        foundHeaders: Object.keys(foundHeaders).length,
        missingHeaders: 0,
        warnings: warnings.length
      });
    } else {
      this.results.failed++;
      this.results.details.push({
        url,
        status: 'FAILED',
        foundHeaders: Object.keys(foundHeaders).length,
        missingHeaders: missingHeaders.length,
        warnings: warnings.length
      });
    }

    warnings.forEach(warning => {
      console.log(`⚠️  Warning: ${warning}`);
      this.results.warnings++;
    });
  }

  validateSpecificHeaders(header, value, warnings) {
    switch (header.toLowerCase()) {
      case 'strict-transport-security':
        this.validateHSTS(value, warnings);
        break;
      case 'content-security-policy':
        this.validateCSP(value, warnings);
        break;
      case 'cross-origin-opener-policy':
        if (value !== 'same-origin') {
          warnings.push(`COOP should be 'same-origin', found: ${value}`);
        }
        break;
      case 'cross-origin-embedder-policy':
        if (value !== 'require-corp') {
          warnings.push(`COEP should be 'require-corp', found: ${value}`);
        }
        break;
    }
  }

  validateHSTS(value, warnings) {
    const directives = value.split(';').map(d => d.trim());

    for (const [requirement, description] of Object.entries(HSTS_REQUIREMENTS)) {
      if (!directives.some(d => d.includes(requirement))) {
        warnings.push(`HSTS missing ${description}: ${requirement}`);
      }
    }

    const maxAgeMatch = value.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1]);
      if (maxAge < 31536000) { // 1 year
        warnings.push(`HSTS max-age should be at least 1 year (31536000), found: ${maxAge}`);
      }
    }
  }

  validateCSP(value, warnings) {
    const directives = value.split(';').map(d => d.trim());

    for (const [requirement, description] of Object.entries(CSP_REQUIREMENTS)) {
      if (!directives.some(d => d.includes(requirement))) {
        warnings.push(`CSP missing ${description}: ${requirement}`);
      }
    }

    if (value.includes("'unsafe-inline'") || value.includes("'unsafe-eval'")) {
      warnings.push("CSP contains unsafe directives ('unsafe-inline' or 'unsafe-eval')");
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY HEADERS AUDIT REPORT');
    console.log('='.repeat(60));

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   ⚠️  Warnings: ${this.results.warnings}`);

    console.log(`\n📋 Detailed Results:`);
    this.results.details.forEach(detail => {
      const statusIcon = detail.status === 'PASSED' ? '✅' : '❌';
      console.log(`   ${statusIcon} ${detail.url}`);
      console.log(`      Status: ${detail.status}`);
      console.log(`      Headers Found: ${detail.foundHeaders}`);
      console.log(`      Headers Missing: ${detail.missingHeaders}`);
      console.log(`      Warnings: ${detail.warnings}`);
    });

    console.log(`\n💡 Recommendations:`);
    if (this.results.failed > 0) {
      console.log(`   - Fix missing security headers`);
    }
    if (this.results.warnings > 0) {
      console.log(`   - Review and optimize header configurations`);
    }
    if (this.results.passed === this.results.details.length) {
      console.log(`   - All security headers are properly configured! 🎉`);
    }

    const reportPath = path.join(__dirname, 'security-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

async function main() {
  const checker = new SecurityChecker();

  // URLs to check (add domains here)
  const urls = [
    'http://localhost:3000'
    // Add production URLs when available
    // 'https://your-domain.com',
    // 'https://app.your-domain.com'
  ];

  console.log('🔒 Starting Security Headers Audit...\n');

  try {
    for (const url of urls) {
      try {
        await checker.checkUrl(url);
      } catch (error) {
        console.error(`❌ Failed to check ${url}:`, error.message);
        checker.results.failed++;
      }
    }
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }

  checker.generateReport();

  if (checker.results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(console.error);
