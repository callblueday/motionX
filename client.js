// ios隐藏地址栏
window.onload= function() {
    $(document.body).height(window.innerWidth);
    setTimeout("window.scrollTo(0, 0)", 1);
};


var settings = {
    multiple: 2,
    markCount: 0
}

// 从服务器接收数据
var socket = io.connect('192.168.3.146:3001');
socket.on('pushToWebClient', function(data) {
    // do sth.
    console.log(data)
    if (data.type == 'lineFollow') {
        settings.markCount++;
        $('.markCount').html(settings.markCount);
    }
    if (data.type == 'ultrasoinic') {
        if(data.distance) {
            $('.msg .distance-value').html(data.distance);
            $('.msg .distance').show();

            if(data.distance < 10) {
                setLed(255,255,255);
            }
        } else {
            $('.msg .distance').hide();
        }
    }

    //
});


/**
 * 摇杆控制程序
 */
var options = {
    zone: document.getElementById('zone'),
    mode: 'static',
    position: {
        left: "125px",
        top: "125px"
    },
    color: 'red',
    size: 250,
    restOpacity: 0.5
};
var joystick = nipplejs.create(options);
bindNipple();


/* 计算小车速度和方向
 *
 *   2 | 1
 *   -----
 *   3 | 4
 */
function calControl(distance, degree, position, direction) {
    var speed = 255 * distance / (options.size * 0.5);
    var left = 0,
        right = 0;

    // 1
    if (degree >= 0 & degree < 90) {
        right = speed - (90 - degree) * settings.multiple;
        left = -speed;
    }

    // 2
    if (degree >= 90 & degree < 180) {
        right = speed;
        left = -(speed - (degree - 90) * settings.multiple);
    }

    // 3
    if (degree >= 180 & degree < 270) {
        right = -speed;
        left = (speed - (270 - degree) * settings.multiple);
    }

    // 4
    if (degree >= 270 & degree < 360) {
        right = -(speed - (degree - 270) * settings.multiple);
        left = speed;
    }

    setTimeout(function() {
        left = parseInt(left);
        right = parseInt(right);
        console.log('speed: ' + left + ':' + right);
        $('.speedL').html(left);
        $('.speedR').html(right);
        motion.setSpeed(left, right);
    }, 10);
}

// 当松开摇杆
function stopSnipt() {
    setTimeout(function() {
        motion.setSpeed(0, 0);
    }, 10);
}

/* debug stars */
var elDebug = document.getElementById('debug');
var elDump = elDebug.querySelector('.dump');
var els = {
    position: {
        x: elDebug.querySelector('.position .x .data'),
        y: elDebug.querySelector('.position .y .data')
    },
    force: elDebug.querySelector('.force .data'),
    pressure: elDebug.querySelector('.pressure .data'),
    distance: elDebug.querySelector('.distance .data'),
    angle: {
        radian: elDebug.querySelector('.angle .radian .data'),
        degree: elDebug.querySelector('.angle .degree .data')
    },
    direction: {
        x: elDebug.querySelector('.direction .x .data'),
        y: elDebug.querySelector('.direction .y .data'),
        angle: elDebug.querySelector('.direction .angle .data')
    }
};

function bindNipple() {
    joystick.on('start end', function(evt, data) {
        dump(evt.type);
        debug(data);
    }).on('move', function(evt, data) {
        debug(data);
    }).on('dir:up plain:up dir:left plain:left dir:down' +
        'plain:down dir:right plain:right',
        function(evt, data) {
            dump(evt.type);
        }
    ).on('pressure', function(evt, data) {
        debug({
            pressure: data
        });
    });
}

function debug(obj) {
    // output data
    if (obj.distance && obj.angle && obj.position && obj.direction) {
        calControl(obj.distance, obj.angle.degree, obj.position, obj.direction);
        // console.log(obj.distance);
    }

    function parseObj(sub, el) {
        for (var i in sub) {
            if (typeof sub[i] === 'object' && el) {
                parseObj(sub[i], el[i]);
            } else if (el && el[i]) {
                el[i].innerHTML = sub[i];
            }
        }
    }
    setTimeout(function() {
        parseObj(obj, els);
    }, 0);
}

var nbEvents = 0;
// Dump data
function dump(evt) {
    if (evt == 'end') {
        console.log(1);
        stopSnipt();
    }
    setTimeout(function() {
        if (elDump.children.length > 4) {
            elDump.removeChild(elDump.firstChild);
        }
        var newEvent = document.createElement('div');
        newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
            evt + '</span>';
        elDump.appendChild(newEvent);
        nbEvents += 1;
    }, 0);
}
/* debug ends */


// fliker
var isFliker = false,
    fliker = motion.flikering();
$('.fliker').on('click', function() {
    if(!isFliker) {
        isFliker = true;
        fliker.start();
        $(this).html('停止闪烁');
    } else {
        isFliker = false;
        fliker.stop();
        $(this).html('灯光闪烁');
    }
});




/*
    音效处理
*/
var pathPrefix = 'media/';
var audioList = {
    'shot': pathPrefix + 'shot_ak47-1.wav',
    'fill': pathPrefix + 'fill_aug_boltslap.wav',
    'bhit': pathPrefix + 'bhit_2.wav',
    'die': pathPrefix + 'die1.wav',
    'shotbig': pathPrefix + 'shotbig_awp1.wav',
    'relife': pathPrefix + 'shot_ak47-1.wav',
    'bg': pathPrefix + 'bg_3dmstart.wav'
};

var audio = {
    play: function(song, type) {
        var isPlay;
        var audioEl = document.createElement("audio");
        // if (audio != null && audio.canPlayType && audio.canPlayType("audio/mpeg"))
        if (audioEl != null && audioEl.canPlayType)
        {
            audioEl.src = song;
            audioEl.play();
        }

        if(type == 'reload') {
            var totalTime = audioEl.duration;
            console.log(totalTime);
            setInterval(function() {
                audioEl.play();
            }, totalTime);
        }
    }
};

$('.shot').on('click', function() {
    audio.play(audioList.shot);
});

$('.die').on('click', function() {
    audio.play(audioList.die);
});

$('.bg').on('click', function() {
    audio.play(audioList.bg);
});




// 加载背景音乐
window.onload = function() {
    // audio.play(audioList.bg, 'reload');
}