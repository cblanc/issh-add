import { homedir } from "os";
import { resolve } from "path";
import { renderApp } from "./components/app";
import { parseConfig, extractHostConfigs } from "./index";
import { generateIndex } from "./search";

const path = resolve(homedir(), ".ssh/config");

export const exec = async () => {
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
