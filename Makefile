BIN         = ./node_modules/.bin
PATH       := $(BIN):$(PATH)
LIB         = $(shell find lib -name "*.js")
DIST        = $(patsubst lib/%.js,dist/%.js,$(LIB))

MOCHA_ARGS  = --require mocha-clean
MOCHA_DEV   = $(MOCHA_ARGS) --require lib/__tests__/babelinit ./lib/__tests__/*.test.js
MOCHA_DIST  = $(MOCHA_ARGS) ./dist/__tests__/*.test.js

dist: $(DIST)
dist/%.js: lib/%.js
	@mkdir -p $(@D)
	$(BIN)/babel $< -o $@ --stage 0

clean:
	@rm -rf ./dist

build: test clean dist test-dist

test:
	@echo "\nTesting source files, hang on..."
	@$(BIN)/mocha $(MOCHA_DEV)

test-watch:
	@echo "\nStarting test watcher..."
	@$(BIN)/mocha $(MOCHA_DEV) --watch

test-dist:
	@echo "\nTesting build files, almost there..!"
	@$(BIN)/mocha $(MOCHA_ARGS)

example:
	@node ./example/server.js

.PHONY: install test test-dist test-watch example
