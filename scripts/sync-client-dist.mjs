import { cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(rootDir, "out");
const clientDistDir = join(rootDir, "client", "dist");

await rm(clientDistDir, { force: true, recursive: true });
await cp(outDir, clientDistDir, { recursive: true });

console.log("Copied Next static export to client/dist.");
