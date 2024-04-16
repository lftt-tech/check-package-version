export declare const command: (cmd: string) => Promise<{
    data: () => string | null;
    error: () => string | null;
}>;
