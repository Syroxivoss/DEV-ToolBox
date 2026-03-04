#!/usr/bin/env node

function usage() {
  console.error(
    [
      "Usage:",
      '  node main.mjs --mode encode --input "hello"',
      '  node main.mjs --mode decode --input "aGVsbG8="',
      "",
      "Flags:",
      "  --mode encode|decode   (default: encode)",
      "  --input <text>         Optional; if omitted, reads from stdin",
      "  --url                  Use URL-safe base64 format",
      "  --help                 Show this help",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const opts = { mode: "encode", input: null, url: false, help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--url") {
      opts.url = true;
      continue;
    }
    if (arg === "--mode" && i + 1 < argv.length) {
      opts.mode = argv[++i];
      continue;
    }
    if (arg.startsWith("--mode=")) {
      opts.mode = arg.slice("--mode=".length);
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

function normalizeDecodeInput(value, urlSafe) {
  const trimmed = value.trim();

  if (trimmed === "") {
    return "";
  }

  if (urlSafe) {
    if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
      throw new Error("Invalid base64url input.");
    }
    return trimmed;
  }

  if (trimmed.length % 4 !== 0) {
    throw new Error("Invalid base64 input length.");
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) {
    throw new Error("Invalid base64 input.");
  }

  return trimmed;
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

  const mode = opts.mode.toLowerCase();
  if (mode !== "encode" && mode !== "decode") {
    console.error('Error: --mode must be "encode" or "decode".');
    process.exit(1);
  }

  let input;
  try {
    input = await readInput(opts.input);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  try {
    if (mode === "encode") {
      const encoded = opts.url
        ? Buffer.from(input, "utf8").toString("base64url")
        : Buffer.from(input, "utf8").toString("base64");
      console.log(encoded);
      return;
    }

    const normalized = normalizeDecodeInput(input, opts.url);
    const decoded = opts.url
      ? Buffer.from(normalized, "base64url").toString("utf8")
      : Buffer.from(normalized, "base64").toString("utf8");
    console.log(decoded);
  } catch (err) {
    console.error(`Decode error: ${err.message}`);
    process.exit(1);
  }
}

main();
