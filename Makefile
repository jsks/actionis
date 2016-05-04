src_files := $(wildcard src/*.js)
lib_files := $(src_files:src/%.js=lib/%.js)
config    := doc/config.json
man				:= doc/actionis.1

.PHONY: all check clean lint test

all: $(lib_files) $(config) $(man)

doc/%.1: doc/%.1.md
	pandoc $< -S -s -t man -o $@

doc/%.json: doc/%.cjson
	@echo "Generating $@..."
	@sed '/^[[:space:]]*\/\//d;/^$$/d' $< > $@

lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< > $@

check:
	@npm outdated

clean:
	@rm -rf lib/ coverage/ doc/*.{json,1}

lint:
	@eslint $(src_files)

test: $(lib_files)
	@istanbul cover -x "**/spec/**" jasmine
