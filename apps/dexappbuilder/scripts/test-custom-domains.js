#!/usr/bin/env node

/**
 * Test Custom Domains Script
 * Tests the middleware with various domain types
 */

import http from 'http';

class CustomDomainTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async testDomain(hostname, expectedBehavior) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'HEAD',
        headers: {
          'Host': hostname
        }
      };

      const req = http.request(options, (res) => {
        const headers = res.headers;
        const result = {
          hostname,
          expectedBehavior,
          status: res.statusCode,
          hasSecurityHeaders: this.checkSecurityHeaders(headers),
          cspHeader: headers['content-security-policy'] || 'NOT_FOUND',
          frameOptions: headers['x-frame-options'] || 'NOT_FOUND',
          coop: headers['cross-origin-opener-policy'] || 'NOT_FOUND',
          coep: headers['cross-origin-embedder-policy'] || 'NOT_FOUND'
        };

        this.testResults.push(result);
        console.log(`✅ Tested: ${hostname}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Security Headers: ${result.hasSecurityHeaders ? '✅' : '❌'}`);
        console.log(`   CSP: ${result.cspHeader.substring(0, 100)}...`);
        console.log(`   X-Frame-Options: ${result.frameOptions}`);
        console.log(`   COOP: ${result.coop}`);
        console.log(`   COEP: ${result.coep}`);
        console.log('');

        resolve(result);
      });

      req.on('error', (error) => {
        const result = {
          hostname,
          expectedBehavior,
          status: 'ERROR',
          error: error.message,
          hasSecurityHeaders: false
        };

        this.testResults.push(result);
        console.log(`❌ Error testing: ${hostname}`);
        console.log(`   Error: ${error.message}`);
        console.log('');

        resolve(result);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        const result = {
          hostname,
          expectedBehavior,
          status: 'TIMEOUT',
          error: 'Request timeout',
          hasSecurityHeaders: false
        };

        this.testResults.push(result);
        console.log(`⏰ Timeout testing: ${hostname}`);
        console.log('');

        resolve(result);
      });

      req.end();
    });
  }

  checkSecurityHeaders(headers) {
    const requiredHeaders = [
      'content-security-policy',
      'strict-transport-security',
      'cross-origin-opener-policy',
      'cross-origin-embedder-policy',
      'x-frame-options',
      'referrer-policy',
      'permissions-policy',
      'x-content-type-options'
    ];

    return requiredHeaders.every(header => headers[header]);
  }

  async runTests() {
    console.log('🔒 Testing Custom Domain Security Configuration\n');
    console.log('='.repeat(60));

    const testCases = [
      {
        hostname: 'localhost:3000',
        expectedBehavior: 'Internal domain - standard security'
      },
      {
        hostname: 'scaleswap.dexkit.app',
        expectedBehavior: 'DexKit subdomain - standard security'
      },
      {
        hostname: 'dexkit.com',
        expectedBehavior: 'Custom .com domain - enhanced security'
      },
      {
        hostname: 'e1digital.xyz',
        expectedBehavior: 'Custom .xyz domain - moderate security'
      },
      {
        hostname: 'dexkit.io',
        expectedBehavior: 'Custom .io domain - moderate security'
      },
      {
        hostname: '127.0.0.1',
        expectedBehavior: 'Invalid domain - should be blocked'
      },
      {
        hostname: 'localhost',
        expectedBehavior: 'Invalid domain - should be blocked'
      }
    ];

    for (const testCase of testCases) {
      await this.testDomain(testCase.hostname, testCase.expectedBehavior);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 CUSTOM DOMAIN SECURITY TEST REPORT');
    console.log('='.repeat(60));

    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.status === 200).length;
    const errorTests = this.testResults.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT').length;
    const securityHeaderTests = this.testResults.filter(r => r.hasSecurityHeaders).length;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Successful: ${successfulTests}`);
    console.log(`Errors: ${errorTests}`);
    console.log(`With Security Headers: ${securityHeaderTests}`);
    console.log(`Security Coverage: ${Math.round((securityHeaderTests / totalTests) * 100)}%`);

    console.log('\n🔍 DETAILED RESULTS:');
    console.log('='.repeat(60));

    this.testResults.forEach((result, index) => {
      const statusIcon = result.status === 200 ? '✅' : result.status === 'ERROR' ? '❌' : '⏰';
      console.log(`${index + 1}. ${statusIcon} ${result.hostname}`);
      console.log(`   Expected: ${result.expectedBehavior}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Security: ${result.hasSecurityHeaders ? '✅ Complete' : '❌ Incomplete'}`);

      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    });

    console.log('🔒 SECURITY RECOMMENDATIONS:');
    console.log('='.repeat(60));

    if (this.testResults.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT').length > 0) {
      console.log('❌ CRITICAL: Fix missing security headers immediately');
    }

    if (this.testResults.filter(r => !r.hasSecurityHeaders).length > 0) {
      console.log('⚠️  WARNING: Consider adding missing optional headers');
    }

    const securityScore = Math.round((securityHeaderTests / totalTests) * 100);
    if (securityScore >= 90) {
      console.log('✅ EXCELLENT: Your application has strong security headers');
    } else if (securityScore >= 70) {
      console.log('🟡 GOOD: Your application has good security, but room for improvement');
    } else {
      console.log('🔴 POOR: Your application needs significant security improvements');
    }

    const customDomains = this.testResults.filter(r =>
      r.hostname.includes('.com') ||
      r.hostname.includes('.org') ||
      r.hostname.includes('.xyz') ||
      r.hostname.includes('.io') ||
      r.hostname.includes('.app')
    );

    if (customDomains.length > 0) {
      console.log(`\n🌐 Custom Domains Tested: ${customDomains.length}`);
      customDomains.forEach(domain => {
        console.log(`   ${domain.hostname}: ${domain.hasSecurityHeaders ? '✅ Secure' : '❌ Insecure'}`);
      });
    }
  }
}

async function main() {
  console.log('🚀 Starting Custom Domain Security Tests...\n');

  const tester = new CustomDomainTester();
  await tester.runTests();
}

main().catch(console.error);

export default CustomDomainTester;
