(function($) {
    $( document ).ready(function() {
        var time = $('#time');
        (function getTime() {
            $.ajax({
                method: "GET",
                url : "http://worldtimeapi.org/api/timezone/America/New_York",
                success: function(data) {
                    time.html(data.datetime.substr(11,5));
                 },
                complete: function() {
                setTimeout(getTime, 5000);
              }
            });
          })();
    });
})(window.jQuery);