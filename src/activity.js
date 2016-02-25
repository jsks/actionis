'use strict'

module.exports = function(data) {
    if (!data)
        data = {}

    function add(time, entry) {
        if (!data[time])
            data[time] = []

        entry.timestamp = Date.now()
        data[time].push(entry)

        data[time] = data[time].sort((a, b) => {
            return (a.start > b.start) ? -1 : 1
        })
    }

    function rm(time, index) {
        if (data[time])
            data[time].splice(index - 1, 1)
    }

    function print(time) {
       if (data[time] && data[time].length > 0) {
           console.log('   time\t\tduration\tactivity')
           data[time].forEach((n, i) => {
               const d = (n.duration / (1000 * 60 * 60)).toFixed(2)
               console.log(`${++i}) ${n.start}-${n.stop}\t${d} hrs\t${n.activity}`)
            })
        }
    }

    return { add, 
             rm, 
             print, 
             get data() { 
                 return JSON.stringify(data) 
             }
    }
}
