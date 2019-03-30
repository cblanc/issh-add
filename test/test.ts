/* tslint:disable:no-magic-numbers */

import { assert } from "chai";
import { parseConfig, toHostConfig } from "../lib/index";
import { resolve } from "path";

const fixturePath = resolve(__dirname, "./fixtures/config");

describe("Parse config", () => {
  it("extracts config from absolute path", async () => {
    const [first, second, third] = await parseConfig(fixturePath);
    assert.equal(first.value, "dev");
    assert.equal(second.value, "github.com");
    assert.equal(third.value, "*");
  });
});

describe("toHostConfig", async () => {
  it("parses ssh configuration block into config object", async () => {
    const config = await parseConfig(fixturePath);
    assert.deepEqual(toHostConfig(config[0]), {
      host: "dev",
      user: "me",
      port: "22",
      identityFile: ["~/.ssh/keydev"],
      hostName: "1.2.3.4",
    });
  });

  it("parses ssh configs with multiple identify files to be tried", async () => {
    const config = await parseConfig(fixturePath);
    assert.deepEqual(toHostConfig(config[1]), {
      host: "github.com",
      port: "22",
      identityFile: ["~/.ssh/github", "~/.ssh/github2"],
    });
  });
});
