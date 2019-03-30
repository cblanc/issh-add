import { homedir } from "os";
import { resolve } from "path";

import { parseConfig } from "./index";

const path = resolve(homedir(), ".ssh/config");

const log = (o: object): void => {
  const TWO = 2;
  process.stdout.write(JSON.stringify(o, null, TWO));
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
