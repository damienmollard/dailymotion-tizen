function getImageDataURL(url, result) {
    var data, canvas, ctx;
    var img = new Image();
    img.onload = function() {
        // Create the canvas element.
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        // Get '2d' context and draw the image.
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // Get canvas data URL
        try{
            data = canvas.toDataURL();
            result(data);
        } catch(e) {
            result(null);
        }
    };
    img.onerror = function() {
        result(null);
    };
    // Load image URL.
    try {
        img.src = url;
    } catch(e) {
        result(null);
    }
}

function showWidget() {
    window.appwidget.sendMessageToPd('reload');

    var videos = JSON.parse(localStorage.videos);
    var video = videos.length > 0 ? videos[0] : null;
    var images = JSON.parse(localStorage.images);
    var image = images.length > 0 ? images[0] : "images/thumbnail.jpg";

    $('#widget-thumbnail').css('background-image', 'url('+image+')');
    $('#title').html(video ? video.title : '');
    $('#owner').html(video ? video['owner.screenname'] : '');

    $('#widget').unbind().click(function() {
        if (window.innerWidth < 100) {
            // 1x1 widget
            tizen.application.launch(tizen.application.getCurrentApplication().appInfo.id);
        } else {
            // other sizes
            var appControl = new tizen.ApplicationControl('video', video.url);
            tizen.application.launchAppControl(appControl, tizen.application.getCurrentApplication().appInfo.id,
                function() {
                    console.log("launch application control succeed");
                },
                function(e) {
                    console.log("launch application control failed. reason: " + e.message);
                }
            );
        }
    });
}

function queryVideos() {

    $.ajax({
        type: 'GET',
        url: 'https://api.dailymotion.com/videos?fields=thumbnail_360_url,title,url,owner.screenname&filters=featured',
        dataType: 'json',
        success : function(json) {

            var videos = json.list;

            // Store videos list
            localStorage.videos = JSON.stringify(videos);

            // Convert & store videos thumbnails
            var images = [];
            var imageCount = 0;

            $.each(videos, function(i, video) {
                getImageDataURL(video.thumbnail_360_url, function (data) {
                    imageCount++;
                    if (data) {
                        images[i] = data;
                    } else {
                        images[i] = "images/thumbnail.jpg";
                    }
                    if (imageCount === videos.length) {
                        localStorage.images = JSON.stringify(images);
                        showWidget();
                    }
                });
            });
        },
        error : function() {
            showWidget();
        }
    });
}

$(function () {

    queryVideos();

    if (typeof window.appwidget != 'undefined') {
        listenPdMessage();
    } else {
        window.addEventListener("appwidgetready", onAppWidgetReady, false);
    }

    function onAppWidgetReady() {
        listenPdMessage();
    }

    function listenPdMessage() {
        window.addEventListener("pdmessage",
        function(e) {
            queryVideos();
        }, false);
    }

}());