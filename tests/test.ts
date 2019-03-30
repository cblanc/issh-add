import { assert } from "chai";
import { parseConfig } from "../lib/index";
import { resolve } from "path";

describe("Parse config", () => {
  it("extracts config from absolute path", async () => {
    const path = resolve(__dirname, "./fixtures/ssh_config");
    const config = await parseConfig(path);
    process.stdout.write(JSON.stringify(config));
  });
});
