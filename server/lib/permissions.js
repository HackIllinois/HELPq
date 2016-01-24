// ----------------------------------------
// Basic Roles, Client side auth
// ----------------------------------------

// Admin have all rights
authorized = {
  user: function(id){
    var user = _getUser(id);
    return user ? true : false;
  },
  sponsor: function(id){
    var user = _getUser(id);
    console.log("hihhish");
    return user ? true : false;
  },
  admin: function(id){
    var user = _getUser(id);
    return user.profile.admin
  },
  mentor: function(id){
    var user = _getUser(id);
    return user.profile.admin || user.profile.mentor
  }
};
