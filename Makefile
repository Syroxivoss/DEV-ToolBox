.PHONY: build

build:
	cd base64 && npm run build
	cd hash && python -m py_compile main.py
	cd json && npm run build
	cd password && go build .
	cd timestamp && python -m py_compile main.py
	cd uuid && go build .
