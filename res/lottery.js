/*
* Photo Lottery
* Author: Kris Zhang
* Lincense: MIT
* https://github.com/newghost/js-lottery.git
*/
/*
Fix old IE.
*/
var slideIndex = 0;
var queryIndex = 10;
var toggle = 0;
var messageList = [];
var imageList = [];
var userNameList = [];
var userIdList = [];
var token = "EAABtTOZBid2cBAHSWKdMmZCe2HslF2LZB6kxPWlnLXqAEVn69m3xYMavaWE42ZBEWELpirYBin1GViyjZB8181Hkgo4ejZA3p521T0S4Wqx6ZCWw9ybm0dERzgINHUHrfSKIRfwxMQSLKZBPzMpLI74AfYcyderMflUZD";
var targetId = "1859196144394422";
var url = "https://graph.facebook.com/v2.10/" + targetId + "/feed?fields=full_picture,message,from&access_token=" + token;
var default_pic = "https://scontent.xx.fbcdn.net/v/t1.0-9/21740391_1702534819777619_3051812303718747661_n.jpg?oh=8b88c90321d890bbf9c5dd5ae02c95c3&oe=5A4995C2";
function FBquery() 
{	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200) {
				var myArr = JSON.parse(this.responseText).data;
				messageList = [];
				imageList = [];
				userNameList = [];
				userIdList = [];
				var ul = document.getElementById("lottery-ul");
				
				for (idx = 0; idx < myArr.length; idx++){
					var li = document.createElement("li");
					var img = document.createElement("img");
					if (myArr[idx].full_picture)	{
						img.src = (myArr[idx].full_picture);
					}else {
						img.src = (default_pic);
					}
					li.appendChild(img);
					ul.appendChild(li);
					/*
					messageList.push(myArr[idx].message);
					if (myArr[idx].full_picture)	{
						imageList.push(myArr[idx].full_picture);
					}else {
						imageList.push(default_pic);
					}
					userNameList.push(myArr[idx].from.name);
					var tmpId = myArr[idx].from.id;
					userIdList.push("http://graph.facebook.com/" + tmpId + "/picture?type=square");
					*/
				}				
				window.console.log(ul);
				Lottery.init();				
			}
		};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();				
};


var timer           = null,
      itemWidth       = 142,
      itemCount       = 0,
      curPos          = 0;


var Lottery = (function() {

  

  var init = function() {
	var $content        = $("#lottery-container ul");
    //Pre-caculate the count of items
    itemCount       = $("#lottery-container ul li").size();
    //Clone the contents
    $content.append($content.html());
	
  };

  var start  = function() {
    clearInterval(timer);
	var $content        = $("#lottery-container ul");
	var $hero           = $("#lottery-hero img");
   
    timer = setInterval(function() {

      curPos = parseInt($content.css("left")) | 0;
      curPos -= itemWidth / 2;

      (curPos < 0 - itemWidth * itemCount) && (curPos = 0);

      $content.css("left", curPos);

    }, 25);
    $hero.hide();
  };

  var stop = function() {
    clearInterval(timer);
    timer = null;

    //Roll at the half width?
    (curPos % itemWidth == 0 - itemWidth / 2) && (curPos = curPos - itemWidth / 2);

    var selected  = getCurIdx();

    setCurIdx(selected);
  };

  var running = function() {
    return timer != null;
  };

  //Index: first item on the left
  var setCurIdx = function(idx) {
	var $content        = $("#lottery-container ul");
	var $hero           = $("#lottery-hero img");
    curPos = (0 - idx) * itemWidth;

    var $items = $("#lottery li img"),
        imgUrl = $items.eq(idx + 3).attr("src");

    $content.css("left", curPos);
    $hero.attr("src", imgUrl).show("slow");

    console.log(curPos, idx);
  };

  var getCurIdx = function() {
    return (0 - curPos) / itemWidth;
  };

  return {
      init: init
    , start: start
    , stop: stop
    , running: running
    , setCurIdx: setCurIdx
    , getCurIdx: getCurIdx
  };

})();

$(document).ready(function() {
	FBquery();
  //Lottery.init();
});
