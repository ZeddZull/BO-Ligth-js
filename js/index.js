/*jslint indent: 2, maxlen: 80, nomen: true */
/*global console, window, document, rJS, RSVP, $ */
(function (window, document, rJS, RSVP) {
  "use strict";

  var STORAGE_GADGET = "./gadget/payzen",
    NAVIGATION_GADGET = "./gadget/navigation";

  rJS(window)

    /**
    * ready handler executing when the gadget is ready
    * @method  ready
    * @param   {Object}  g  Gadget object
    */
    .ready(function (g) {
        g.render()
    })

    /* ==================================================================== */
    /*                             ENTRY POINT                              */
    /* ==================================================================== */
    /**
    * main gadget initializer which loads all gadgets and calls render
    * method of each gadget if it's available
    * @method  render
    */
    .declareMethod('render', function () {
      var g = this;

      // load init gadgets
      return g.getDeclaredGadget("navigation")
      .push(function(gadget){
        return gadget.addPages([{"title":"Sales","gadget":"salesGadget.html"},{"title":"Payment","gadget":"paymentGadget.html"}]);
      })
      .push(function(gadget){
        gadget.render();
        return gadget.changePage("paymentGadget.html","Day",0);
      });
    })
    /* ======================== METHODS EXPOSED =========================== */
    .declareMethod("pass_main_gadget",function(){
      return this;
    })
    /* ========================= METHODS NEEDED =========================== */

    /* ==================================================================== */
    /*                            METHOD INDEX                              */
    /* ==================================================================== */
    .allowPublicAcquisition("storage_getPayment",function(param){
      return this.getDeclaredGadget("storage")
      .push(function(storage){
        return storage.getPayment(param[0],param[1]);
      });
    })
    .allowPublicAcquisition("main_gadget",function(){
      return this.pass_main_gadget();
    })

}(window, document, rJS, RSVP));