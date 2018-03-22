var officeHours;
function linkify(txt) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return txt.replace(urlRegex, function(url) {
        return '<a href="' + url + ' " target="_blank">' + url + '</a>';
    });
};
function username(txt) {
    var urlRegex =/@\w([^\s]+)/ig;
    return txt.replace(urlRegex, function(url) {
        return '<span class="username">' + url + '</span>';
    });
};
function display(amaSession, questionId){
  let trackName = officeHours[amaSession].questions[questionId].track;
  let trackColor = trackName == "html" ? "and" : trackName == "css" ? "fend" : trackName == "javascript" ? "mws" : trackName == "n/a" ? "na": null;
  let spanColor = officeHours[amaSession].type == "html" ? "magenta" : officeHours[amaSession].type == "css" ? "cyan" : officeHours[amaSession].type == "javascript" ? "green" : null;
  $(".main").append("<div class='item'></div>");
  $(".main .item").last().append("<span class='q'>Q:</span><p class='question'>"+username(linkify(officeHours[amaSession].questions[questionId].q))+"</p>");  
  $(".main .item").last().append("<span class='a'>A:</span><p>"+username(linkify(officeHours[amaSession].questions[questionId].a))+"</p>");
  if(officeHours[amaSession].questions[questionId].attach != undefined){
      $(".main .item").last().append("<div class='attachment'><a href='"+officeHours[amaSession].questions[questionId].attach+"'><img src='"+officeHours[amaSession].questions[questionId].attach+"'/></div>");
  }
  $(".main .item").last().append("<p class='meta'>"+officeHours[amaSession].datetime+" <span class='"+trackColor+"'>"+officeHours[amaSession].questions[questionId].track+"</span></p>");
  
}
function defaultDisplay(datetimeSelector){
    $(".main").children().remove();
    for(i=0;i<officeHours.length;i++){
        if(officeHours[i].datetime == datetimeSelector){
            if(officeHours[i].description != undefined && officeHours[i].attach != undefined){
                $(".main").append("<div class='session-description'><img src='uploads/"+officeHours[i].attach+"'><h3>"+officeHours[i].description+"</h3></div>");
            }
            for(j=0;j<officeHours[i].questions.length;j++){
                display(i,j);
            }
        }
    }
    showFirstFive();
};

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


fetch('js/office-hours.json')
  .then(response => response.json())
  .then(jsonResponse => officeHours = jsonResponse)
  .then(function(){
    for(i=0;i<officeHours.length;i++){
      $("#datetime-select").append("<option value='"+officeHours[i].datetime+"'>"+officeHours[i].datetime+"</option>");
    };
    let datetimeSelector = $("#datetime-select").val(); 
    defaultDisplay($("#datetime-select").val());
    
    
  });
  function showFirstFive(){
      let items = $(".item"); 
      items.slice(0,2).attr('name', 'first-five');
  }

$(document).ready(function(){
    
    $(".more").click(function(){
        $(".item:hidden").slice(0,2).slideDown();
        if($(".item:hidden").length == 0){
            $(".more").hide();
        }
    });

    $("#datetime-select").change(function(){
        $(".more").show();
        defaultDisplay($("#datetime-select").val());
    });

      //search results
      $("#search-button").on("click", function(e){
        $(".more").show();
          let searchQuery = String($("#search-input").val()).toLowerCase();
          let searchArray = searchQuery.split(" ");
          if(searchQuery != "" && searchQuery.length > 2 ){
              e.preventDefault();
              let results = [];
              let qsearch, asearch;
              $(".main").children().remove();
              for(i=0;i<officeHours.length;i++){
                  for(j=0;j<officeHours[i].questions.length;j++){
                      let le = '\\b';
                      le+= escapeRegExp(searchQuery);
                      le+= '\\b';
                      let re = new RegExp(le, "i");
                    qsearch = officeHours[i].questions[j].q.toLowerCase().search(re);
                    asearch = officeHours[i].questions[j].a.toLowerCase().search(re);
                    if(qsearch != -1 || asearch != -1){
                        results.push([i,j]);
                      }
                      
                    }
                }
                $(".main").append("<h3>"+results.length+" Results for:"+searchQuery+"</h3>");
                    results.forEach(function(el){
                        display(el[0], el[1]);
                    });
                    showFirstFive();
                if(results.length != 0 ){
                    
                }
                if(results.length == 0){
                    for(i=0;i<officeHours.length;i++){
                        for(j=0;j<officeHours[i].questions.length;j++){
                            let searchStringResults =[];
                            for(l=0;l<searchArray.length;l++){
                                
                                if(searchArray[l] != ""){
                                    let le = '\\b';
                                    le+= escapeRegExp(searchArray[l]);
                                    le+= '\\b';
                                    let re = new RegExp(le, "i");
                                    qsearch = officeHours[i].questions[j].q.toLowerCase().search(re);
                                    asearch = officeHours[i].questions[j].a.toLowerCase().search(re);
                                    if(qsearch != -1 || asearch != -1){
                                        searchStringResults.push(true);
                                    }
                                    
                                }
                            }
                            if(searchStringResults[0] == true && searchStringResults[1] == true){
                                results.push([i,j]);
                                    }
                        }
                    }
                    
                    $(".main").append("<h3>Displaying "+results.length+" results for:"+searchArray+"</h3>");
                    results.forEach(function(el){
                        display(el[0], el[1]);
                    });
                    showFirstFive();
                }
                if(results.length < 5){
                    $(".more").hide();
                }
                if(results.length == 0){
                    $(".more").hide();
                    $(".main").children().remove();
                    $(".main").append("<h2>Nothing found!</h2>");
                }
            }
        });

    // small screeen menu hide
  $(".rolldown").click(function(){
    if($(".filters").css('display') == "none"){
      $(".filters").slideDown();
    }else{
      $(".filters").slideUp();
    }
  });

  
});
