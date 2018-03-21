var schedule;
fetch('js/schedule.json')
  .then(response => response.json())
  .then(jsonResponse => schedule = jsonResponse)
  .then(function(){
      let utc = new Date().toJSON();
      let date = utc.slice(0,10);
      let hour = utc.slice(11,13);
      let minute = utc.slice(14,16);
        $(".main").append("<h2>Schedule for AMA sessions on Slack</h2><div class='schedule'><ul>");
        for(i=0;i<schedule.length;i++){
            if( schedule[i].date.slice(3,5) + schedule[i].date.slice(0,2) + (parseInt(schedule[i].time.slice(0,2))+12) <= date.slice(5,7) + date.slice(8,10) + hour  ){
                    $(".main div ul").append("<li class='strikethrough'>"+schedule[i].date+" : "+schedule[i].time+"</li>");
            }else{
                $(".main div ul").append("<li>"+schedule[i].date+" : "+schedule[i].time+"</li>");
        }
    }
      $(".main").append("</ul></div>");
  });