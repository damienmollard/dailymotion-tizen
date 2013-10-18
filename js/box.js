function queryVideos() {

    $.ajax({
        type: 'GET',
        url: 'https://api.dailymotion.com/videos?fields=thumbnail_360_url,title,url,owner.screenname&filters=featured',
        dataType: 'json',
        success : function(json){

            var video = json.list[0];

            $widget = $('#widget');

            $thumbnail = $('<div id="widget-thumbnail"></div>');
            $thumbnail.css('background-image', 'url('+video.thumbnail_360_url+')');
            $widget.append($thumbnail);

            $title = $('<div id="widget-title"><strong>'+video.title+'</strong><br>'+video['owner.screenname']+'</div>');
            $widget.append($title);

            $widget.click(function() {
                var appControl = new tizen.ApplicationControl('video', video.url);
                tizen.application.launchAppControl(appControl, '4u6xW8kjeB.Dailymotion',
                    function() {
                        console.log("launch application control succeed");
                    },
                    function(e) {
                        console.log("launch application control failed. reason: " + e.message);
                    }
                );
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

(function () {

    if (window.innerWidth < 100) {
        // 1x1 widget
        $('#widget').click(function() {
            tizen.application.launch('4u6xW8kjeB.Dailymotion');
        });
    } else {
        // other sizes
        queryVideos();
    }
}());