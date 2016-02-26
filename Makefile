SHELL := /bin/zsh

src_files := $(wildcard src/*.js)
lib_files := $(src_files:src/%.js=lib/%.js)

.PHONY: all clean link test

all: $(lib_files)

lib/%.js: src/%.js 
	@mkdir -p $(@D)
	babel $< > $@

clean:
	@rm -rf lib/

link:
	@npm link

test:
	@jasmine
