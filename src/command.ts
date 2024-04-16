import { exec, ExecException } from "child_process";

export const command = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    exec(cmd, (error: ExecException | null, stdout: string) => {
      if (stdout) {
        resolve(stdout);
      }
      if (error) {
        reject(error.message);
      }
    });
  });
