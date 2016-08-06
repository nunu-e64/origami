var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;

var PLAYER_FIRST_POS = 90;
var PLAYER_MOVE_VALUE = 110;

var LINE_NUM = 3;

var MIN_SPEED = 5;
var MAX_SPEED = 10;
var MAX_MAX_SPEED = 20;
var INITIAL_MAX_SPEED = 7;
var SPEED_UP_DELTA = 0.005;

var INITIAL_SPAWN_RATE = 0.005;
var RATE_UP_DELTA = 0.0001;
var MAX_SPAWN_RATE = 0.01;

var SPAWN_FIRST_INTERVAL = 1.0;
var SPAWN_INTERVAL_DELTA = 0.05;
var SPAWN_MAX_INTERVAL = 0.3


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
    return ( now && now.call( performance ) ) || ( new Date().getTime() );
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
