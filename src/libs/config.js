const fs = require('fs');
const path = require('path');
const envs = require('./../entities/envs');

// define constants
const ENV = process.env.NODE_ENV || envs.DEVELOPMENT;
const CONFIGS_DIRECTORY_RELATIVE_PATH = './../../configs/';
const CONFIG_EXTENSION_REGEXP = /^(.*)\.json$/;
const DEFAULT_CONFIG_EXTENSION_REGEXP = /^(.*)\.json\.default$/;

// parse configs
const configsPath = path.join(__dirname, CONFIGS_DIRECTORY_RELATIVE_PATH);
const configsFilesNames = fs.readdirSync(configsPath);
const config = configsFilesNames.reduce((result, fileName) => {
  // define config params
  const configName = fileName.split('.')[0];
  const configPath = path.join(configsPath, fileName);
  const configJSON = fs.readFileSync(configPath);
  const configBody = JSON.parse(configJSON)[ENV];

  // save config
  if (CONFIG_EXTENSION_REGEXP.test(fileName)) {
    return { ...result, [configName]: configBody };
  }
  if (fileName.match(DEFAULT_CONFIG_EXTENSION_REGEXP)) {
    return { [configName]: configBody, ...result };
  }
  return result;
}, {});

module.exports = config;
