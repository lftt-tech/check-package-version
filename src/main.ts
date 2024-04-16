import { join } from "path";
import { readFileSync } from "fs";
import * as core from "@actions/core";
import { compareVersions } from "compare-versions";

import { command } from "./command";
import { getConfig } from "./config";

export const run = async () => {
  let remoteVersion = "0.0.0";

  try {
    const { npmToken, packageName, packageDir, packageFileName } = getConfig();

    const file = readFileSync(join(packageDir, packageFileName), "utf8");
    const localVersion = (JSON.parse(file) as { version: string }).version;

    const response = await command(
      `npm config set //registry.npmjs.org/:_authToken=${npmToken} && npm view ${packageName} version`
    );
    const data = response.data();
    const error = response.error();
    if (data) {
      remoteVersion = data.replace(/\r?\n|\r/g, "");
    }
    if (error) {
      if (!error.includes("npm ERR! code E404")) {
        throw new Error(error);
      }
    }

    const version = compareVersions(localVersion, remoteVersion);
    core.debug(
      `localVersion: ${localVersion}, remoteVersion: ${remoteVersion}, version: ${version}`
    );
    if (version < 1) {
      throw new Error("Package version is incorrect.");
    }
    core.setOutput("version", localVersion);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};
