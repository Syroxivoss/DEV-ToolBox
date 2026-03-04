#!/usr/bin/env python3

import argparse
import hashlib
import sys


def read_input(flag_value: str | None) -> str:
    if flag_value is not None:
        return flag_value
    if not sys.stdin.isatty():
        return sys.stdin.read()
    raise ValueError("No input provided. Use --input or pipe stdin.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate text hashes.")
    parser.add_argument(
        "--algo",
        default="sha256",
        choices=["md5", "sha1", "sha256", "sha384", "sha512"],
        help="Hash algorithm",
    )
    parser.add_argument("--input", help="Text to hash")
    args = parser.parse_args()

    try:
        text = read_input(args.input)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)

    digest = hashlib.new(args.algo)
    digest.update(text.encode("utf-8"))
    print(digest.hexdigest())


if __name__ == "__main__":
    main()
