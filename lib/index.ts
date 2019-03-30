import { parse, SshConfig } from "ssh-config";
import { readFile } from "fs";

export const parseConfig = (path: string): Promise<SshConfig[]> => {
  return new Promise((resolve, reject) => {
    readFile(path, { encoding: "utf8" }, (error, data) => {
      if (error) return reject(error);
      return resolve(parse(data));
    });
  });
};
