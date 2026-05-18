import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const envFiles = [
  join(rootDir, ".env.local"),
  join(rootDir, ".env.production"),
  "/home/sv/helpse-client.env",
];

for (const envFile of envFiles) {
  loadEnvFile(envFile);
}

run(npmCommand, ["ci"]);
run(npmCommand, ["run", "build"]);
run("node", ["scripts/sync-client-dist.mjs"]);

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  console.log(`Loaded env from ${path}`);
}

function run(command, args) {
  const commandToRun =
    process.platform === "win32" && command === npmCommand
      ? process.env.ComSpec || "cmd.exe"
      : command;
  const argsToRun =
    process.platform === "win32" && command === npmCommand
      ? ["/d", "/s", "/c", "npm", ...args]
      : args;

  const result = spawnSync(commandToRun, argsToRun, {
    cwd: rootDir,
    env: process.env,
    shell: false,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    if (result.error) {
      console.error(result.error);
    }

    process.exit(result.status ?? 1);
  }
}
