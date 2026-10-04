/**
 * Data sync guard: the generated summary modules (service-summary.ts,
 * answer-page-summary.ts, guide-summary.ts) must exactly match the full
 * content modules. Run `bun scripts/gen-data-summaries.mjs` for a check or
 * `--write` to regenerate. This test is the CI-facing version of that check.
 *
 * Usage: bun scripts/test-data-sync.mjs
 */
import { execSync } from "node:child_process";

let pass = true;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) pass = false;
}

try {
  execSync("bun scripts/gen-data-summaries.mjs", { stdio: "pipe" });
  check("Summary modules in sync with detail modules (services, answers, guides)", true);
} catch (err) {
  console.error(String(err.stdout ?? ""));
  check("Summary modules in sync with detail modules (services, answers, guides) — run `bun scripts/gen-data-summaries.mjs --write`", false);
}

process.exit(pass ? 0 : 1);
