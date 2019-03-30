/* tslint:disable:no-magic-numbers */

import { assert } from "chai";
import { parseConfig } from "../lib/index";
import { resolve } from "path";

describe("Parse config", () => {
  it("extracts config from absolute path", async () => {
    const path = resolve(__dirname, "./fixtures/config");
    const [first, second, third] = await parseConfig(path);
    assert.equal(first.value, "dev");
    assert.equal(second.value, "github.com");
    assert.equal(third.value, "*");
  });
});
