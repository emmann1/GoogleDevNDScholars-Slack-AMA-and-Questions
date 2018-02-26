var schedule;
fetch('js/schedule.json')
  .then(response => response.json())
  .then(jsonResponse => schedule = jsonResponse)
  .then(function(){
      $(".main").append("<h2>Schedule for AMA sessions on Slack</h2><div class='schedule'><ul>");
      for(i=0;i<schedule.length;i++){
          $(".main div ul").append("<li>"+schedule[i].date+" : "+schedule[i].time+"</li>");
      }
      $(".main").append("</ul></div>");
  });