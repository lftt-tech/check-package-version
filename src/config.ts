import * as core from "@actions/core";

export const getConfig = () => {
  return {
    npmToken: core.getInput("NPM_TOKEN"),
    packageName: core.getInput("PACKAGE_NAME"),
    packageDir: core.getInput("PACKAGE_DIR"),
    packageFileName: core.getInput("PACKAGE_FILE_NAME"),
  };
};
