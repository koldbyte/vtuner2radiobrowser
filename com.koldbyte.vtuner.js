// ==UserScript==
// @name        Vtuner Crawler
// @namespace   com.koldbyte.vtuner
// @include     http://vtuner.com/setupapp/guide/asp/BrowseStations/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==
function qualifyURL(url){
    var img = document.createElement('img');
    img.src = url; // set string url
    url = img.src; // get qualified url
    img.src = null; // no server request
    return url;
}

function getCountry(){
  var url = window.location.href;
  if(url.indexOf('sBrowseType=Location') != -1){
   var locs = url.match('Category=([a-zA-Z]*)');
   return locs[1];
  }
  return 'India';
}

function getUrl(url){
  if(url.indexOf('func/dynampls.asp?link=1&id=') != -1){
    var u = url.match('link=1&id=([0-9]*)');
    return 'http://www.vtuner.com/vtunerweb/mms/m3u'+ u[1] +'.m3u';
  }
  return url;  
}

function flatTags(tags){
  if(tags.indexOf('/')){
    return tags.split('/');
  }
  return [tags];
}

var country = getCountry();

//URL and name
var urls = $('#table2 > tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)');

//genre info
var genre = $('#table2 > tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)');

//location info
var state = $('#table2 > tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)');

console.log(urls.length);
console.log(genre.length);
console.log(state.length);

var stations = [];

for (var i = 0; i < urls.length; i++) {
  //console.log(urls[i]);
  //console.log(genre[i]);
  
  var url = qualifyURL(urls[i].getAttribute('href'));
  //console.log(url);
  var station = {
    name: $(urls[i]).text(),
    url: getUrl(url),
    homepage: 'http://vtuner.com',
    country: country,
    state: $(state[i]).text(),
    tags: flatTags($(genre[i]).text())
  };
  //Enable this comment to actually submit the radio station to the list
  /*var posting = $.post("http://www.radio-browser.info/webservice/json/add", station, function(data){
   console.log("Received: " + data);
  });
  */
  console.log(station);
  stations.push(station);
}
//console.log(stations);
console.log('done');

/** Schema required for API request
name
url
homepage
favicon
country
state
language
tags
*/
