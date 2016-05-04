src_files := $(wildcard src/*.js)
lib_files := $(src_files:src/%.js=lib/%.js)

.PHONY: all check clean lint test

all: $(lib_files) doc/config.json

doc/%.json: doc/%.cjson
	@echo "Generating $@..."
	@sed '/^[[:space:]]*\/\//d;/^$$/d' $< > $@

lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< > $@

check:
	@npm outdated

clean:
	@rm -rf lib/ coverage/ doc/config.json

lint:
	@eslint $(src_files)

test: $(lib_files)
	@istanbul cover -x "**/spec/**" jasmine
