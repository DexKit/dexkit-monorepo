#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WORKSPACE_ROOTS = ["apps", "packages"];

function findNestedNodeModules() {
  const nested = [];

  for (const workspaceRoot of WORKSPACE_ROOTS) {
    const workspacePath = path.join(ROOT, workspaceRoot);
    if (!fs.existsSync(workspacePath)) continue;

    for (const entry of fs.readdirSync(workspacePath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const nodeModulesPath = path.join(workspacePath, entry.name, "node_modules");
      if (fs.existsSync(nodeModulesPath)) {
        nested.push(path.relative(ROOT, nodeModulesPath));
      }
    }
  }

  return nested.sort();
}

function main() {
  const nested = findNestedNodeModules();

  if (nested.length === 0) {
    console.log("✅ No nested node_modules under apps/* or packages/*");
    return;
  }

  console.error("❌ Nested node_modules detected (hurts tsserver memory):");
  for (const dir of nested) {
    console.error(`   - ${dir}`);
  }
  console.error("\nFix from repo root:");
  console.error("  yarn remove-node-modules:nested && yarn install");
  process.exit(1);
}

main();
