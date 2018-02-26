if(localStorage.getItem('googledevndscholars-ama-color') != null){
    $('link[name=color]').attr({href: localStorage.getItem('googledevndscholars-ama-color')});
  };

$(document).ready(function(){

    $("#bright").on("click", function(){
        localStorage.setItem('googledevndscholars-ama-color', 'css/style-bright.css');
        $('link[name=color]').attr({href: localStorage.getItem('googledevndscholars-ama-color')});
      });
    $("#dark").on("click", function(){
        localStorage.setItem('googledevndscholars-ama-color', 'css/style.css');
        $('link[name=color]').attr({href: localStorage.getItem('googledevndscholars-ama-color')});
      });
});