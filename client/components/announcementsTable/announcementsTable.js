Template.announcement.onCreated(function(){
  this.subscribe("allAnnouncements");
  //return Announcements.find({},{sort: {timestamp: -1}});
  Session.set('requestInProgress', true);
  this.announcements = Meteor.call('listAnnouncements');
});

Template.announcementsTable.helpers({
  time: function(){
    return moment(this.timestamp).format('MMMM Do YYYY, h:mm a');
  }
});

Template.announcementsTable.events({
  'click .close.icon': function(){
    Meteor.call('deleteAnnouncement', this._id);
  }
});
