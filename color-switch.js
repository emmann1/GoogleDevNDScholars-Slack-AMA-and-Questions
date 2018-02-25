if(localStorage.getItem('link') != null){
    $('link[name=color]').attr({href: localStorage.getItem('link')});
  };

$(document).ready(function(){

    $("#bright").on("click", function(){
        localStorage.setItem('link', 'style-bright.css');
        $('link[name=color]').attr({href: localStorage.getItem('link')});
      });
    $("#dark").on("click", function(){
        localStorage.setItem('link', 'style.css');
        $('link[name=color]').attr({href: localStorage.getItem('link')});
      });
});