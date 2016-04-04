---
title: "Weekly Report"
output: 
  html_document:
    theme: paper
    fig_caption: false
---

<style type="text/css">
h2 {
    text-align: left;
}

body {
    text-align: center;
}

.tags {
    column-count: 2;
    -moz-column-count: 2;
    -webkit-column-count: 2;
}

.tags img {
    width: 75%;
    height: auto;
}

.summary {
    text-align: left;
}

.graph {
    text-align: center;
}
</style>


```{r, echo=F}
library(dplyr, warn.conflicts = F)
library(ggplot2)
library(jsonlite, quietly=T)
library(rmarkdown)
options(digits.sec = 3)

convert_date <- function(n) {
    as.POSIXct(n / 1000, origin = "1970-01-01")
}

msToHrs <- function(n) {
    n / 1000 / 60 / 60
}

l <- fromJSON(readLines("~/Dropbox/share/actionis-log.json"))
l$queue <- NULL

data.df <- lapply(1:length(l), function(i) {
    mutate(l[[i]], date = as.numeric(names(l)[i]) %>% convert_date %>% as.Date,
                   duration = msToHrs(duration) %>% signif(., digits = 3),
                   start = convert_date(start),
                   stop = convert_date(stop))
}) %>% 
    bind_rows %>% 
    arrange(date) %>% 
    filter((Sys.Date() - 7) < date & date <= Sys.Date() )

tags <- unlist(data.df$tags) %>% unique
hrs <- sum(data.df$duration)
total_hrs <- nrow(data.df) * 15
```

## Top Entries

```{r, echo=F}
library(pander)
select(data.df, date, start, stop, duration, activity, tags) %>%
    mutate(start = strftime(start, "%H.%M"),
           stop = strftime(stop, "%H.%M")) %>%
    pander(style="rmarkdown")
```

## Top Tags

<div class="tags">
```{r, echo=F}
# This is embarrasing
tags_totals.df <- data.df %>% rowwise() %>% do({
    tags <- unlist(.$tags)
    lapply(1:length(tags), function(i) {
        l <- rep(.)
        l$tags <- tags[i]
        l
    }) %>% bind_rows
}) %>% 
    ungroup %>%
    group_by(tags) %>%
    summarise(total = sum(duration)) %>%
    arrange(total)

ggplot(tags_totals.df, aes("", total, fill = factor(tags))) + 
    geom_bar(width = 1, stat = "identity") + 
    coord_polar("y") +
    theme(panel.background = element_rect(fill = "transparent", color=NA),
          legend.title = element_blank(), 
          legend.text = element_text(size=20), axis.title = element_blank(),
          axis.text = element_blank(), axis.ticks = element_blank())
```

`r pander(tail(tags_totals.df, 5))`
</div>

## Summary { .summary }

    - Activities: `r nrow(data.df)`
    - Tags: `r sapply(data.df$tags, length) %>% sum`
    - Hours Logged: `r hrs`/`r total_hrs`
    - Coverage: `r signif(hrs / total_hrs * 100, digits=4)`%

<div class="graph">
```{r, echo=F}
ggplot(data = data.df, aes(date, duration)) + 
    geom_bar(stat = "identity", show.legend = F) + 
    ylim(0, 16)
```
</div>
