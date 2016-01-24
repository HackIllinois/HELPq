// Admin have all rights
window.authorized = {
  user: function(){
    return Meteor.userId() ? true : false;
  },
  sponsor: function(){
    return Meteor.userId() && Meteor.user().profile.sponsor;
  },
  admin: function(){
    return Meteor.user() && Meteor.user().profile.admin;
  },
  mentor: function(){
    return Meteor.user() && Meteor.user().profile.mentor;
  }
};
