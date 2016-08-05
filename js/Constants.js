//矢印キーのコード
var LEFT_KEY_CODE = 37;
var RIGHT_KEY_CODE = 39;
//雪だるまの横位置に加算する変数
var key_value = 0;

var PLAYER_FIRST_POS = 90;
var PLAYER_MOVE_VALUE = 110;

var LINE_NUM = 3;

var MIN_SPEED = 5;
var MAX_SPEED = 10;
var INITIAL_MAX_SPEED = 10;
var SPEED_UP_DELTA = 1;

var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;


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
