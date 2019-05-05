import { homedir } from "os";
import { resolve } from "path";
import { renderApp } from "./components/app";
import { parseConfig, extractHostConfigs } from "./index";
import { generateIndex } from "./search";
import { getAgent } from "./ssh-agent";

const path = resolve(homedir(), ".ssh/config");

/**
 * detectAgent
 *
 * Detects if SSH agent present, otherwise exits 1
 */
const detectAgent = (): void => {
  const agent = getAgent();
  if (agent === undefined) {
    process.stdout.write("Unable to detect SSH Agent\n");
    process.stdout.write("Activate with $ eval `ssh-agent` and try again\n");
    process.exit(1);
    return;
  }
};

export const exec = async () => {
  detectAgent();

  const config = await parseConfig(path);

  // Parse host configs
  const hostConfigs = extractHostConfigs(config);

  // Generate inverted index
  const index = generateIndex(hostConfigs);

  const maxResults = 10;

  // Render input screen
  renderApp({ index, path, maxResults, hostConfigs });
};

// On enter - access ssh-add
