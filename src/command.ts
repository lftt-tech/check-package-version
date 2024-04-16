import { exec, ExecException } from "child_process";

export const command = (cmd: string) =>
  new Promise<{ data: () => string | null; error: () => string | null }>(
    (resolve, reject) => {
      exec(cmd, (error: ExecException | null, stdout: string) => {
        if (stdout) {
          resolve({
            data: () => stdout,
            error: () => null,
          });
        }
        if (error) {
          resolve({
            data: () => null,
            error: () => stdout,
          });
        }
      });
    }
  );
