var videoTitle = document.getElementsByClassName("title")[0].innerText;

if(videoTitle.includes('-')){
    var trackTitle = videoTitle.split("-");
}

console.log(videoTitle);
console.log(trackTitle);
var firstHalf = trackTitle[0].trim();
var secondHalf = trackTitle[1].trim();

chrome.runtime.sendMessage(
  { firstHalf: firstHalf, secondHalf: secondHalf },
  function (response) {
    console.log(response.farewell);
  }
);
