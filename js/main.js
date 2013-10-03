var urls = [];
var logUrl = true;

function goBack() {
    if (urls.length === 0) {
        tizen.application.getCurrentApplication().exit();
    } else {
        logUrl = false;
        urls.shift();
        console.log(urls);
        document.getElementById('iframeDaily').contentWindow.history.back();
    }
}

$(document).ready(function() {

    // Spinner
    var Spinner = (function(){
        var spinner = document.getElementById('spinner');

        return {
            show: function() { spinner.style.display = 'block'; },
            hide: function() { spinner.style.display = 'none'; }
        };
    }());

    // Cover Page
    var Cover = (function(){
        var cover = document.getElementById('cover'),
            $cover = $(cover);

        return {
        	show: function() { $cover.removeClass('off'); },
        	hide: function() { $cover.addClass('off'); }
        };
    }());

    // Iframe
    var $iframeDaily = $('#iframeDaily'),
        iframeDaily = $iframeDaily[0];

    $iframeDaily.on('load', function() {

        // Start App
        setTimeout(function() {
            Spinner.hide();
            Cover.hide();
        }, 0);

        iframeDaily.contentWindow.addEventListener('pagechange', function(e) {
            if (!logUrl) {
                logUrl = true;
                return;
            }
            urls.unshift(e.data);
            console.log(urls);
        });
    });

    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
            goBack();
        }
    });

    /*
    // Enable screen auto-rotation
    tizen.systeminfo.addPropertyValueChangeListener('DEVICE_ORIENTATION', function(orientation) {
        var orientationStatus = orientation.status.toLowerCase().replace('_', '-');
        screen.unlockOrientation();
        screen.lockOrientation(orientationStatus);
    }, function(error) {
        throw "Impossible de modifier l'orientation.";
    });
    */

});
