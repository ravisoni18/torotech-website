#!/usr/bin/env node
// Deploy torotech.ca: verify the build, push main, and follow the GitHub Actions "Deploy" run
// (.github/workflows/deploy.yml SSHes into the VPS and rebuilds the containers).
//
//   npm run deploy               push committed changes on main and watch the deploy
//   npm run deploy -- --redeploy re-run the deploy workflow without pushing anything new
//   npm run deploy -- --skip-build  skip the local typecheck/build (not recommended)
//
// Only committed work is deployed. Uncommitted or staged files are reported and left alone.
import { execSync, spawnSync } from "node:child_process";

const SITE = "https://torotech.ca";
const WORKFLOW = "deploy.yml";
const args = new Set(process.argv.slice(2));
const redeploy = args.has("--redeploy");
const skipBuild = args.has("--skip-build");

const sh = (cmd) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const run = (cmd, label) => {
  console.log(`\n▸ ${label}`);
  const r = spawnSync(cmd, { shell: true, stdio: "inherit" });
  if (r.status !== 0) fail(`${label} failed.`);
};
function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}
const has = (bin) => spawnSync(`command -v ${bin}`, { shell: true }).status === 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. Preconditions
const branch = sh("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") fail(`You're on "${branch}". Deploys go from main — switch to main first.`);

const dirty = sh("git status --porcelain");
if (dirty) {
  console.log("Not included in this deploy (uncommitted):");
  console.log(dirty.split("\n").map((l) => "  " + l).join("\n"));
}

run("git fetch --quiet origin main", "Fetching origin/main");
const behind = +sh("git rev-list --count HEAD..origin/main");
if (behind) fail(`origin/main has ${behind} commit(s) you don't have. Pull first: git pull --rebase origin main`);
const ahead = +sh("git rev-list --count origin/main..HEAD");

if (!ahead && !redeploy) {
  console.log("\nNothing new to deploy — main matches origin/main.");
  console.log("Commit your changes first, or use `npm run deploy -- --redeploy` to rebuild the server anyway.");
  process.exit(0);
}

// 2. Make sure what we ship builds
if (!skipBuild) {
  run("npm run typecheck", "Typecheck");
  run("npm run build", "Production build");
}

// 3. Ship
const sha = sh("git rev-parse HEAD");
const startedAt = new Date();
if (redeploy && !ahead) {
  if (!has("gh")) fail("--redeploy needs the GitHub CLI (gh). Install it, or re-run the workflow from GitHub Actions.");
  run(`gh workflow run ${WORKFLOW} --ref main`, "Triggering the Deploy workflow");
} else {
  console.log(`\nDeploying ${ahead} commit(s):`);
  console.log(sh("git log --oneline origin/main..HEAD").split("\n").map((l) => "  " + l).join("\n"));
  run("git push origin main", "Pushing to origin/main");
}

// 4. Follow the workflow run
if (!has("gh")) {
  console.log("\nPushed. Install the GitHub CLI (gh) to have this script follow the deploy; for now check GitHub → Actions → Deploy.");
  process.exit(0);
}
console.log("\n▸ Waiting for the Deploy run to start…");
let runId = "";
for (let i = 0; i < 30 && !runId; i++) {
  await sleep(3000);
  try {
    const runs = JSON.parse(sh(`gh run list --workflow ${WORKFLOW} --branch main --limit 5 --json databaseId,headSha,createdAt`));
    const match = runs.find((r) => r.headSha === sha && new Date(r.createdAt) >= new Date(startedAt.getTime() - 60_000));
    if (match) runId = String(match.databaseId);
  } catch {
    /* gh not authenticated yet, or API hiccup — keep polling */
  }
}
if (!runId) fail("Couldn't find the Deploy run. Check GitHub → Actions → Deploy.");

const watch = spawnSync(`gh run watch ${runId} --exit-status --interval 5`, { shell: true, stdio: "inherit" });
if (watch.status !== 0) fail(`Deploy run ${runId} failed — see: gh run view ${runId} --log-failed`);

// 5. Smoke-check the live site
console.log("\n▸ Checking the live site");
let ok = false;
for (let i = 0; i < 10 && !ok; i++) {
  try {
    const res = await fetch(SITE, { redirect: "follow" });
    ok = res.ok;
    if (!ok) await sleep(3000);
  } catch {
    await sleep(3000);
  }
}
if (!ok) fail(`${SITE} isn't responding with 200 after the deploy. Check the server: docker compose logs -f web`);
console.log(`\n✓ Deployed ${sha.slice(0, 7)} — ${SITE} is up.`);
