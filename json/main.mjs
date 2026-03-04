#!/usr/bin/env node

function usage() {
  console.error(
    [
      "Usage:",
      '  node main.mjs --input "{\\"a\\":1}"',
      '  echo "{\\"a\\":1}" | node main.mjs',
      "",
      "Flags:",
      "  --input <json>    Optional; if omitted, reads from stdin",
      "  --minify          Output minified JSON",
      "  --help            Show this help",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const opts = { input: null, minify: false, help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--minify") {
      opts.minify = true;
      continue;
    }
    if (arg === "--input" && i + 1 < argv.length) {
      opts.input = argv[++i];
      continue;
    }
    if (arg.startsWith("--input=")) {
      opts.input = arg.slice("--input=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return opts;
}

async function readInput(flagValue) {
  if (flagValue !== null) {
    return flagValue;
  }

  if (process.stdin.isTTY) {
    throw new Error("No input provided. Use --input or pipe stdin.");
  }

  let data = "";
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    usage();
    process.exit(1);
  }

  if (opts.help) {
    usage();
    return;
  }

  let input;
  try {
    input = await readInput(opts.input);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  try {
    const parsed = JSON.parse(input);
    const output = opts.minify
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, 2);
    console.log(output);
  } catch (err) {
    console.error(`Invalid JSON: ${err.message}`);
    process.exit(1);
  }
}

main();
