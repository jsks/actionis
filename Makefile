src_files := $(wildcard src/*.js)
lib_files := $(src_files:src/%.js=lib/%.js)

.PHONY: all clean test

all: $(lib_files)

lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< > $@

clean:
	@rm -rf lib/

test:
	@istanbul cover -x "**/spec/**" jasmine
