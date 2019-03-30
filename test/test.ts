/* tslint:disable:no-magic-numbers */

import { assert } from "chai";
import {
  parseConfig,
  toHostConfig,
  generateIndex,
  extractHostConfigs,
} from "../lib/index";
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

describe("index generation", () => {
  describe("generateIndex", () => {
    it("creates an inverted index to search configs and searches by host", async () => {
      const config = await parseConfig(fixturePath);
      const index = generateIndex(extractHostConfigs(config));
      const topResult = index.search("dev")[0];
      assert.equal(topResult.host, "dev");
    });
    it("allows prefix matching", async () => {
      const config = await parseConfig(fixturePath);
      const index = generateIndex(extractHostConfigs(config));
      const topResult = index.search("githu")[0];
      assert.equal(topResult.host, "github.com");
    });
    it("allows search by user", async () => {
      const config = await parseConfig(fixturePath);
      const index = generateIndex(extractHostConfigs(config));
      const topResult = index.search("me")[0];
      assert.equal(topResult.host, "dev");
    });
    it("allows search by identityfile", async () => {
      const config = await parseConfig(fixturePath);
      const index = generateIndex(extractHostConfigs(config));
      const topResult = index.search("github2")[0];
      assert.equal(topResult.host, "github.com");
    });
    it("allows search by hostname", async () => {
      const config = await parseConfig(fixturePath);
      const index = generateIndex(extractHostConfigs(config));
      const topResult = index.search("1.2.3.4")[0];
      assert.equal(topResult.host, "dev");
    });
  });
});
