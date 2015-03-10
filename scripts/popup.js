$(".settings").hide();

//switch over setting and news list
$("#settings").click(function(){
  if ($(".settings").is(":visible")) {
    $(".settings").hide();
    $(".news").show();
    $("#button_display").html("Settings");
  }
  else {
    $(".settings").show();
    $(".news").hide();
    $("#button_display").html("Return");
  }
});

//Preload the feed list
for(index in chrome.extension.getBackgroundPage().RN.feedURLs){
    var feedURL = chrome.extension.getBackgroundPage().RN.feedURLs[index];
    $("#feedlist").append("<li class='list-group-item feed-item'>" + "<button class='btn btn-danger btn-xs delete' data-feed='" + feedURL + "' >Remove</button>" + feedURL  + "</li>");
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
    one_li += '<div class="post read">';
    one_li += '<span class="tag">' + item_time + '</span>\
      <a href="' + item_url + '">\
      <div class="item">\
        ' + item_title + '\
      </div>\
      </a>\
      <span class="source">' + item_rss +'</span>';
    one_li += '</div><br>';
    $("#newslist").append(one_li);
}

//Update the heading to say "Feeds", "Feed", or none depends on the number of feeds in the list
updateHeading();

//Handle adding a feed
$("#add").click(function(){
    var feedURL = $("#url").val()
    chrome.extension.getBackgroundPage().addFeed(feedURL);
    $("#feedlist").append("<li class='list-group-item feed-item'>" + "<button class='btn btn-danger btn-xs delete' data-feed='" + feedURL + "' >Remove</button>" + feedURL  + "</li>");
    updateHeading();
});

//Handle removing a feed from the list
$("#feedlist").on("click", ".delete", function(){
    var feedURL = $(this).data("feed");
    chrome.extension.getBackgroundPage().removeFeed(feedURL);
    $(this).parent("li").fadeOut().remove();
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
