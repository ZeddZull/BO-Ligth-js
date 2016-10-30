(function ($,rJS, RSVP, JSON){
  
  var gk = rJS(window);


  $.fn.dataTableExt.oSort['num-spe-asc']  = function(x,y) {
    x = x.substring(0,x.indexOf('<')-1)*1;
    y = y.substring(0,y.indexOf('<')-1)*1;    
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
  };

  $.fn.dataTableExt.oSort['num-spe-desc']  = function(x,y) {
    x = x.substring(0,x.indexOf('<')-1)*1;
    y = y.substring(0,y.indexOf('<')-1)*1;    
    return ((x > y) ? -1 : ((x < y) ?  1 : 0));
  };

  gk.declareMethod("setData",function(option){
    var g = this;
    return g.getElement()
    .push(function(element){
      var oTable = $(element).find(".table-data").eq(0);
      var dataTable = $.fn.dataTable;
      if (dataTable.isDataTable(g.table)){
        g.table.fnDestroy();
      }
      g.table = oTable.dataTable(option);
      g.table.on( 'draw.dt', initPopover);
      return g;
    }).push(function(){
      initPopover();
    });
  })
  .declareMethod("clearData",function(){
    var g = this;
    return g.getElement()
    .push(function(element){
      var oTable = $(element).find(".table-data").eq(0);
      var dataTable = $.fn.dataTable;
      if (dataTable.isDataTable(g.table)){
        g.table.fnDestroy();
      }
      oTable.html("");
    });
  });

  var initPopover = function () {
    $('[data-toggle="popover"]').popover()

    $('body').on('click', function (e) {
      $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          $(this).popover('hide');
        }
      });
    });
  };

}($,rJS, RSVP, JSON));