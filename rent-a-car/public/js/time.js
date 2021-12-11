(function($) {
    $( document ).ready(function() {
        var time = $('#time');
        (function getTime() {
            $.ajax({
                method: "GET",
                url : "http://worldtimeapi.org/api/timezone/America/New_York",
                success: function(data) {
                    let currenttime = new Date(data.datetime).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    });
                    time.html(currenttime);
                 },
                complete: function() {
                setTimeout(getTime, 5000);
              }
            });
          })();
    });
})(window.jQuery);