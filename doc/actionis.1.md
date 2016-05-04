% Actionis(1) | Version 0.3.0

# NAME
Actionis - cli activity log

# SYNOPSIS
`actionis` cmd [@date] [/time/] [activity|index] [+tags]

# DESCRIPTION

Logs activities according to a provided start and stop time for a specified
date. Entries can also include tags to easily search across dates. Options are
mostly specified through string formatting.

# OPTIONS
 **-c**, **--config**    
 : Specify the location of a configuration file (default:
 ~/.config/actionis/config.json)

## Commands
*add*
:   Add an activity to the log for a specificied date

*dates*
:   Output all dates for which there is an entry in the log

*print*
:   Output list of activities for a given date(s) and/or tag(s)

*queue*
:   Commands to manipulate queue

*rm*
:   Remove one or more activity from the log

*summarise*
:   Output summary for given date range

*tags*
:   Output tags for given date(s)

## Queue Subcommands
`Queue` allows the user to start timing an activity. With no subcommand, the default is to add a task to the queue stack (f.i.f.o.). Otherwise, the following subcommands are available.

*pop*
:   Remove from queue and add to normal log. Can optionally provide activity,
tail, and a stop time (by default, the stop time is the current time).

*print*
:   Print activities sitting in queue.

*clear*
:   Clear the entire queue.


# FORMAT
## Date
Dates are prefixed by a '@'. Ranges can be included using brackets (ex. @[3/24
- 3/27]). The strings 'today', 'yesterday', and the days of the week (ex:
'thursday', 'friday') will be expanded to their respective dates. The string
'all' expands to every single date in the log. Default: today's date.

## Time
Times are deliminated by '/' and can include a range to specify start and stop.

## Tags
Tags are prefixed by '+' and separated by space (ex. +hiking +exercise).

# EXAMPLES

$ actionis add @yesterday /13.10-14.23/ finished actionis summary function +programming

$ actionis print +programming

$ actionis rm @yesterday 1

$ actionis queue

$ actionis queue pop finished help.txt +programming

$ actionis print @all
