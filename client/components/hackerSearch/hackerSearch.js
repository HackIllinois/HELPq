var filters = {
    all: {}
    ,
    hacker: {
        'profile.mentor': {
            $in: [true, null]
        },
        'profile.admin': {
            $in: [false, null]
        }
    },
    sponsor: {
        'profile.sponsor' : false
    },
    mentor: {
        'profile.mentor': true
    },
    admin: {
        'profile.admin': false
    }
};

Template.hackerSearch.onCreated(function(){
    this.searchText = new ReactiveVar();
    this.filter = new ReactiveVar({});
    this.modal = new ReactiveVar();

    this.subscribe("allUsers");
});

Template.hackerSearch.rendered = function(){
    $(this.find('.ui.dropdown')).dropdown();
};

Template.hackerSearch.helpers({
    filter: function(){
        return Template.instance().filter.get();
    },
    resume: function(){
        if (this.profile.resume != null) {
            return true;
        }
        return false;
    },
    searchText: function() {
        return Template.instance().searchText.get();
    },
    github: function(){
        if (this.profile.github_url != null) {
            return (this.profile.github_url).substr(this.profile.github_url.lastIndexOf('/') + 1);;
        }
    },
    users: function(){
        var t = Template.instance();
        var users = Meteor.users.find(
            t.filter.get()
            , {
                sort: {
                    createdAt: 1
                }
            }).fetch();
            return filterBySearchText(users, t.searchText.get());
        }
    });

    Template.hackerSearch.events({
        'click .toggle-sponsor': function(){
            Meteor.call("toggleRole", "sponsor", this._id);
        },
        'click .toggle-mentor': function(){
            Meteor.call("toggleRole", "mentor", this._id);
        },
        'click .toggle-admin': function(){
            if (this._id === Meteor.userId()){
                if (confirm('Are you sure you would like to remove your admin privileges?')){
                    Meteor.call("toggleRole", "admin", this._id);
                }
            } else {
                Meteor.call("toggleRole", "admin", this._id);
            }
        },
        'keyup .searchText': function(e, t){
            var currentValue=t.find(".searchText").value;
            t.searchText.set(currentValue);
        },
        'click .filter': function(e, t){
            var filter = filters[e.target.getAttribute('data-filter')];
            t.filter.set(filter);
        },
        'click .info-user.button': function(e, t){
            t.modal.set(Blaze.renderWithData(
                Template.userInfo,
                this,
                $('.info-user.modal .content').get(0)));

                // Semantic-UI wants to remove the modal from the template and add it
                // to a page dimmer.
                // Modal needs to be detachable, so that it is not removed
                // from the template and pile up in the body.
                $('.ui.info-user.modal')
                .modal({
                    'detachable': false,
                    'closable': false
                })
                .modal('show');
            },
            'click .info-user.modal .close': function(e, t){
                Blaze.remove(t.modal.get());
            }
        });

        function filterBySearchText(users, searchText){
            return users.filter(function(user){
                if (!searchText) return true;
                return JSON.stringify(user).toLowerCase().indexOf(searchText.toLowerCase()) > -1;
            })
        }
