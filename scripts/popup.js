$(".manage").hide();

//switch over setting and news list
$("#settings").click(function(){
  if ($(".manage").is(":visible")) {
    $(".manage").hide();
    $(".news").show();
  }
  else {
    $(".manage").show();
    $(".news").hide();
  }
});

//Preload the feed list
for(index in chrome.extension.getBackgroundPage().RN.feedURLs){
    var feedURL = chrome.extension.getBackgroundPage().RN.feedURLs[index];
    var feedURL_short = feedURL;
    if(feedURL.length > 40) feedURL_short = feedURL_short.substring(0,40) + "...";
    $("#feedlist").append('<div class="item"><div class="left floated red compact tiny ui button delete" data-feed="' + feedURL + '">Remove</div><div class="content aligned">' + feedURL_short + "</div></div>");
}

//Preload the news list
for(index=chrome.extension.getBackgroundPage().RN.seen_item.length-1;index >= 0;index--){
    //console.log(index);
    var item = chrome.extension.getBackgroundPage().RN.seen_item[index];
    item_title = item.title;
    item_url = item.url;
    if(item.time){
      item_time = item.time.split(" ").slice(0,5).join(" "); // remove the meaningless word in time
    }else{
      item_time = " ";
    }
    item_rss = item.rss;
    var one_li = '';
    one_li += '<div class="item">';
    one_li += '<a href="' + item_url + '">\
      <div class="item">' + item_title + '</div></a>\
      <span class="source">' + item_rss +'</span>\
      <span class="tag">' + item_time + '</span>';
    one_li += '</div>';
    $("#newslist").append(one_li);
}

//Update the heading to say "Feeds", "Feed", or none depends on the number of feeds in the list
updateHeading();

//Handle adding a feed
$("#add").click(function(){
    var feedURL = $("#url").val()
    var feedURL_short = feedURL;
    if(feedURL.length > 40) feedURL_short = feedURL_short.substring(0,40) + "...";
    chrome.extension.getBackgroundPage().addFeed(feedURL);
    $("#feedlist").append('<div class="item"><div class="left floated compact tiny ui button delete" data-feed="' + feedURL + '">Remove</div><div class="content aligned">' + feedURL_short + "</div></div>");
    updateHeading();
});

//Handle removing a feed from the list
$("#feedlist").on("click", ".delete", function(){
    var feedURL = $(this).data("feed");
    chrome.extension.getBackgroundPage().removeFeed(feedURL);
    $(this).parent("div").fadeOut().remove();
    updateHeading();
});

//Update the heading with coreect wording for 0, 1, or more feeds
function updateHeading(){
    var feedCount = chrome.extension.getBackgroundPage().RN.feedURLs.length;
    var message = "There are no feeds being monitored.";
    if(feedCount === 1){
        message = "1 Feed being monitored:"
    }
    if(feedCount > 1){
        message = feedCount + " Feeds being monitored:"
    }
    $("#heading").html(message);
}

//open the href in a new tab
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
