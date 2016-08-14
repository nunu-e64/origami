/*////////////////////////////////////////////////////////////////////
======================================================================
File Name       : main.js
Creation Date   : 2016/08/07

Copyright © 2016 nunu-e64. All rights reserved.

This source code or any portion thereof must not be
reproduced or used in any manner whatsoever.
======================================================================
*/////////////////////////////////////////////////////////////////////

var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;

var PLAYER_FIRST_POS = 90;
var PLAYER_MOVE_VALUE = 110;

var LINE_NUM = 3;

var MIN_SPEED = 2;
var FIRST_MAX_SPEED = 5;
var MAX_MAX_SPEED = 10;
var SPEED_UP_DELTA = 0.4;
var maxSpeed = FIRST_MAX_SPEED;

var SPAWN_FIRST_INTERVAL = 1.0;
var SPAWN_INTERVAL_DELTA = 0.05;
var SPAWN_MAX_INTERVAL = 0.3

var scene = "";

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
