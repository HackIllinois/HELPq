Template.schedule.helpers({
  events: function(){
    console.log(Events.findOne({}));
    console.log(Events.find({}));
    return Events.find({}, {sort: {timestamp: -1}});
  },

  time: function(){
    return moment(this.timestamp).format('MMMM Do YYYY, h:mm a');
  }
});
