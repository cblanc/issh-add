import { homedir } from "os";
import { resolve } from "path";
import { renderUi } from "./ui";
import { parseConfig, extractHostConfigs } from "./index";
import { generateIndex } from "./search";

const path = resolve(homedir(), ".ssh/config");

export const exec = async () => {
  const config = await parseConfig(path);

  // Parse host configs
  const hostConfigs = extractHostConfigs(config);

  // Generate inverted index
  const index = generateIndex(hostConfigs);

  // Render input screen
  renderUi({ index, path });
};

// On enter - access ssh-add
