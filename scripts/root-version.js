#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const packageJsonPath = './package.json';
const lernaJsonPath = './lerna.json';

function parseJson(input) {
  return JSON.parse(input);
}

function readJson(filePath) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  return parseJson(fs.readFileSync(resolvedPath, 'utf8'));
}

function getLernaVersion() {
  const lernaJson = readJson(lernaJsonPath);
  return lernaJson.version;
}

function setPackageJsonVersion(packageJson, version) {
  return Object.assign({}, packageJson, { version });
}

function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  return fs.writeFileSync(filePath, `${json}\n`);
}

function updatePackageJsonVersion(version) {
  const packageJson = readJson(packageJsonPath);
  const updatedPackageJson = setPackageJsonVersion(packageJson, version);
  return writeJson(packageJsonPath, updatedPackageJson);
}

function run() {
  console.log('Updating root package version...');
  const newVersion = getLernaVersion();
  console.log(`Lerna project version is ${newVersion}`);
  updatePackageJsonVersion(newVersion);
  console.log('...done');
}

run();
