Template.userInfo.created = function() {
    var skills = this.data.profile.skills ? this.data.profile.skills : [];

    this.skills = new ReactiveVar(skills);
    this.success = new ReactiveVar();
    this.error = new ReactiveVar();
};
Template.userInfo.helpers({
    github: function() {
        if (this.profile.github_url != null) {
            return (this.profile.github_url).substr(this.profile.github_url.lastIndexOf('/') + 1);
        }
    },
    linkedInExists: function(){
        if (this.profile.linkedin_url != null) {
            return true;
        }
        return false;
    },
    githubExists: function(){
        if (this.profile.github_url != null) {
            return true;
        }
        return false;
    },
    siteExists: function(){
        if (this.profile.site_url != null) {
            return true;
        }
        return false;
    },
    phone: function() {
        if (this.profile.phone != null) {
            return true;
        }
        return false;
    },
    company: function() {
        if (this.profile.company != null) {
            return true;
        }
        return false;
    },
    skills: function() {
        return Template.instance().skills.get().map(function(skill, idx) {
            return {
                index: idx,
                skill: skill
            }
        });
    },
    opensource: function() {
        if (this.profile.open_source_interests != null) {
            return true;
        }
        return false;
    },
    os_projects: function() {
        return Template.instance().open_source_interests.get().map(function(project, idx) {
            return {
                index: idx,
                project: project
            }
        });
    },
    resume: function(){
        if (this.profile.resume != null) {
            return true;
        }
        return false;
    }

});

Template.userInfo.events({
    'click .delete.skill': function(e, t) {
        removeSkill(e, t);
    },
    "keyup input[name='skills']": function(e, t) {
        if (e.keyCode === 13) {
            addSkill(e, t)
        }
    },
    'click .add-skill': addSkill,
    'click .save.button': function(e, t) {
        var profile = {};

        // Get the profile inputs
        // Look in this template only
        $(t.firstNode).find('input.profile').each(function(idx, el) {
            var $el = $(el);
            profile[$el.attr('name')] = $el.val();
        });

        // Get the skills
        profile['skills'] = t.skills.get();

        Meteor.call("updateUser", t.data._id, profile, function(err) {
            if (err) {
                t.error.set(err);
                setTimeout(function() {
                    t.error.set(false);
                }, 5000)
            } else {
                t.success.set(true);
                setTimeout(function() {
                    t.success.set(false);
                }, 5000);
            }
        });
    }
});

function removeSkill(e, t) {
    var skills = t.skills.get();
    var idx = e.target.getAttribute('data-index');
    skills.splice(idx, 1);
    t.skills.set(skills);
}

function addSkill(e, t) {
    var $skillsInput = $("input[name='skills']");
    var skills = t.skills.get();
    if (skills.indexOf($skillsInput.val().toLowerCase()) < 0) {
        skills.push($skillsInput.val().toLowerCase());
        t.skills.set(skills);
    }
    $skillsInput.val("");
}
