Template.twitterFeed.helpers({
    tweets: function(){
        return Tweets.find({

        }, {
            sort: {
                timestamp_ms: -1
            }
        })
    },
    time: function(){
        return moment(this.created_at).format('MMMM Do YYYY, h:mm a');
    },

    urlify: function() {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var text = this.text.replace(urlRegex, function(url) {
            return '<a href="' + url + '">' + url + '</a>';
        })
        var output,
        regex   = /(^|[^@\w])@(\w{1,15})\b/g,
        replace = '$1<a href="http://twitter.com/$2">@$2</a>';

        return output = text.replace( regex, replace );
    }
});
 
