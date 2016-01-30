// Collections
/**
 *
 * Ticket:
 *  {
 *     userId: STRING,
 *     name: STRING,
 *     imageUrl: STRING [optional]
 *     topic: STRING,
 *     location: STRING,
 *     contact: STRING,
 *     timestamp: Number (Milliseconds),
 *     status: STRING [OPEN, CLAIMED, COMPLETE, EXPIRED, CANCELLED],
 *     expiresAt: Number (Milliseconds)
 *     claimId: STRING
 *     claimName: STRING
 *     claimTime: Number (Milliseconds)
 *     completeTime: Number (Milliseconds)
 *     rating: NUMBER
 *     comments: STRING
 *  }
 *
 */
Tickets = new Mongo.Collection('tickets');

/**
 * Announcement:
 *  {
 *    userId: STRING,
  *   name: STRING,
  *   header: STRING,
  *   content: STRING,
  *   timestamp: Number (Milliseconds)
 *  }
 */
Announcements = new Mongo.Collection('announcements');

/**
 * Settings contain all of the information that can be edited on the client side.
 *
 * There is and should only be a single document.
 * {
 *  queueEnabled: BOOLEAN
 *  expirationDelay: Number (Milliseconds)
 * }
 */
Settings = new Mongo.Collection('settings');



Tweets = new Mongo.Collection('tweets');

 /**
  *
  * Events:
  *  {
  *     timestamp: Number (Milliseconds),
  *     event: STRING
  *     location: STRING
  *     room: STRING
  *   }
  */
 Events = new Mongo.Collection('events');

// ----------------------------------------
// Collection Permissions
// ----------------------------------------

Meteor.users.allow({
  // Update users, only if Admin
  update: function(userId, doc){
    var user = _getUser(userId);
    return user.profile.admin;
  }
});


// Currently, disable all direct modifications
Tickets.allow({
  insert: function () {
    // Don't fuck with the console, yo
    return false;
  },
  update: function () {
    // Only admin and mentors can modify tickets
    return false;
    // Enable below to allow client modifications
    //return Meteor.user().profile.admin || Meteor.user().profile.mentor;
  },
  remove: function () {
    // Only admin and mentors can remove tickets
    return false;
    // Enable below to allow client modifications
    //return Meteor.user().profile.admin || Meteor.user().profile.mentor;
  }
});

Announcements.allow({
  insert: function() {return false},
  update: function() {return false},
  remove: function() {return false}
});

Settings.allow({
  insert: function() {return false},
  update: function() {return false},
  remove: function() {return false}
});

Events.allow({
    insert: function() {return false},
    update: function() {return false},
    remove: function() {return false}
});
