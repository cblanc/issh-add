import { spawnSync, SpawnSyncReturns } from "child_process";
import { homedir } from "os";

const { SSH_AUTH_SOCK, SSH_AGENT_PID } = process.env;

process.stdout.write(JSON.stringify(process.env));

interface Agent {
  SSH_AUTH_SOCK: string;
  SSH_AGENT_PID: string | undefined;
}

export const getAgent = (): Agent | undefined => {
  if (SSH_AUTH_SOCK === undefined) return;
  return { SSH_AUTH_SOCK, SSH_AGENT_PID };
};

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
