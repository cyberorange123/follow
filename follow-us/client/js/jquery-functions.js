jQuery.fn.activate = function() {
    if ($(this).is(':input')) {
        this.focus()
        this.select()
    }
}