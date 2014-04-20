


if (Meteor.isClient) {

    Template.articles.articleList = function() {
        var x =Articles.find();//, { sort: { time: -1 }});
        return x;
    };

    Template.articles.events({
        'click input.inc': function (event) {
            Meteor.call('addLike', event.target.id, function(e, r) {
            });
        }
    });

    Template.articles.events({
        'click input.inc2': function (event) {
            Meteor.call('addDislike', event.target.id, function(e, r) {
            });
        }
    });

    Template.articles.events({
        'click input.inc3': function (event) {
            var receive = prompt("dripp popup");
            console.log(receive);
        }
    });

} //end if isClient

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    if (Articles.find().count() === 0) {
      var names = [ 
    {
        // articleID: 1,
        headline: "MISSING JET MYSTERYNew French images may show debris, Malaysia says",
        // source: "FoxNews.com",
        numLikes: 5,
        numDislikes: 3,
        // url: "http://www.foxnews.com/world/2014/03/23/crews-expand-search-area-as-hunt-for-missing-jet-enters-third-week/",
        imageUrl: "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn2/video/0/0/032214_anhq_kay2_640.jpg?ve=1&tl=1",
        // dateTime: "Sun, 23 Mar 2014 16:35:27 EST",
        // category: "World"
    },
    {
        // articleID: 2,
        headline: "S. Korea: N. Korea fires more rockets into the sea",
        // source: "FoxNews.com",
        numLikes: 9,
        numDislikes: 16771,
        // url: "http://www.foxnews.com/world/2014/03/23/north-korea-fires-more-rockets-into-sea-south-korea-says/",
        imageUrl: "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/0/0/APTOPIX%20North%20Korea%20A_Cham.jpg?ve=1&tl=1",
        // dateTime: "Sun, 23 Mar 2014 16:26:59 EST",
        // category: "World"
    },
    {
        // articleID: 3,
        headline: "Mattingly, teammate miffed at Puig's behavior",
        // source: "ESPN.com",
        numLikes: 16,
        numDislikes: 2,
        // url: "http://espn.go.com/los-angeles/mlb/story/_/id/10658691/los-angeles-dodgers-manager-don-mattingly-upset-yasiel-puig-field-behavior",
        imageUrl: "http://a.espncdn.com/media/motion/2014/0323/dm_140323_mlb_dodgers_mattingly_puig/dm_140323_mlb_dodgers_mattingly_puig.jpg",
        // dateTime: "Sun, 23 Mar 2014 14:37:25 PDT",
        // category: "Sports"
    }
];
      for (var i = 0; i < names.length; i++)
        Articles.insert(names[i]);
    }

    Meteor.methods({
        addLike : function(id) {
            var toChange = Articles.findOne(id);
            Articles.update(toChange, {$inc: {numLikes : 1}});            
        },
        addDislike : function(id) {
            var toChange = Articles.findOne(id);
            Articles.update(toChange, {$inc: {numDislikes : 1}});            
        } 
       
    });

  });
}
