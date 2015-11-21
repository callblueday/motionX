/**
 * motion
 * 定义各种指令动作.
 *
 */
var motion = {
        /* 定义基本动作 */
        // 单次蜂鸣器发声
        buzzer: function(toneName) {
            var data = {
                type: 'buzzer',
                data:[toneName]
            };
            socket.emit('fromWebClient', data);
        },

        stopBuzzer: function() {
            var data = {
                type: 'stopBuzzer',
                data:[]
            };
            socket.emit('fromWebClient', data);
        },

        // 指定颜色LED灯亮
        setLed: function(r, g, b, position) {
            var data = {
                type: 'led',
                data:[r, g, b, position]
            };
            socket.emit('fromWebClient', data);
        },

        // 随机颜色LED亮灯
        randomLed: function() {
            var r = Math.random()*255;
            var g = Math.random()*255;
            var b = Math.random()*255;
            var data = {
                type: 'led',
                data:[r, g, b]
            };
            socket.emit('fromWebClient', data);
        },

        // 定义速度通信
        setSpeed: function(left, right) {
            var data = {
                type: 'speed',
                data:[left, right]
            };
            socket.emit('fromWebClient', data);
        },

        stopSpeed: function() {
            this.setSpeed(0, 0);
        },

        // 开启超声波
        ultrasoinic: {
            start: function() {
                var data = {
                    type: 'ultrasoinic',
                    data:[]
                };
                socket.emit('fromWebClient', data);
            },
            stop: function() {
                var data = {
                    type: 'stopUltrasoinic',
                    data:[]
                };
                socket.emit('fromWebClient', data);
            }
        },


        // 开启巡线
        lineFollow: {
            start: function() {
                var data = {
                    type: 'lineFollow',
                    data:[]
                };
                socket.emit('fromWebClient', data);
            },
            stop: function() {
                var data = {
                    type: 'stopLineFollow',
                    data:[]
                };
                socket.emit('fromWebClient', data);
            }
        },

        stopAll: function() {
            var data = {
                type: 'stopAll',
                data:[]
            };
            socket.emit('fromWebClient', data);
        },

        /* 定义复合动作 */

        //灯光闪烁
        flikering: function() {
            var timer;
            var that = this;
            return {
                getTimer: function() {
                    return timer;
                },
                start: function() {
                    timer = setInterval(function() {
                        that.openLedOnce();
                    }, 1000);
                },
                stop: function() {
                    clearInterval(timer);
                }
            }
        },

        // 闪烁一次熄灭
        openLedOnce: function() {
            var that = this;
            that.setLed(22, 160, 133);
            setTimeout(function() {
                that.setLed(0,0,0);
            }, 500);
        },

        // 行驶
        run: function(speed) {
            var baseSpeed = speed ? speed : 85;
            var that = this;

            return {
                // 前进
                forward : function() {
                    console.log(baseSpeed);
                    var spd1 = -1 * baseSpeed;
                    var spd2 = 1 * baseSpeed;
                    that.setSpeed(spd1, spd2);
                },
                // 后退
                backForward : function() {
                    var spd1 = 1 * baseSpeed;
                    var spd2 = -1 * baseSpeed;
                    that.setSpeed(spd1, spd2);
                },
                turnLeftLittle : function() {
                    var spd1 = -1 * (baseSpeed - 30);
                    var spd2 = 1 * baseSpeed;
                    that.setSpeed(spd1, spd2);
                },
                turnRightLittle : function() {
                    var spd1 = 1 * (baseSpeed - 20);
                    var spd2 = 1 * (baseSpeed - 20);
                    that.setSpeed(spd1, spd2);
                },
                turnLeftExtreme : function() {
                    var spd1 = 1 * (baseSpeed - 20);
                    var spd2 = 1 * (baseSpeed - 20);
                    that.setSpeed(spd1, spd2);
                },
                turnRightExtreme : function() {
                    var spd1 = -1 * (baseSpeed - 20);
                    var spd2 = -1 * (baseSpeed - 20);
                    that.setSpeed(spd1, spd2);
                }
            }
        }
}









