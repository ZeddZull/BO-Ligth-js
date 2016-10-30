/*jslint indent: 2, maxlen: 80, nomen: true */
/*global console, window, document, rJS, RSVP, $ */
(function ($, window, RSVP, rJS) {
  "use strict";

  rJS(window)
  .ready(function(g){
    g.render();
  })
  .declareMethod("render",function(){
    var g = this;
    g.nav_main_gadget()
    .push(function(main_gadget){
      g.main_gadget = main_gadget;
      return g.getDeclaredGadget("timeSelector");
    }).push(function(gadget){
      g.time_selector = gadget;
      gadget.getButtonList()
      .push(function(button_list){
        for (var i = button_list.length - 1; i >= 0; i--) {
          button_list[i].addEventListener('click',function(){
            g.changePage("current",this.innerHTML,0);
          });
        };
        g.current_page = $(g.main_gadget.__element).find(".current_page")[0];
      return gadget.getOffsetButton();
      })
      .push(function(button_list){
        for (var i = button_list.length - 1; i >= 0; i--) {
          button_list[i].addEventListener('click',function(){
            g.changePage("current",gadget.time_selected,gadget.offset);
          })
        };
      })

    });

  })
  /* ======================== METHODS TO EXPOSE ========================= */
  .declareMethod("addPages",function(page_list){
    var g = this;
    return g.getElement()
    .push(function(element){
      var oLi, oLink, oButton;
      page_list.forEach(function(page){
        oLi = $('<li class="active"></li>');
        oLink = $('<a style="padding:0.5em 1em;"></a>');
        oButton = $('<button type="button" class="btn btn-link" value="'+page.gadget+'">'+page.title+'</button>');
        oLink.append(oButton);
        oLi.append(oLink);
        $(element).find('.urls-list').append(oLi);
        oButton.on('click',function(){
          g.changePage(this.value,"current",0);
        });
      });

      return g;
    });
  })
  .declareMethod('changePage',function(gadget,time,offset=0){
    var g = this;
    if (g.selected_page != gadget && gadget != "current"){
      g.main_gadget.dropGadget("current_page");
      $(g.current_page).html("");
      g.selected_page = gadget;
      return g.main_gadget.declareGadget(gadget,{
        element:g.current_page,
        scope:"current_page"
      })
      .push(function(current_gadget){
        if (time == "current"){
            g.time_selector.getTimeSelected()
            .push(function(time){
              current_gadget.setContent(time,offset);
            });
        } else {
          current_gadget.setContent(time,offset);
        }
      });
    } else {
      g.main_gadget.getDeclaredGadget("current_page")
      .push(function(current_gadget){
        current_gadget.setContent(time,offset);
      })
    };
  })
  /* ========================= METHODS NEEDED =========================== */
  .declareAcquiredMethod("nav_main_gadget","main_gadget");

}($, window, RSVP, rJS))