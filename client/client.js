Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
})

Session.setDefault('checklist_id', null)
Session.setDefault('editing_name', null)

var insertChecklist = function (name, user, entry) {
    entry = $.extend({
        name: name,
        user_id: user._id,
        time: Date.now()
    }, entry || {})
    return Checklists.insert(entry)
}

var insertTask = function (name, user, checklist, priority, entry) {
    entry = $.extend({
        name: name,
        user_id: user._id,
        list_id: checklist._id,
        priority: priority,
        time: Date.now()
    }, entry || {})
    return Tasks.insert(entry)
}

/*----------------------Sidebar----------------------*/
Template.sidebar.user = function () {
    return Meteor.user()
}

Template.sidebar.events({
    'click .checklist': function () {
        Session.set('checklist_id', this._id)
    }
})

/*----------------------UserData----------------------*/
Template.userdata.user = function () {
    return Meteor.user()
}

/*----------------------Checklists----------------------*/
Template.checklists.user = function () {
    return Meteor.user()
}

Template.checklists.events({
    'click #new-checklist': function () {
        var user = Meteor.user()
        var id = insertChecklist("New Checklist", user)
    },
    'click .checklist a': function () {
        Session.set('checklist_id', this._id || null)
    }
})

Template.checklists.lists = function () {
    var user = Meteor.user()
    if (user) return Checklists.find({user_id: user._id, name: {$ne: 'Unassigned'}})
    return []
}

/*----------------------EditPanel----------------------*/
Template.editpanel.user = function () {
    return Meteor.user()
}

Template.editpanel.checklist = function () {
    var id = Session.get('checklist_id')
    var user = Meteor.user()
    var checklist = null
    if (id) {
        checklist = Checklists.findOne({_id: id})
    } else if (id == null) {
        checklist = Checklists.findOne({name: 'Unassigned', user_id: user._id})
        if (!checklist) {
            Session.set('checklist_id', insertChecklist("Unassigned", user, {default: true}))
            return arguments.callee.apply(this, arguments)
        } else {
            Session.set('checklist_id', checklist._id)
        }
    }
    if (checklist) {
        checklist.date = Facade.formatTimeToDate(checklist.time)
        checklist.user = Meteor.users.findOne({_id: checklist.user_id})

        checklist.tasks = Tasks.find({list_id: checklist._id}).map(function(task) {
            task.date = Facade.formatTimeToDate(task.time)
            task.priorityCaption = TaskPriority.caption(task.priority)
            return task
        })

    }
    return checklist
}

Template.editpanel.editable = function () {
    var id = Session.get('checklist_id')
    var checklist = Checklists.findOne({_id: id})
    return !checklist.default
}

Template.editpanel.editingName = function () {
    return Session.get('editing_name')
}

Template.editpanel.events({
    'dblclick .row h3': function (evt, tmpl) {
        if (Template.editpanel.editable()) {
            Session.set('editing_name', true)
            Deps.flush()
            $(tmpl.find('#editing_itemname')).activate()
        }
    },
    'click #new-task': function () {
        var id = Session.get('checklist_id')
        var user = Meteor.user()
        var checklist = Checklists.findOne({_id: id})
        insertTask('New Task', user, checklist, TaskPriority.Medium)
    },
    'click .task': function() {
        console.log('Edit task ' + this.name + ' id: ' + this._id)
    }
})

Template.editpanel.events(Events.acceptCancel('#editing_itemname', {
    accept: function (value) {
        var id = Session.get('checklist_id')
        Checklists.update(id, {$set: {name: value}});
    },
    always: function () {
        Session.set('editing_name', false)
    }
}))