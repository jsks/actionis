#!/bin/zsh
# $1 -> email address to mail html report to

setopt err_return

if [[ -z $1 ]]; then
    print "No recipient."
    print "USAGE: ./actionis-report <email address>"
    exit 1
fi

OUTPUT=$(mktemp /tmp/report-XXXX.html)

Rscript -e "rmarkdown::render(\"${0:A:h}/../R/report.Rmd\", output_file=\"$OUTPUT\", intermediates_dir=\"/tmp\", quiet=T)"
print "Attached.\n\nBest,\nactionis" | mutt -s "Actionis: Weekly Report" -a $OUTPUT -- $1
rm $OUTPUT
