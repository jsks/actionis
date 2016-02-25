#!/bin/zsh

mkdir lib 2>/dev/null

case ${(L)1} in
    ("all"|"clean")
        rm lib/*.js(N) 2>/dev/null ;|
    ("clean")
        exit;;
esac

for i in src/*.js; do
    out_file="lib/${i:t}"
    if [[ ! -f $out_file || $i -nt $out_file ]]; then
        print "Transpiling $i"
        babel $i > $out_file
    fi
done
