#!/bin/zsh
# $1 -> email address to mail html report to

setopt err_return

if [[ -z $1 ]]; then
    print "No output file specified."
    print "USAGE: ./actionis-report <output html-file>"
    exit 1
fi

Rscript -e "rmarkdown::render(\"${0:A:h}/../R/report.Rmd\", output_file=\"$1\", quiet=T)"
