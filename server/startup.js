// Startup Functions
Meteor.startup(function() {
    BrowserPolicy.content.allowOriginForAll('meteor.local');
    BrowserPolicy.content.allowOriginForAll('hackillinoishelpq.meteor.org');
    BrowserPolicy.content.allowOriginForAll('hackillinois.org');
    BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
    BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');

    var config = JSON.parse(Assets.getText('config.json'));

    smtp = {
        username: config.email.username,   // eg: server@gentlenode.com
        password: config.email.password,   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.gmail.com',  // eg: mail.gandi.net
        port: 25
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation
    Npm.require('http').globalAgent.maxSockets = 9999;

    // attach connect-style middleware for response header injection

    // Grab the config
    var config = JSON.parse(Assets.getText('config.json'));
    //process.env.ROOT_URL = config.root_url;

    // Create the admin
    createAdmin(config.admin.username, config.admin.password);
    // Create events
    Events.remove({});
    import_schedule_csv(Assets.getText('schedule.csv'));
    // Clear Service integrations
    ServiceConfiguration.configurations.remove({});

    // Add Service Integrations
    addServiceIntegration('github', config.github);
    addFacebookIntegration(config.facebook);
    addServiceIntegration('google', config.google);

    // Add Base Settings
    setBasicSettings(config);

    Accounts.onCreateUser(function(options, user) {
        if (options.profile) {
            user.profile = options.profile;

            if (config.defaultMentor) {
                user.profile.mentor = true;
            }
        }

        return user;
    });

    var Twit = Meteor.npmRequire('twit');
    var T = new Twit(config.twitter);

    Tweets.remove({})

    T.get('search/tweets', {
        q: 'hackillinois since:2016-1-1'
    }, Meteor.bindEnvironment(function(err, data, response) {
        tweets = data.statuses;
        for (t in tweets) {
            Tweets.insert(tweets[t]);
        }
    }));

    var streamHashtag = T.stream('statuses/filter', {
        track: '#hackillinois',
        language: 'en'
    })

    streamHashtag.on('tweet', Meteor.bindEnvironment(function(tweet) {
        insertTweet(tweet);
    }));
    var streamHI = T.stream('statuses/filter', {
        track: 'hackillinois',
        language: 'en'
    })

    streamHI.on('tweet', Meteor.bindEnvironment(function(tweet) {
        insertTweet(tweet);
    }));
    var streamUser = T.stream('statuses/filter', {
        track: '@hackillinois',
        language: 'en'
    })

    streamUser.on('tweet', Meteor.bindEnvironment(function(tweet) {
        insertTweet(tweet);
    }));
    console.log("APPLICATION INITALIZED");
});


import_schedule_csv = function(file) {
    var lines = file.split(/\r\n|\n/);
    var l = lines.length - 1;
    for (i = 0; i < l; i++) {
        var line = lines[i];
        var line_parts = line.split(',');
        var datetime = new Date(line_parts[0]);
        var name = line_parts[1];
        var loc = line_parts[2];
        var rm;
        if (line_parts[3] == 'nil') {
            rm = nil;
        } else {
            rm = line_parts[3];
        }
        Events.insert({
            timestamp: datetime,
            event: name,
            location: loc,
            room: rm
        });
    }
}


function createAdmin(username, password) {
    username = Base64.encode(username)
    var user = Meteor.users.findOne({
        username: username
    });

    if (!user) {
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
    }, {
        $set: {
            'profile.admin': true
        }
    })
}

function addServiceIntegration(service, config) {
    if (config.enable) {
        ServiceConfiguration.configurations.upsert({
            service: service
        }, {
            $set: {
                clientId: config.clientId,
                secret: config.secret
            }
        });
    }
}

function addFacebookIntegration(fb) {
    if (fb.enable) {
        ServiceConfiguration.configurations.upsert({
            service: 'facebook'
        }, {
            $set: {
                appId: fb.appId,
                secret: fb.secret
            }
        });
    }
}

function setBasicSettings(config) {
    // Check if the settings document already exists
    var settings = Settings.find({}).fetch();
    if (settings.length == 0 || settings.length > 1) {
        // Remove all documents and then create the singular settings document.
        Settings.remove({});
        Settings.insert(config.settings);
    }
}

function insertTweet(tweet) {
    Tweets.insert(tweet);
    _log("Tweet by " + tweet.user.screen_name + " inserted");
}
