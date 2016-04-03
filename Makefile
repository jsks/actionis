src_files := $(wildcard src/*.js)
lib_files := $(src_files:src/%.js=lib/%.js)

.PHONY: all clean lint test

all: $(lib_files)

lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< > $@

clean:
	@rm -rf lib/

lint: 
	@eslint $(src_files)

test: $(lib_files)
	@istanbul cover -x "**/spec/**" jasmine
