$(document).ready(function() {

    // Back Button
    var BackButton = (function(){

        var button = document.querySelector('.back.button'),
            $button = $(button),
            disabled = true,
            history = [],
            clicked = false,
            enable, disable, onClick, log, back;

        try
        {
            enable = function()
            {
                disabled = false;
                $button.removeClass('disabled');
            };

            disable = function()
            {
                disabled = true;
                $button.addClass('disabled');
            };

            onClick = function()
            {
                if (disabled) return;

                clicked = true;

                BackButton.targetWindow.history.back();
                history.shift();

                if (history.length === 0)
                {
                    disable();
                }

                console.log(history);
            };

            log = function(data)
            {
                if (clicked)
                {
                    clicked = false;
                    return;
                }

                history.unshift(data);
                if (disabled) enable();

                console.log(history);
            };

            $button.on('click touchend', onClick);
        }
        catch (e)
        {
            enable = disable = log = function(){};
        }

        return {
            enable: enable,
            disable: disable,
            log: log,
            disabled: disabled
        };
    }());

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
    var $iframeDaily = $('<iframe id="iframeDaily" src="http://touch.dailymotion.com/" style="width: 100%; height: 0; border: none;"></iframe>'),
        iframeDaily = $iframeDaily[0];

    $iframeDaily.on('load', function()
    {
        // Start App
        setTimeout(function()
        {
            Spinner.hide();
            Cover.hide();
        }, 0);

        var iframeWindow = iframeDaily.contentWindow,
            iframeDocument = iframeDaily.contentDocument,
            started = true;

        BackButton.targetWindow = iframeWindow;

        iframeDaily.style.height = iframeDaily.style.maxHeight = (window.innerHeight - 50) + 'px';

        iframeWindow.addEventListener('pagechange', function(e)
        {
            if (!started)
            {
                started = true;
            }
            else
            {
                BackButton.log(e.data);
            }
        });
    });

    $iframeDaily.appendTo(document.body);
});