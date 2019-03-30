import { homedir } from "os";
import { resolve } from "path";
import { SshConfig } from "ssh-config";

import { parseConfig } from "./index";

const path = resolve(homedir(), ".ssh/config");

const log = (o: object): void => {
  const TWO = 2;
  process.stdout.write(JSON.stringify(o, null, TWO));
};

/**
 * HostConfiguration
 *
 * Represent a host configuration as an identify file and a list of indexable attributes including, hostname ip address, identifyfile user and port
 */
interface HostConfiguration {
  identityFile: string[];
  host?: string;
  hostName?: string;
  user?: string;
  port?: string;
}

interface KeyValueObject {
  [key: string]: string;
}

interface ConfigParser {
  (sshConfig: SshConfig): HostConfiguration | void;
}

const identityFileSplitter = (i: string): string[] => i.split(/\s+/);

/**
 * extractIdentifyFile
 *
 * Iterates over relevant identifyfile objects and merges into a single array
 */
const extractIdentifyFile = (sshConfig: SshConfig): string[] => {
  const { config } = sshConfig;
  return config
    .filter(({ param }) => param.toLowerCase() === "identityfile")
    .reduce<string[]>(
      (result, { value }) => result.concat(identityFileSplitter(value)),
      []
    );
};

/**
 * mergeConfigurations
 *
 * Merges array of SshConfiguration objects into a single config object
 */
const mergeConfigurations = (sshConfig: SshConfig): KeyValueObject => {
  return sshConfig.config.reduce<KeyValueObject>((prev, curr) => {
    const { value, param } = curr;
    const attr = param.toLowerCase();
    // Ignore identifyfile as this needs to be handled separately
    if (attr !== "identityfile") prev[attr] = value;
    return prev;
  }, {});
};

const parseHostBlock: ConfigParser = sshConfig => {
  const hostConfig: HostConfiguration = {
    // Parent value is host
    host: sshConfig.value,
    identityFile: extractIdentifyFile(sshConfig),
  };

  const config = mergeConfigurations(sshConfig);
  if (config.host) hostConfig.host = config.host;
  if (config.hostname) hostConfig.hostName = config.hostname;
  if (config.user) hostConfig.user = config.user;
  if (config.port) hostConfig.port = config.port;

  return hostConfig;
};

/**
 * toHostConfig
 */
export const toHostConfig: ConfigParser = sshConfig => {
  const param = sshConfig.param.toLowerCase();
  if (param === "host") return parseHostBlock(sshConfig);
  // Return void if invalid block detected
  return;
};

/**
 * exec
 *
 * Runs CLI
 */
export const exec = async () => {
  const config = await parseConfig(path);
  log(config);
};

// Parse ssh-config
// Render input screen
// Accept Keypress
// On enter - access ssh-add
