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

/**
 * toHostConfig
 */
export const toHostConfig = (sshConfig: SshConfig): HostConfiguration => {
  const hostConfig: HostConfiguration = { identityFile: [] };

  // Parent value is host
  hostConfig.host = sshConfig.value;

  const config = sshConfig.config.reduce<KeyValueObject>((prev, curr) => {
    prev[curr.param.toLowerCase()] = curr.value;
    return prev;
  }, {});

  if (config.host) hostConfig.host = config.host;
  if (config.hostname) hostConfig.hostName = config.hostname;
  if (config.user) hostConfig.user = config.user;
  if (config.port) hostConfig.port = config.port;

  // Load in identity file as array of strings
  if (config.identityfile)
    hostConfig.identityFile = config.identityfile.split(/\s+/);

  return hostConfig;
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
