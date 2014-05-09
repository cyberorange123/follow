Facade = {
    formatTimeToDate: function(time) {
        var date = (new Date(time)).toDateString()
        return date.substring(4, 10).toUpperCase() + ',' + date.substring(10)
    }
}