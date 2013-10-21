$(document).ready(function() {

    var url = 'http://touch.preprod.dailymotion.com'; // 'http://touch.dailymotion.com';

    var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
    if (reqAppControl && reqAppControl.appControl && reqAppControl.appControl.operation === 'video') {
        // App was launched from DynamicBox : deep link to video
        url = reqAppControl.appControl.uri;
    }

    // Show splash screen for 3 seconds
    setTimeout(function() {
        location.replace(url);
    }, 3000);

});