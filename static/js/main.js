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

    $('#login button').bind('click', function() {
        facebook.login(function() {
            $('#login').addClass('hidden');
            $('#photoSwiper').removeClass('hidden');
        });
    });

    facebook.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            $('#photoSwiper').removeClass('hidden');
        } else {
            $('#login').removeClass('hidden');
        }
    });

    var i = 0;
    var products = [
        'borat2.jpg',
        'borat1.jpg'
    ];
    var feed = function () {
        return products[i++ % products.length];
    };

    var makeElement = function (x) {
        return $('<img>').attr({src: x});
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
            var opacity = (i === side) && distance > (width * 0.5) && 1 || 0.5;
            glyphs[i].css('opacity', opacity);
        }
    };

    var exitCallback = function (element, dx, dy, dt) {
        var side = pickSide(dx, dy);
        for (var i = 0; i < 4; i++) {
            glyphs[i].css('opacity', 0.5);
        }
    };

    swiper($('#photoSwiperContainer'), feed, makeElement, exitCallback, updateCallback);

});