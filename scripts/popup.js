$(".settings").hide();

$("#settings").click(function(){
  if ($(".settings").is(":visible")) {
    $(".settings").hide();
  }
  else {
    $(".settings").show();
  }
});

//Preload the list
for(index in chrome.extension.getBackgroundPage().RN.feedURLs){
    var feedURL = chrome.extension.getBackgroundPage().RN.feedURLs[index];
    $("#list").append("<li class='list-group-item feed-item'>" + "<button class='btn btn-danger btn-xs delete' data-feed='" + feedURL + "' >Remove</button>" + feedURL  + "</li>");
}
//Update the heading to say "Feeds", "Feed", or none depends on the number of feeds in the list
updateHeading();

//Handle adding a feed
$("#add").click(function(){
    var feedURL = $("#url").val()
    chrome.extension.getBackgroundPage().addFeed(feedURL);
    $("#list").append("<li class='list-group-item feed-item'>" + "<button class='btn btn-danger btn-xs delete' data-feed='" + feedURL + "' >Remove</button>" + feedURL  + "</li>");
    updateHeading();
});

//Handle removing a feed from the list
$("#list").on("click", ".delete", function(){
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
        message = "Feed being monitored:"
    }
    if(feedCount > 1){
        message = "Feeds being monitored:"
    }
    $("#heading").html(message);
}
