/*jslint indent: 2, maxlen: 80, nomen: true */
/*global console, window, document, rJS, RSVP, $ */
(function ($, window, RSVP, rJS) {
  "use strict";

  rJS(window)
  .ready(function(g){
    g.render();
  }).declareMethod("render",function(){
    var g = this;
    g.time_selected = "Day";
    g.offset = 0;
    g.getButtonList()
    .push(function(oButtons){
        for (var i = oButtons.length - 1; i >= 0; i--) {
            oButtons[i].addEventListener('click',function(){
                if (this.innerHTML != g.time_selected){
                    $('.time-'+g.time_selected).attr('class','btn-sm btn-primary time-selector time-'+g.time_selected);
                    $(this).attr('class','btn-sm btn-success time-selector time-'+this.innerHTML);
                    g.time_selected = this.innerHTML;
                    g.initOffset();
                };
            });
        };
    });
    g.getOffsetButton()
    .push(function(button_list){
      for (var i = button_list.length - 1; i >= 0; i--) {
        button_list[i].addEventListener('click',function(){
          switch (this.innerHTML){
            case " &lt;&lt; ":
              g.offset -= 7;
              break;
            case " &lt; ":
              g.offset--;
              break;
            case " &gt; ":
              g.offset++;
              break;
            case " &gt;&gt; ":
              g.offset+=7;
              break;
          };
          if (g.time_selected == "Day" || g.time_selected == "Week"){
            if (g.offset <= 0){
              g.offset = 0;
              button_list[0].style.display = "none";
              button_list[1].style.display = "none";
            } else {
              if (g.offset < 7){
                button_list[1].style.display = "block";
                button_list[0].style.display = "none";
              } else {
                button_list[0].style.display = "block";
              }
            }
          } else {
            if (g.offset <= 0){
              g.offset = 0;
              button_list[1].style.display = "none";
            } else {
              button_list[1].style.display = "block";
            }
          }
          g.printDate();
        });
      };
    });
    g.initOffset();
  })
  /* ======================== METHODS TO EXPOSE ========================= */
  .declareMethod("getButtonList",function(){
    return this.getElement()
    .push(function(element){
      return $(element).find(".time-selector");
    });
  })
  .declareMethod("getTimeSelected",function(){
    return this.time_selected;
  })
  .declareMethod("getOffset",function(){
    return this.offset;
  })
  .declareMethod("getOffsetButton",function(){
    return this.getElement()
    .push(function(element){
      return $(element).find(".offset-selector");
    });
  })
  .declareMethod("printDate",function(){
    var g = this;
    g.getElement()
    .push(function(element){
      var date = new Date();
      var date_elem = $(element).find(".date-selected").eq(0);
      if (g.time_selected == "Day" || g.time_selected == "Week"){
        date.setDate(date.getDate() + g.offset);
        date_elem.html(date.getMonth() + "/" + date.getDate());
      } else {
        if (g.time_selected == "Month"){
          date.setMonth(date.getMonth() + g.offset);
          date_elem.html(date.getMonth());
        } else {
          date_elem.html("");
        }
      }
    })
  })
  .declareMethod("initOffset",function(){
    var g = this;
    g.getOffsetButton()
    .push(function(button_list){
      g.offset = 0;
      for (var i = button_list.length - 1; i >= 0; i--) {
        button_list[i].style.display = "block";
      };
      button_list[0].style.display = "none";
      button_list[1].style.display = "none";
      if (g.time_selected == "Month"){
        button_list[3].style.display = "none";
      } else {
        if (g.time_selected == "Quarter"){
          button_list[2].style.display = "none";
          button_list[3].style.display = "none";
        }
      }
      g.printDate();
    })
  })

}($, window, RSVP, rJS))