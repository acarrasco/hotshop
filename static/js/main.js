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

    var current;
    var userId;

    $('#login button').bind('click', function () {
        facebook.login(function () {
            $.post('/user/' + userId + '/init', function () {
                $('#login').addClass('hidden');
                $('#photoSwiper').removeClass('hidden');
                load();
                console.log(arguments);
            });
        });
    });

    facebook.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            $('#photoSwiper').removeClass('hidden');
            userId = response.authResponse.userID;
            load();
        } else {
            $('#login').removeClass('hidden');
        }
    });

    var feed = function (callback) {
        $.post('/user/' + userId + '/nextProduct', function (data) {
            current = data.productInfo;
            callback(current);
        });
    };

    var makeElement = function (productInfo) {
        return $('<div>').append(
                $('<img>').attr({src: productInfo.ImageUrl}).css('width', '100%'),
                $('<h2>').text(productInfo.Name),
                $('<p>').text(productInfo.Description));
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
        $('#moreInfo'),
        $('#wantIt'),
        $('#haveIt'),
        $('#meh')
    ];

    var updateCallback = function (dx, dy, distance, width) {
        var side = pickSide(dx, dy);

        for (var i = 0; i < 4; i++) {
            var chosen = false;
            if (i === side) {
                if (distance > width * 0.25) {
                    chosen = true;
                } else {
                    chosen = false;
                }
            } else {
                chosen = false;
            }

            if (chosen) {
                glyphs[i].removeClass('unchosen');
                glyphs[i].addClass('chosen');
            }
            else {
                glyphs[i].removeClass('chosen');
                glyphs[i].addClass('unchosen');
            }
        }
    };

    var exitCallback = function (productInfo, dx, dy, dt) {
        var side = pickSide(dx, dy);
        for (var i = 0; i < 4; i++) {
            glyphs[i].removeClass('chosen').addClass('unchosen');
        }

        switch (side) {
            case 0:
                if (productInfo.ProductPageUrl) {
                    window.location = productInfo.ProductPageUrl;
                }
                return;
            case 1:
                $.post('/user/' + userId + '/want/' + productInfo.Id, function (data) {
                    load();
                });
                return;
            case 2:
                $.post('/user/' + userId + '/have/' + productInfo.Id, function (data) {
                    load();
                });
                return;
            case 3:
                $.post('/user/' + userId + '/meh/' + productInfo.Id, function (data) {
                    load();
                });
                return;
        }
    };

    function load() {
        var hash = $.deparam.fragment();
        var productId = hash.productId;

        if (current || !productId) {
            feed(function(current) {
                hash.productId = current.Id;
                window.location.hash = $.param(hash);
                swiper($('#product'), current, makeElement, exitCallback, updateCallback);
            });
        } else {
            $.get('/product/' + productId, function(data) {
                current = data.productInfo;
                swiper($('#product'), current, makeElement, exitCallback, updateCallback);
            });
        }
    }

});