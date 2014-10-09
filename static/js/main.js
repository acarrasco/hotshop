requirejs.config({
    baseUrl: "js/",
    shim: {
        'facebook': {
            exports: 'FB'
        }
    },
    paths: {
        'facebook': '//connect.facebook.net/en_US/all'
    }
});


define('main', ['swiper', 'facebook'], function (swiper, facebook) {
    facebook.init({
        appId: '811329552262479',
        cookie: true,
        xfbml: false,
        version: 'v2.1'
    });

    $('#login button').bind('click', function () {
        facebook.login(function () {
            $.post('/user/' + userId + '/init', function () {
                $('#login').addClass('hidden');
                $('#photoSwiper').removeClass('hidden');
                loadNew();
                console.log(arguments);
            });
        });
    });

    facebook.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            $('#photoSwiper').removeClass('hidden');
            userId = response.authResponse.userID;
            loadNew();
        } else {
            $('#login').removeClass('hidden');
        }
    });

    var feed = function (callback) {
        $.post('/user/' + userId + '/nextProduct', function(data) {
            callback(data.productInfo);
        });
    };

    var makeElement = function (productInfo) {
        return $('<img>').attr({src: productInfo.ImageUrl});
    };

    var pickSide = function (dx, dy) {
        if (dx * dx > dy * dy) {
            if (dx > 0) {
                return 1;
            } else {
                return 3;
            }
        } else {
            if (dy > 0) {
                return 2;
            } else {
                return 0;
            }
        }
    };

    var glyphs = [
        $('#moreInfo span'),
        $('#wantIt span'),
        $('#haveIt span'),
        $('#meh span')
    ];

    var updateCallback = function (dx, dy, distance, width) {
        var side = pickSide(dx, dy);

        for (var i = 0; i < 4; i++) {
            var opacity;
            var glow;
            if (i === side) {
                opacity = distance > (width * 0.5) && 1 || 0.5;
                var x = 2 * distance / width;
                glow = '0 0 ' + x + 'em blue, 0 0 ' + x + 'em blue, 0 0 ' + x + 'em blue';
            } else {
                opacity = 0.5;
                glow = '';
            }
            glyphs[i].css({'opacity': opacity, 'text-shadow': glow});
        }
    };

    var exitCallback = function (productInfo, dx, dy, dt) {
        var side = pickSide(dx, dy);
        for (var i = 0; i < 4; i++) {
            glyphs[i].css({'opacity': 0.5, 'text-shadow': ''});
        }

        switch (side) {
            case 0:
                window.open(productInfo.ProductPageUrl);
                return;
            case 1:
                return;
            case 2:
                return;
            case 3:
                return;
        }
    };

    function loadNew() {
        feed(function(current) {
            swiper($('#photoSwiperContainer'), current, makeElement, exitCallback, updateCallback);
        });
    }

});