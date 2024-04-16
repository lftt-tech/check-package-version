import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { compareVersions } from "compare-versions";

import { command } from "./command";
import { getConfig } from "./config";

export const run = async () => {
  try {
    const { npmToken, packageName, packageDir, packageFileName } = getConfig();
    const response = await command(
      `npm config set //registry.npmjs.org/:_authToken=${npmToken} && npm view ${packageName} version`,
    );
    const remoteVersion = response.replace(/\r?\n|\r/g, "");

    const file = fs.readFileSync(
      path.join(packageDir, packageFileName),
      "utf8",
    );
    const localVersion = (JSON.parse(file) as { version: string }).version;

    const version = compareVersions(localVersion, remoteVersion);
    core.debug(
      `localVersion: ${localVersion}, remoteVersion: ${remoteVersion}, version: ${version}`,
    );
    if (version > 0) {
      return core.setOutput("version", localVersion);
    }
    core.setFailed("Package version is incorrect.");
  } catch (error: any) {
    core.setFailed(error.message);
  }
};
