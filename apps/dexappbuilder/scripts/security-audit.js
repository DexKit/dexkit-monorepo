#!/usr/bin/env node

/**
 * Security Audit Script for DexAppBuilder
 * Checks all security headers and configurations
 */

import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityAuditor {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async checkSecurityHeaders(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      const req = protocol.request(url, { method: 'HEAD' }, (res) => {
        const headers = res.headers;
        const securityScore = this.analyzeSecurityHeaders(headers, url);
        resolve(securityScore);
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  analyzeSecurityHeaders(headers, url) {
    const analysis = {
      url,
      status: 'PASSED',
      foundHeaders: 0,
      missingHeaders: 0,
      warnings: 0,
      details: {}
    };

    const requiredHeaders = {
      'content-security-policy': 'Content Security Policy',
      'strict-transport-security': 'HTTP Strict Transport Security',
      'cross-origin-opener-policy': 'Cross-Origin Opener Policy',
      'cross-origin-embedder-policy': 'Cross-Origin Embedder Policy',
      'x-frame-options': 'X-Frame-Options',
      'referrer-policy': 'Referrer Policy',
      'permissions-policy': 'Permissions Policy',
      'x-content-type-options': 'X-Content-Type-Options',
      'x-dns-prefetch-control': 'X-DNS-Prefetch-Control',
      'x-download-options': 'X-Download-Options',
      'x-permitted-cross-domain-policies': 'X-Permitted-Cross-Domain-Policies'
    };

    Object.entries(requiredHeaders).forEach(([headerKey, headerName]) => {
      const headerValue = headers[headerKey];
      if (headerValue) {
        analysis.foundHeaders++;
        analysis.details[headerName] = {
          status: 'FOUND',
          value: headerValue,
          score: this.scoreHeader(headerKey, headerValue)
        };
      } else {
        analysis.missingHeaders++;
        analysis.details[headerName] = {
          status: 'MISSING',
          value: null,
          score: 0
        };
      }
    });

    if (analysis.missingHeaders === 0) {
      analysis.status = 'PASSED';
      this.results.passed++;
    } else if (analysis.missingHeaders <= 2) {
      analysis.status = 'WARNING';
      analysis.warnings = analysis.missingHeaders;
      this.results.warnings++;
    } else {
      analysis.status = 'FAILED';
      this.results.failed++;
    }

    return analysis;
  }

  scoreHeader(headerKey, headerValue) {
    let score = 0;

    switch (headerKey) {
      case 'content-security-policy':
        if (headerValue.includes("'self'")) score += 2;
        if (headerValue.includes("'unsafe-inline'")) score += 1;
        if (headerValue.includes("'unsafe-eval'")) score += 1;
        if (headerValue.includes('frame-ancestors')) score += 2;
        if (headerValue.includes('object-src')) score += 1;
        break;

      case 'strict-transport-security':
        if (headerValue.includes('max-age=')) score += 2;
        if (headerValue.includes('includeSubDomains')) score += 1;
        if (headerValue.includes('preload')) score += 1;
        break;

      case 'cross-origin-opener-policy':
        if (headerValue === 'same-origin') score += 2;
        break;

      case 'cross-origin-embedder-policy':
        if (headerValue === 'require-corp') score += 2;
        if (headerValue === 'credentialless') score += 1;
        break;

      case 'x-frame-options':
        if (headerValue === 'SAMEORIGIN') score += 2;
        if (headerValue === 'DENY') score += 2;
        break;

      case 'referrer-policy':
        if (headerValue.includes('strict-origin')) score += 2;
        break;

      case 'permissions-policy':
        if (headerValue.includes('camera=()')) score += 1;
        if (headerValue.includes('microphone=()')) score += 1;
        if (headerValue.includes('geolocation=()')) score += 1;
        break;

      default:
        score = headerValue ? 1 : 0;
    }

    return Math.min(score, 5);
  }

  generateReport() {
    const totalChecks = this.results.passed + this.results.failed + this.results.warnings;
    const securityScore = Math.round((this.results.passed / totalChecks) * 100);

    console.log('\n🔒 SECURITY AUDIT REPORT 🔒');
    console.log('='.repeat(50));
    console.log(`Overall Security Score: ${securityScore}%`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log('='.repeat(50));

    this.results.details.forEach((detail, index) => {
      console.log(`\n${index + 1}. ${detail.url}`);
      console.log(`   Status: ${detail.status}`);
      console.log(`   Found Headers: ${detail.foundHeaders}/11`);
      console.log(`   Missing Headers: ${detail.missingHeaders}`);

      if (detail.warnings > 0) {
        console.log(`   ⚠️  Warnings: ${detail.warnings}`);
      }

      Object.entries(detail.details).forEach(([headerName, headerInfo]) => {
        const statusIcon = headerInfo.status === 'FOUND' ? '✅' : '❌';
        const scoreText = headerInfo.status === 'FOUND' ? ` (Score: ${headerInfo.score}/5)` : '';
        console.log(`   ${statusIcon} ${headerName}: ${headerInfo.status}${scoreText}`);

        if (headerInfo.value && headerInfo.value.length > 100) {
          console.log(`      Value: ${headerInfo.value.substring(0, 100)}...`);
        } else if (headerInfo.value) {
          console.log(`      Value: ${headerInfo.value}`);
        }
      });
    });

    console.log('\n🔍 SECURITY RECOMMENDATIONS:');
    console.log('='.repeat(50));

    if (this.results.failed > 0) {
      console.log('❌ CRITICAL: Fix missing security headers immediately');
    }

    if (this.results.warnings > 0) {
      console.log('⚠️  WARNING: Consider adding missing optional headers');
    }

    if (securityScore >= 90) {
      console.log('✅ EXCELLENT: Your application has strong security headers');
    } else if (securityScore >= 70) {
      console.log('🟡 GOOD: Your application has good security, but room for improvement');
    } else {
      console.log('🔴 POOR: Your application needs significant security improvements');
    }

    return {
      score: securityScore,
      results: this.results
    };
  }

  async runAudit(urls) {
    console.log('🔒 Starting Security Audit...\n');

    for (const url of urls) {
      try {
        console.log(`Checking: ${url}`);
        const result = await this.checkSecurityHeaders(url);
        this.results.details.push(result);
        console.log(`   Status: ${result.status}`);
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        this.results.failed++;
        this.results.details.push({
          url,
          status: 'ERROR',
          foundHeaders: 0,
          missingHeaders: 11,
          warnings: 0,
          details: {},
          error: error.message
        });
      }
    }

    return this.generateReport();
  }
}

async function main() {
  const urls = [
    'http://localhost:3000',
    'https://dexkit.app',
    'https://dexkit.com',
    'https://dexkit.io'
  ];

  const auditor = new SecurityAuditor();
  await auditor.runAudit(urls);
}

main().catch(console.error);

export default SecurityAuditor;
