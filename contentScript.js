var videoTitle = document.getElementsByClassName('title')[0].innerText.toLowerCase().replace('&', 'and');
var inParantheses = videoTitle.slice(videoTitle.indexOf('('), videoTitle.indexOf(')') + 1);
var inBrackets = videoTitle.slice(videoTitle.indexOf('['), videoTitle.indexOf(']') + 1);

var titleSeparatorIndex = videoTitle.lastIndexOf('-');
var artistName = videoTitle.slice(0, titleSeparatorIndex - 1).trim();

if(videoTitle.includes('ft.') || videoTitle.includes('feat')){
  let featIndex = videoTitle.lastIndexOf('feat.');
  let featuring = videoTitle.substring(featIndex, titleSeparatorIndex);
  videoTitle = videoTitle.replace(featuring, '');
}
console.log(`artistName: ${artistName}`);

videoTitle = videoTitle.replace(inParantheses, '').replace(inBrackets, '').replace(/-/g, '').trim().replace(/\s+/g, '+');
console.log(`videoTitle: ${videoTitle}`);

chrome.runtime.sendMessage({ videoTitle: videoTitle, artistName: artistName });

