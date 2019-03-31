import Fuse from "fuse.js";
import { HostConfiguration } from "./index";

interface Options {
  shouldSort: boolean;
  minMatchCharLength: number;
  location: number;
  distance: number;
  tokenize: boolean;
  keys: string[];
}

const options: Options = {
  shouldSort: true,
  minMatchCharLength: 1,
  location: 0,
  distance: 0,
  tokenize: false,
  keys: ["identityFile", "host", "hostName", "user"],
};

export const generateIndex = (
  configs: HostConfiguration[]
): Fuse<HostConfiguration, Options> => {
  return new Fuse(configs, options);
};
