/*////////////////////////////////////////////////////////////////////
======================================================================
File Name       : main.js
Creation Date   : 2016/08/07

Copyright © 2016 nunu-e64. All rights reserved.

This source code or any portion thereof must not be
reproduced or used in any manner whatsoever.
======================================================================
*/////////////////////////////////////////////////////////////////////

// Constants ////
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;

var PLAYER_FIRST_POS = 5;
var PLAYER_MOVE_VALUE = 160;

var LINE_NUM = 3;

var MIN_SPEED = 2;
var FIRST_MAX_SPEED = 4;
var MAX_MAX_SPEED = 10;
var SPEED_UP_DELTA = 0.2;

var SPAWN_FIRST_INTERVAL = 1.0;
var SPAWN_INTERVAL_DELTA = 0.05;
var SPAWN_MAX_INTERVAL = 0.3

var FONT_JPN="'YuGothic',‘ＭＳ ゴシック’";
var FONT_EN="'Euphemia','Arial'";

var FILTER_BLACK="rgba(0, 0, 0, 0.5)";

// Global Valriable ////
var scene = "";
var maxSpeed = FIRST_MAX_SPEED;

// Global Function ////
//中央に配置する画像の X 座標を求める関数
function getCenterPostion(containerWidth, itemWidth) {
    return (containerWidth / 2) - (itemWidth / 2);
};

var now = window.performance && (
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow );

var getTime = function() {
    return (( now && now.call( performance ) ) || ( new Date().getTime() )) / 1000;
}

function isHit(targetA, targetB) {
    if ((targetA.x <= targetB.x && targetA.width + targetA.x >= targetB.x)
     || (targetA.x >= targetB.x && targetB.x + targetB.width >= targetA.x)) {
        if ((targetA.y <= targetB.y && targetA.height + targetA.y >= targetB.y)
         || (targetA.y >= targetB.y && targetB.y + targetB.height >= targetA.y)) {

            return true;
        }
    }
    return false;
}

function changeScene(nextScene) {
    console.log("Scene: " + scene + "->" + nextScene);
    scene = nextScene;
}

// ブラウザ対応音源拡張子取得
var AUDIO_EXT = (function(){
    return "mp3";
    // var ext     = "";
    // var audio   = new Audio();
    //
    // if      (audio.canPlayType("audio/ogg") == 'maybe') { ext="ogg"; }
    // else if (audio.canPlayType("audio/mp3") == 'maybe') { ext="mp3"; }
    // else if (audio.canPlayType("audio/wav") == 'maybe') { ext="wav"; }
    //
    // return ext;
})();
