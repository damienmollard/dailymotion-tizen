function queryVideos() {

    $.ajax({
        type: 'GET',
        url: 'https://api.dailymotion.com/videos?fields=thumbnail_360_url,title,url,owner.screenname&filters=featured',
        dataType: 'json',
        success : function(json){

            localStorage.videos = JSON.stringify(json.list);
            window.appwidget.sendMessageToPd('reload');

            var video = json.list[0];

            $('#widget-thumbnail').css('background-image', 'url('+video.thumbnail_360_url+')');
            $('#title').html(video.title);
            $('#owner').html(video['owner.screenname']);

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

        },
        error : function() {
            //console.log("Error");
        },
        complete: function() {
            //console.log("Complete");
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