// Startup Functions
Meteor.startup(function(){
    // Grab the config
    var config = JSON.parse(Assets.getText('config.json'));

    // Create the admin
    createAdmin(config.admin.username, config.admin.password);

    // Clear Service integrations
    ServiceConfiguration.configurations.remove({});

    // Add Service Integrations
    addServiceIntegration('github', config.github);
    addFacebookIntegration(config.facebook);
    addServiceIntegration('google', config.google);

    // Add Base Settings
    setBasicSettings(config);

    Accounts.onCreateUser(function(options, user){
        if (options.profile){
            user.profile = options.profile;

            if (config.defaultMentor){
                user.profile.mentor = true;
            }
        }

        return user;
    });

    var Twit = Meteor.npmRequire('twit');
    var Fiber = Meteor.npmRequire('fiber');
    var T = new Twit(config.twitter);

    Tweets.remove({})

    T.get('search/tweets', { q: 'hackillinois since:2016-1-1' }, Meteor.bindEnvironment( function(err, data, response) {
        tweets = data.statuses;
        for (t in tweets) {
            Tweets.insert(tweets[t]);
        }
    }));

    var streamHashtag = T.stream('statuses/filter', { track: '#hackillinois', language: 'en' })

    streamHashtag.on('tweet',  Meteor.bindEnvironment(function (tweet) {
        insertTweet(tweet);
    }));
    var streamHI = T.stream('statuses/filter', { track: 'hackillinois', language: 'en' })

    streamHI.on('tweet',  Meteor.bindEnvironment(function (tweet) {
        insertTweet(tweet);
    }));
    var streamUser = T.stream('statuses/filter', { track: '@hackillinois', language: 'en' })

    streamUser.on('tweet',  Meteor.bindEnvironment(function (tweet) {
        insertTweet(tweet);
    }));
});

function createAdmin(username, password){
    var user = Meteor.users.findOne({
        username: username
    });

    if (!user){
        Accounts.createUser({
            username: username,
            password: password,
            profile: {
                name: 'Admin'
            }
        });
    }

    Meteor.users.update({
        username: username
    },{
        $set:
        {
            'profile.admin': true
        }
    })
}

function addServiceIntegration(service, config){
    if (config.enable){
        ServiceConfiguration.configurations.upsert({
            service: service
        },{
            $set: {
                clientId: config.clientId,
                secret: config.secret
            }
        });
    }
}

function addFacebookIntegration(fb){
    if (fb.enable){
        ServiceConfiguration.configurations.upsert({
            service: 'facebook'
        },{
            $set: {
                appId: fb.appId,
                secret: fb.secret
            }
        });
    }
}

function setBasicSettings(config){
    // Check if the settings document already exists
    var settings = Settings.find({}).fetch();
    if (settings.length == 0 || settings.length > 1){
        // Remove all documents and then create the singular settings document.
        Settings.remove({});
        Settings.insert(config.settings);
    }
}

function insertTweet(tweet) {
    Tweets.insert(tweet);
    _log("Tweet by " + tweet.user.screen_name + " inserted");
}
