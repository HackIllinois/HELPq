var requireLogin = function() {
  if (! Meteor.user()) {
   // If user is not logged in render landingpage
   this.render('splash');
 } else {
   //if user is logged in render whatever route was requested
   this.next();
 }
}

Router.onBeforeAction(requireLogin, {except: ['dashboard', 'forgot']});

Router.route('/', function(){
  this.layout('bannerLayout');
  this.render('home');
});

Router.route('/forgot', function(){
  this.render('forgot');
});

Router.route('/dashboard', function(){
    this.layout('bannerLayout');
    this.render('dashboard');
})

Router.route('/profile', function(){
  this.layout('bannerLayout');
  this.render('profile');
});

Router.route('/user/:hid', function(){
    this.layout('bannerLayout');
    this.render('user', {
        data: {
            hid: this.params.hid
        }
    });
});

Router.route('/sponsor', function(){
    this.layout('bannerLayout');
//    if (authorized.sponsor()){
        this.render('sponsor');
//    } else {
//        this.render('error', { data: { msg: "Your account cannot access these features!"}});
//    }
});

Router.route('/mentor', function(){
  this.layout('bannerLayout');
  if (authorized.mentor()){
    this.render('mentor');
  } else {
    this.render('error', { data: { msg: "You're not a mentor!" }});
  }
});

Router.route('/admin', function(){
  this.layout('bannerLayout');
  if (authorized.admin()){
    this.render('admin');
  } else {
    this.render('error', { data: { msg: "You're not an admin!" }});
  }
});
