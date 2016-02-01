Template.user.rendered = function() {
    Meteor.call('findUserByHid', Template.instance().data.hid, function(err, data) {
      if (err)
        console.log(err);
        console.log(data);
      Session.set('u', data);
    });
}

Template.user.helpers({
    user: function() {
        return Session.get('u');
    }
});

Template.user.events({

});
