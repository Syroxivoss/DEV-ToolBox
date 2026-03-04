#!/usr/bin/env python3

import argparse
import sys
from datetime import datetime, timezone


def to_aware_local(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=datetime.now().astimezone().tzinfo)
    return dt


def parse_unix(value: str) -> datetime:
    trimmed = value.strip()
    raw = int(trimmed)
    digits = len(trimmed.lstrip("-"))
    millis = raw * 1000 if digits <= 10 else raw
    return datetime.fromtimestamp(millis / 1000, tz=timezone.utc)


def parse_date(value: str, layout: str | None) -> datetime:
    text = value.strip()

    if layout:
        return to_aware_local(datetime.strptime(text, layout))

    if text.endswith("Z"):
        text = f"{text[:-1]}+00:00"

    try:
        return to_aware_local(datetime.fromisoformat(text))
    except ValueError:
        pass

    layouts = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%d",
    ]
    for fmt in layouts:
        try:
            return to_aware_local(datetime.strptime(text, fmt))
        except ValueError:
            continue

    raise ValueError("Date could not be parsed.")


def print_report(dt: datetime) -> None:
    utc = dt.astimezone(timezone.utc)
    local = dt.astimezone()
    unix_seconds = int(dt.timestamp())
    unix_millis = int(dt.timestamp() * 1000)

    print(f"UTC: {utc.isoformat().replace('+00:00', 'Z')}")
    print(f"Local: {local.strftime('%Y-%m-%d %H:%M:%S %Z')}")
    print(f"Unix(s): {unix_seconds}")
    print(f"Unix(ms): {unix_millis}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert timestamps and dates.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--unix", help="Unix timestamp (seconds or milliseconds)")
    group.add_argument("--date", help="Date text to convert")
    parser.add_argument("--layout", help="Custom datetime layout for --date")
    args = parser.parse_args()

    try:
        if args.unix is not None:
            dt = parse_unix(args.unix)
        elif args.date is not None:
            dt = parse_date(args.date, args.layout)
        else:
            dt = datetime.now().astimezone()
    except (OverflowError, OSError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)

    print_report(dt)


if __name__ == "__main__":
    main()
