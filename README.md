# Dev Toolbox (CLI Tools)

A collection of useful command line tools for developers.

## Tools Included

- base64 encoder / decoder
- hash generator
- json formatter
- password generator
- timestamp converter
- uuid generator

## Language Table

| Language | Why it fits | Tools |
| --- | --- | --- |
| Go | Fast, portable compiled CLI, strong stdlib for crypto/random | `password`, `uuid` |
| Node.js (ESM) | Great string/JSON handling and fast scripting workflow | `base64`, `json` |
| Python | Excellent stdlib for hashing and datetime parsing | `hash`, `timestamp` |

## Tool Matrix

| Tool | Folder | Language | Entry point |
| --- | --- | --- | --- |
| Base64 Encoder/Decoder | `base64` | Node.js | `base64/main.mjs` |
| Hash Generator | `hash` | Python | `hash/main.py` |
| JSON Formatter | `json` | Node.js | `json/main.mjs` |
| Password Generator | `password` | Go | `password/main.go` |
| Timestamp Converter | `timestamp` | Python | `timestamp/main.py` |
| UUID Generator | `uuid` | Go | `uuid/main.go` |

## Requirements

- Go 1.26+
- Node.js 24+
- Python 3.10+
- `make` (optional but recommended)

## Build All Tools

```bash
make build
```

If `make` is not installed, run manually:

```bash
cd base64 && npm run build
cd ..\hash && python -m py_compile main.py
cd ..\json && npm run build
cd ..\password && go build .
cd ..\timestamp && python -m py_compile main.py
cd ..\uuid && go build .
```

## Run Each Tool (One by One)

### 1. base64

Show help:
```bash
node ./base64/main.mjs --help
```

Encode:
```bash
node ./base64/main.mjs --mode encode --input "hello"
```

Decode:
```bash
node ./base64/main.mjs --mode decode --input "aGVsbG8="
```

URL-safe encode:
```bash
node ./base64/main.mjs --mode encode --url --input "hello"
```

### 2. hash

Show help:
```bash
python ./hash/main.py --help
```

SHA-256:
```bash
python ./hash/main.py --algo sha256 --input "hello"
```

From stdin:
```bash
echo hello | python ./hash/main.py --algo sha512
```

### 3. json

Show help:
```bash
node ./json/main.mjs --help
```

Format:
```bash
node ./json/main.mjs --input "{\"name\":\"codex\",\"ok\":true}"
```

Minify:
```bash
node ./json/main.mjs --minify --input "{\"name\":\"codex\",\"ok\":true}"
```

From stdin:
```bash
echo "{\"name\":\"codex\"}" | node ./json/main.mjs
```

### 4. password

Show help:
```bash
cd password && go run . -h
```

Generate strong password:
```bash
cd password && go run . -length 20 -upper=true -lower=true -digits=true -symbols=true
```

No symbols:
```bash
cd password && go run . -length 16 -symbols=false
```

### 5. timestamp

Show help:
```bash
python ./timestamp/main.py --help
```

Unix to date:
```bash
python ./timestamp/main.py --unix 1711022400
```

Date to unix:
```bash
python ./timestamp/main.py --date "2024-03-21 12:00:00"
```

Custom date layout:
```bash
python ./timestamp/main.py --date "21/03/2024 12:00:00" --layout "%d/%m/%Y %H:%M:%S"
```

### 6. uuid

Show help:
```bash
cd uuid && go run . -h
```

Generate 3 UUIDs:
```bash
cd uuid && go run . -count 3
```

## Notes

- `.exe` files are ignored via `.gitignore`.
- Python cache and `node_modules` are also ignored.
