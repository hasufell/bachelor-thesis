/**************************** 
* linear JavaScript Library *
*       version 0.05        *
****************************/

//////// handler for theme picker requests ////////////
function colorize(pri, sec, ter, link, vlink, hover) {
  CSSbody =     document.styleSheets[0].rules.item(0);
  CSSlink =     document.styleSheets[0].rules.item(4);
  CSSvisited =  document.styleSheets[0].rules.item(5);
  CSShover =    document.styleSheets[0].rules.item(6);
  CSSsliding_box =   document.styleSheets[0].rules.item(11);
  CSSentry =    document.styleSheets[0].rules.item(12);
  // do it the new way 
  CSSbody.style.backgroundColor = pri;
  CSSbody.style.scrollbarFaceColor = sec;
  CSSbody.style.scrollbarShadowColor = ter;
  CSSbody.style.scrollbarHighlightColor = ter;
  CSSbody.style.scrollbar3dlightColor = ter;
  CSSbody.style.scrollbarDarkshadowColor = ter;
  CSSbody.style.scrollbarTrackColor = pri;
  CSSbody.style.scrollbarArrowColor = ter;
  CSSbody.style.color = ter;
  //CSSsliding_box.style.backgroundColor = sec;
  //CSSentry.style.backgroundColor = sec;
  
  // need to keep this loop for now....
  divs = document.getElementsByTagName('div');
  for (var i = 1; i < divs.length; i++) {
    el = divs[i];
    if (el.className == 'entry' || el.id == 'sliding_box'){
      divs[i].style.backgroundColor = sec;
    }
    divs[i].style.color = ter;
  }
  // document.styleSheets[0].rules.item(2).style.color = link;
  document.styleSheets[0].rules.item(4).style.color = link;
  document.styleSheets[0].rules.item(5).style.color = vlink;
  document.styleSheets[0].rules.item(6).style.color = hover;
  
  // have a cookie
  var now = new Date();   
  var then = new Date();   
  then.setTime(now.getTime() + 1000*60*60*24*180);
  setCookie('pri', pri, then);
  setCookie('sec', sec, then);
  setCookie('ter', ter, then);
  setCookie('link', link, then);
  setCookie('vlink', vlink, then);
  setCookie('hover', hover, then);
}


//////// Cookie utility function
function setCookie(name, value, expire) {   
  document.cookie = name + "=" + escape(value) + "; path=/"  
  + ((expire == null) ? "" : ("; expires=" + expire.toGMTString()));
}

//////// floater bar handler now deals with gecko too
function smoothMove() {
  // sniff sniff, what's that smell?
  var ns4 = document.layers ? 1 : 0;
  var ie = document.all ? 1 : 0;
  var gecko = document.getElementById && !document.all ? 1 : 0;

  if (ie){
    var where = document.all.sliding_box.offsetTop;
    var Dif = parseInt((document.body.scrollTop + topOffset - where)*.1);
    document.all.sliding_box.style.pixelTop += Dif;
  }
  if (gecko) {
    var where = parseInt(document.getElementById('sliding_box').style.top);
    if (isNaN(where)) where = 0;
    var Dif = parseInt((window.pageYOffset + topOffset - where)*.1);
    if (isNaN(Dif)) Dif = 0;
    document.getElementById('sliding_box').style.top = where + Dif;
  }
}

//////// onLoad handler
function doLoad() {
  window.setInterval("smoothMove()",10);
}


//////// fading functions
function GetOpacity() {
  var ns4 = document.layers ? 1 : 0;
  var ie = document.all ? 1 : 0;
  var gecko = document.getElementById && !document.all ? 1 : 0;
	if (ie) {	return arguments[0].filters.alpha.opacity; } else
	if (gecko) { return parseInt(arguments[0].style.MozOpacity) }
}

function SetOpacity() {
  var ns4 = document.layers ? 1 : 0;
  var ie = document.all ? 1 : 0;
  var gecko = document.getElementById && !document.all ? 1 : 0;
	if (ie) {	arguments[0].filters.alpha.opacity = arguments[1]; } else
	if (gecko) { arguments[0].style.MozOpacity = arguments[1]+"%"; }
}
