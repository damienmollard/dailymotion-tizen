var videos = [];

function selectedVideoAtIndex(index) {
    var video = videos[index];
    $('#title').html(video.title);
    $('#owner').html(video['owner.screenname']);
}

function refresh() {
    videos = JSON.parse(localStorage.videos);

    $slidee = $('#slidee');
    $slidee.empty();

    $.each(videos, function(i, video) {
        $thumbnail = $('<li></li>');
        $thumbnail.css('background-image', 'url('+video.thumbnail_360_url+')');
        $thumbnail.click(function() {
            var appControl = new tizen.ApplicationControl('video', video.url);
            tizen.application.launchAppControl(appControl, tizen.application.getCurrentApplication().appInfo.id,
                function() {
                    console.log("launch application control succeed");
                },
                function(e) {
                    console.log("launch application control failed. reason: " + e.message);
                }
            );
        });
        $slidee.append($thumbnail);
    });

    var sly = new Sly('#frame', {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'swing'
    }).init();

    sly.on('active', function(eventName, itemIndex) {
        selectedVideoAtIndex(itemIndex);
    });

    selectedVideoAtIndex(0);

    $('#reload').removeClass('reload-rotate');
}

$(function () {

    refresh();

    $('#dailymotion').click(function() {
        tizen.application.launch(tizen.application.getCurrentApplication().appInfo.id);
    });

    $('#reload').click(function() {
        $(this).addClass('reload-rotate');
        window.appwidget.sendMessageToBox('reload');
    });

    if (typeof window.appwidget != 'undefined') {
        listenBoxMessage();
    } else {
        window.addEventListener("appwidgetready", onAppWidgetReady, false);
    }

    function onAppWidgetReady() {
        listenBoxMessage();
    }

    function listenBoxMessage() {
        window.addEventListener("boxmessage",
        function(e) {
            refresh();
        }, false);
    }

}());