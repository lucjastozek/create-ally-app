#!/usr/bin/env node
import prompts from "prompts";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
  rmdirSync,
} from "fs";
import path from "path";
import degit from "degit";
import { execSync } from "child_process";

let projectName = process.argv[2];
if (!projectName) {
  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    initial: "my-app",
    validate: (name) => {
      if (!name) return "Project name cannot be empty";
      if (/[^a-zA-Z0-9-_]/.test(name))
        return "Only letters, numbers, '-' and '_' are allowed";
      if (/^[0-9.]/.test(name)) return "Cannot start with a number or dot";
      if (/^[-_]/.test(name)) return "Cannot start with - or _";
      if (["fs", "path", "http", "url"].includes(name))
        return "Cannot use a Node built-in module name";
      return true;
    },
  });
  projectName = response.projectName;
}

const projectPath = path.join(process.cwd(), projectName);
let didCreateFolder = false;
let finished = false;

const cleanup = () => {
  if (didCreateFolder && !finished && existsSync(projectPath)) {
    try {
      rmdirSync(projectPath, { recursive: true });
      console.log(`\n🗑 Removed incomplete project folder: ${projectPath}`);
    } catch (err) {
      console.warn(`\n⚠️ Failed to remove folder: ${projectPath}`);
    }
  }
};

process.on("SIGINT", () => {
  cleanup();
  process.exit();
});

process.on("exit", () => {
  cleanup();
});

const emitter = degit("lucjastozek/ally-template");
await emitter.clone(projectPath);

didCreateFolder = true;

const pkgPath = path.join(projectPath, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.name = projectName.replace(/[^a-z0-9-_]/gi, "").toLowerCase();
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

const pmResponse = await prompts({
  type: "select",
  name: "pm",
  message: "Which package manager do you want to use?",
  choices: [
    { title: "Yarn", value: "yarn" },
    { title: "npm", value: "npm" },
    { title: "pnpm", value: "pnpm" },
  ],
  initial: 0,
});

let packageManager = pmResponse.pm || "npm";

try {
  execSync(`${packageManager} --version`, { stdio: "ignore" });
} catch {
  console.error(
    `❌ ${packageManager} not found. Make sure that ${packageManager} is installed or use another one.`
  );
  process.exit(1);
}

if (
  packageManager !== "yarn" &&
  existsSync(path.join(projectPath, "yarn.lock"))
) {
  unlinkSync(path.join(projectPath, "yarn.lock"));
}

try {
  console.log(`📦 Installing dependencies with ${packageManager}...`);
  execSync(`${packageManager} install`, { cwd: projectPath, stdio: "inherit" });
} catch (err) {
  console.error(`❌ Failed to install dependencies with ${packageManager}.`);
  process.exit(1);
}

try {
  execSync("git init", { cwd: projectPath, stdio: "inherit" });
  execSync("git add .", { cwd: projectPath, stdio: "inherit" });
  execSync('git commit -m "Initial commit" --quiet', {
    cwd: projectPath,
    stdio: "inherit",
  });
  console.log("✅ Git repo initialized!");
} catch (err) {
  console.warn("⚠️ Git initialization failed. Is git installed?");
}

console.log(`✅ Done! cd ${projectName} && ${packageManager} start`);
finished = true;
