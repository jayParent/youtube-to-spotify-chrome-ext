var videoTitle = document.getElementsByClassName('title')[0].innerText.toLowerCase();
var paran = videoTitle.slice(videoTitle.indexOf('('), videoTitle.indexOf(')') + 1);
console.log(paran);

paran.toLowerCase().includes('video') ? (videoTitle = videoTitle.replace(paran, '')) : (videoTitle = videoTitle);

console.log(`videoTitle: ${videoTitle}`);

if (videoTitle.includes('-')) {
  var trackTitle = videoTitle.split('-');
  console.log(trackTitle);
  var firstHalf = trackTitle[0].trim().toLowerCase();
  var secondHalf = trackTitle[1].trim().toLowerCase();

  console.log(`${firstHalf} ${secondHalf}`);

  chrome.runtime.sendMessage({ firstHalf: firstHalf, secondHalf: secondHalf });
} else {
  chrome.runtime.sendMessage({ videoTitle: videoTitle });
}
