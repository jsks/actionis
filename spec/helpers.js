module.exports = {
    clone: obj => JSON.parse(JSON.stringify(obj)),
    date: date,
    today: date().getTime(),
    yesterday: date().setHours(-24)
}

function date(str) {
    const d = (str) ? new Date(str) : new Date()
    d.setHours(0, 0, 0, 0)

    return d
}
