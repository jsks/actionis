module.exports = {
    clone: obj => JSON.parse(JSON.stringify(obj)),
    date: str => {
        const d = (str) ? new Date(str) : new Date()
        d.setHours(0, 0, 0, 0)
        return d
    }
}
