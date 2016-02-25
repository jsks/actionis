#!/bin/zsh

mkdir lib 2>/dev/null
[[ ${(L)1} == "all" ]] && rm lib/*(N).js

for i in src/*.js; do
    out_file="lib/${i:t}"
    if [[ ! -f $out_file || $i -nt $out_file ]]; then
        print "Transpiling $i"
        babel $i > $out_file
    fi
done
