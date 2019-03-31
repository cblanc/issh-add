import Fuse from "fuse.js";
import { HostConfiguration } from "./index";

export const generateIndex = (
  configs: HostConfiguration[]
): Fuse<HostConfiguration> => {
  return new Fuse(configs, {
    shouldSort: true,
    minMatchCharLength: 3,
    location: 0,
    distance: 0,
    tokenize: true,
    keys: ["identityFile", "host", "hostName", "user"],
  });
};
