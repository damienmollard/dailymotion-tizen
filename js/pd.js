(function () {

    $('button').click(function() {

        /*
        var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", 'http://www.google.fr');
        tizen.application.launchAppControl(appControl, null,
            function() {
                console.log("launch application control succeed");
            },
            function(e) {
                console.log("launch application control failed. reason: " + e.message);
            }
        );
        */
        tizen.application.launch('3vhELnN8vM.Dailymotion');
    });

}());