declare module "ssh-config" {
  export function parse(data: string): SshConfig[];
  interface Configuration {
    param: string;
    value: string;
  }

  export interface SshConfig extends Configuration {
    config: Configuration[];
  }
}
