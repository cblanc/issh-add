import { spawnSync, SpawnSyncReturns } from "child_process";
import { homedir } from "os";

const normalise = (file: string): string => {
  const homedirRegex = /^~/;
  if (file.match(homedirRegex) !== null) {
    return file.replace(homedirRegex, homedir()).trim();
  }
  return file.trim();
};

/**
 * sshAdd
 *
 * Invokes ssh add on list of identityFiles
 */
export const sshAdd = (file: string): SpawnSyncReturns<Buffer> => {
  return spawnSync("ssh-add", [normalise(file)], {
    stdio: "inherit",
    shell: true,
  });
};
