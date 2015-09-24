$(document).ready(function() {
  $.getScript("assets/plugins/backstretch/jquery.backstretch.min.js", function() {
    $(".fullscreen-static-image").backstretch("assets/img/bg/img1.jpg");
  });
});