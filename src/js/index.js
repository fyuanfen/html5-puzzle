/**
 * Created by zyy on 2016/12/12.
 */
$(function(){
    var doc = document;
    var canvas = doc.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var $gameBox = $('#gameBox');
    var $lis = $gameBox.find('li');
    var image = new Image();
    var oriArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var imgArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var App = {
        timeHandle: null,
        isComplete: false,
        level: 0,
        levels: [
            {time: "60.00", image: "./img/shulan.png"},
            {time: "40.00", image: "img/tuzi.png"},
            {time: "30.00", image: "img/together.png"},
            {time: "20.00", image: "img/shengdan.png"}
        ],
        bind: function() {
            //阻止手机上浏览器的弹性下拉。。。
            $('body').on('touchstart', function(e) {
                e.preventDefault();
            });
            //网页端
            $lis.draggable="true";
            $lis.on('dragstart',function(e){
                e.dataTransfer.setData("Index",$(this).index());
            });
            $lis.on('dragover',function(e){
                e.preventDefault();
            });
            $lis.on('drop',function(e){
                e.preventDefault();
                var index=e.dataTransfer.getData("Index");
                var prev = $lis.eq(index);
                var html = $(this).html();
                $(this).html(prev.html());
                $(prev).html(html);
                App.check();
            });
            $lis.on('swipeLeft', function(e) {
                e.preventDefault();
                var $this = $(this);
                var index = $this.index();
                var html = $this.html();
                var $prev = $this.prev();
                if ($.inArray(index, [3, 6]) > -1 || $prev.size() <= 0) {
                    return false;
                }
                $this.html($prev.html());
                $prev.html(html);
                App.check();
            });
            $lis.on('swipeRight', function(e) {
                e.preventDefault();
                var $this = $(this);
                var index = $this.index();
                var html = $this.html();
                var $next = $this.next();
                if ($.inArray(index, [2, 5]) > -1 || $next.size() <= 0) {
                    return false;
                }
                $this.html($next.html());
                $next.html(html);
                App.check();
            });
            $lis.on('swipeUp', function(e) {
                e.preventDefault();
                var $this = $(this);
                var html = $this.html();
                var index = $this.index() - 3;
                var $up = $lis.eq(index);
                if (index >= 0 && $up.size() > 0) {
                    $this.html($up.html());
                    $up.html(html);
                    App.check();
                }
            });
            $lis.on('swipeDown', function(e) {
                e.preventDefault();
                var $this = $(this);
                var html = $this.html();
                var index = $this.index() + 3;
                var $down = $lis.eq(index);
                if (index < 9 && $down.size() > 0) {
                    $this.html($down.html());
                    $down.html(html);
                    App.check();
                }
            });
            $('#start').on('tap click', function() {
                $('#reset').prop('disabled', false);
                //再来一次的时候 顺序不变哦
                if ($(this).html() !== '再来一次') {
                    App.randomImage(true);
                } else {
                    App.randomImage();
                }
                App.resetData();
                App.countdown();
                $('#layer').hide();
            });
            $('#reset').on('tap click', function() {
                App.resetData();
                App.countdown();
                App.randomImage(true);
            });
        },
        countdown: function() {
            clearInterval(this.timeHandle);
            this.timeHandle = setInterval(function() {
                var $time = $('#timing');
                var time = parseFloat($time.text());
                var currTime = (time - 0.01).toFixed(2);
                if (currTime < 0) {
                    clearInterval(App.timeHandle);
                    $time.text(parseInt(currTime).toFixed(2));
                    App.update();
                } else {
                    $time.text(currTime);
                }
            }, 10);
        },
        resetData: function() {
            var time = this.levels[this.level].time;
            $('#timing').text(time);
            $('#time').text(time);
            $('#level').text(this.level+1);
            $('#levels').text(this.levels.length);
        },
        init: function() {
            $('#reset').prop('disabled', true);
            this.resetData();
            imgArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            this.render();
        },
        render: function() {
            image.onload = function() {
                App.randomImage();
            };
            image.src = this.levels[this.level].image;
        },
        randomImage: function(flag) {
            flag = flag || false;
            if (flag) {
                imgArr.sort(function(a, b) {
                    return Math.random() - Math.random();
                });
            }
            var index = 1;
            for (var i=0; i<3; i++) {
                for (var j=0; j<3; j++) {
                    ctx.drawImage(image, 300*j, 300*i, 300, 300, 0, 0, 300, 300);
                    $lis.eq(imgArr[index-1]-1).find('img').data('seq', index).attr('src', canvas.toDataURL('image/jpeg'));
                    index++;
                }
            }
        },
        check: function() {
            var resArr = [];
            $('#gameBox img').each(function(k, v) {
                resArr.push(v.getAttribute("data-seq"));
            });
            if (resArr.join("") === oriArr.join("")) {
                setTimeout(function() {
                    //App.isComplete = true;
                    window.clearInterval(App.timeHandle);
                    if (App.level >= App.levels.length-1) {
                        alert("哇塞,你居然通关了,好棒!");
                        App.destory();
                    } else {
                        if (confirm("恭喜过关,是否继续挑战?")) {
                            App.level++;
                            $('#layer').show();
                            App.init();
                        }
                    }
                }, 300);
            }
        },
        update: function() {
            if (this.isComplete === false) {
                alert("时间到,游戏结束!");
                $('#layer').show();
                $('#start').html("再来一次");
                $('#reset').prop('disabled', true);
            }
        },
        destory: function() {
            $('#reset').prop('disabled', true);
            $lis.off("swipeLeft");
            $lis.off("swipeRight");
            $lis.off("swipeUp");
            $lis.off("swipeDown");
            $lis.css('border', 0);
            $gameBox.css('border', 0);
        },
        start: function() {
            this.init();
            this.render();
            this.bind();
        },
    };
    App.start();
});