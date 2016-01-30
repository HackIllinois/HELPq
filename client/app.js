Tickets = new Mongo.Collection("tickets");
Announcements = new Mongo.Collection("announcements");
Settings = new Mongo.Collection("settings");
Tweets = new Mongo.Collection("tweets");
Events = new Mongo.Collection("events");

Meteor.subscribe("userData");

Meteor.subscribe("activeTickets");

Meteor.subscribe("allAnnouncements");

Meteor.subscribe("mentorsOnline");

Meteor.subscribe("settings");

Meteor.subscribe("tweets");

Meteor.subscribe("allEvents");
