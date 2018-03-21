var transcripts, schedule;
function linkify(txt) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return txt.replace(urlRegex, function(url) {
        return '<a href="' + url + ' " target="_blank">' + url + '</a>';
    });
};
function display(amaSession, questionId){
  let trackName = transcripts[amaSession].questions[questionId].track;
  let trackColor = trackName == "and" ? "and" : trackName == "fend" ? "fend" : trackName == "mws" ? "mws" : trackName == "n/a" ? "na": null;
  let spanColor = transcripts[amaSession].type == "general" ? "magenta" : transcripts[amaSession].type == "tehnical" ? "cyan" : transcripts[amaSession].type == "special" ? "green" : null;
  $(".main").append("<div class='item'></div>");
  $(".main .item").last().append("<span class='q'>Q:</span><p class='question'>"+linkify(transcripts[amaSession].questions[questionId].q)+"</p>");  
  $(".main .item").last().append("<span class='a'>A:</span><p>"+linkify(transcripts[amaSession].questions[questionId].a)+"</p>");
  if(transcripts[amaSession].questions[questionId].attach != undefined){
      $(".main .item").last().append("<div class='attachment'><a href='"+transcripts[amaSession].questions[questionId].attach+"'><img src='"+transcripts[amaSession].questions[questionId].attach+"'/></div>");
  }
  $(".main .item").last().append("<p class='meta'>"+transcripts[amaSession].datetime+" <span class='"+spanColor+"'>"+transcripts[amaSession].type+"</span> <span class='"+trackColor+"'>"+transcripts[amaSession].questions[questionId].track+"</span></p>");
  
}
function defaultDisplay(datetimeSelector){
    $(".main").children().remove();
    for(i=0;i<transcripts.length;i++){
        if(transcripts[i].datetime == datetimeSelector){
            if(transcripts[i].description != undefined && transcripts[i].attach != undefined){
                $(".main").append("<div class='session-description'><img src='uploads/"+transcripts[i].attach+"'><h3>"+transcripts[i].description+"</h3></div>");
            }
            for(j=0;j<transcripts[i].questions.length;j++){
                display(i,j);
            }
        }
    }
    showFirstFive();
};

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


fetch('js/transcripts.json')
  .then(response => response.json())
  .then(jsonResponse => transcripts = jsonResponse)
  .then(function(){
    for(i=0;i<transcripts.length;i++){
      $("#datetime-select").append("<option value='"+transcripts[i].datetime+"'>"+transcripts[i].datetime+"</option>");
    };
    let datetimeSelector = $("#datetime-select").val(); 
    defaultDisplay($("#datetime-select").val());
    
    
  });
  fetch('js/schedule.json')
  .then(response => response.json())
  .then(jsonResponse => schedule = jsonResponse)
  .then(function(){
    let utc = new Date().toJSON();
    let date = utc.slice(0,10);
    let hour = utc.slice(11,13);
    let minute = utc.slice(14,16);
    let index;
    for(i=0;i<schedule.length;i++){
        if( schedule[i].date.slice(3,5) + schedule[i].date.slice(0,2) + (parseInt(schedule[i].time.slice(0,2))+12) > date.slice(5,7) + date.slice(8,10) + hour ){
            index = i;
            break;
        }
    }
    $(".next-ama").children().remove();
    $(".next-ama").append("<em>Next session of AMA: " +schedule[index].date + " : " + schedule[index].time + "</em>");
    
  });
  function showFirstFive(){
      let items = $(".item"); 
      items.slice(0,5).attr('name', 'first-five');
  }

$(document).ready(function(){
    
    $(".more").click(function(){
        $(".item:hidden").slice(0,5).slideDown();
        if($(".item:hidden").length == 0){
            $(".more").hide();
        }
    });

    $("#datetime-select").change(function(){
        $(".more").show();
        defaultDisplay($("#datetime-select").val());
    });

    //change ditetime acording to the type of ama session
    $("#type").change(function(){
        $(".more").show();
        let typeSelector = $("#type").val();
        $("#datetime-select").children().remove();
        if(typeSelector == "all"){
          for(i=0;i<transcripts.length;i++){
            $("#datetime-select").append("<option value='"+transcripts[i].datetime+"'>"+transcripts[i].datetime+"</option>");
          }
          defaultDisplay($("#datetime-select").val());
        }else{
          for(i=0;i<transcripts.length;i++){
            if(transcripts[i].type == typeSelector){
              $("#datetime-select").append("<option value='"+transcripts[i].datetime+"'>"+transcripts[i].datetime+"</option>");
            }
          }
        }
      });

      //checkboxes displaying respective questions
      $(".check-boxes input").on("click", function(){
        $(".more").show();
        let datetimeSelector = $("#datetime-select").val();
        let typeSelector = $("#type").val();
        let checkedInputs = $("input:checked");
        if(checkedInputs.length != 0){
          $(".main").children().remove();
          for(i=0;i<checkedInputs.length;i++){
            for(k=0;k<transcripts.length;k++){
              for(l=0;l<transcripts[k].questions.length;l++){
                if(transcripts[k].questions[l].track == checkedInputs[i].value){
                  display(k,l);
                }
              }
            }
          }
          showFirstFive();
        }else{
         defaultDisplay($("#datetime-select").val());
        }
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
              for(i=0;i<transcripts.length;i++){
                  for(j=0;j<transcripts[i].questions.length;j++){
                      let le = '\\b';
                      le+= escapeRegExp(searchQuery);
                      le+= '\\b';
                      let re = new RegExp(le, "i");
                    qsearch = transcripts[i].questions[j].q.toLowerCase().search(re);
                    asearch = transcripts[i].questions[j].a.toLowerCase().search(re);
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
                    for(i=0;i<transcripts.length;i++){
                        for(j=0;j<transcripts[i].questions.length;j++){
                            let searchStringResults =[];
                            for(l=0;l<searchArray.length;l++){
                                
                                if(searchArray[l] != ""){
                                    let le = '\\b';
                                    le+= escapeRegExp(searchArray[l]);
                                    le+= '\\b';
                                    let re = new RegExp(le, "i");
                                    qsearch = transcripts[i].questions[j].q.toLowerCase().search(re);
                                    asearch = transcripts[i].questions[j].a.toLowerCase().search(re);
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
