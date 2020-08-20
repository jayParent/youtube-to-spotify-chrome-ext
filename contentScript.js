var saveBtn = createSaveBtn();
var container = document.querySelector('#info-contents #container #info');
var saveBtnElement = document.getElementById('save_track_btn');
if(!container.contains(saveBtnElement)){
  container.appendChild(saveBtn);
}

var trackInfo = getTrackInfo();
saveBtn.addEventListener('click', sendTrackInfo);

function getTrackInfo() {
  var videoTitle = document.getElementsByClassName('title')[0].innerText.toLowerCase().replace('&', 'and');
  var inParantheses = videoTitle.slice(videoTitle.indexOf('('), videoTitle.indexOf(')') + 1);
  var inBrackets = videoTitle.slice(videoTitle.indexOf('['), videoTitle.indexOf(']') + 1);

  var titleSeparatorIndex = videoTitle.lastIndexOf('-');
  var artistName = videoTitle.slice(0, titleSeparatorIndex - 1).trim();

  if (videoTitle.includes('ft.') || videoTitle.includes('feat')) {
    let featIndex = videoTitle.lastIndexOf('feat.');
    let featuring = videoTitle.substring(featIndex, titleSeparatorIndex);
    videoTitle = videoTitle.replace(featuring, '');
  }

  videoTitle = videoTitle
    .replace(inParantheses, '')
    .replace(inBrackets, '')
    .replace(/-/g, '')
    .trim()
    .replace(/\s+/g, '+');

  return { artist: artistName, title: videoTitle };
}

function createSaveBtn() {
  let btn = document.createElement('button');

  btn.id = 'save_track_btn';
  btn.textContent = 'Save To Spotify';
  btn.style.backgroundColor = '#1DB954';
  btn.style.color = '#191414';
  btn.style.fontSize = '14px';
  btn.style.fontWeight = 'bold';
  btn.style.padding = '5px';
  btn.style.border = 'none';
  btn.style.borderRadius = '2px';
  btn.style.cursor = 'pointer';

  return btn;
}

function sendTrackInfo() {
  console.log(trackInfo);
  chrome.runtime.sendMessage({
    message: 'saveTrack',
    artistName: trackInfo.artist,
    videoTitle: trackInfo.title,
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    request.status === "sucess" ? console.log('Track Saved Sucessfully!'): console.log('Failed to Save Track');
  });
