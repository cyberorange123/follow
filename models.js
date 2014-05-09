Tasks = new Meteor.Collection('tasks')
Checklists = new Meteor.Collection('checklists')

TaskPriority = {
    Low: 1,
    Medium: 2,
    High: 3,
    Emergency: 4,
    caption: function (value) {
        for (var prop in this) {
            if (this[prop] === value) return prop
        }
    }
}