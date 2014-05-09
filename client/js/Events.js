Events = {
    acceptCancel: function (selector, callbacks) {
        var accept = callbacks.accept || this.void
        var cancel = callbacks.cancel || this.void
        var always = callbacks.always || this.void

        var events = {}
        events['keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector] =
            function (evt) {
                if (evt.type === "keydown" && evt.which === 27) {
                    cancel.call(this, evt)
                    always.call(this, evt.target.value, evt)
                } else if (evt.type === "focusout" || (evt.type === "keyup" && evt.which === 13)) {
                    if (!evt.target.value) cancel.call(this, evt)
                    else accept.call(this, evt.target.value, evt)
                    always.call(this, evt.target.value, evt)
                }
            }

        return events
    },
    void: function () {
        console.log('void')
    }
}