/*jslint indent: 2, maxlen: 80, nomen: true */
/*global console, window, rJS, jIO, RSVP */
(function (window, rJS, jIO, RSVP){
  
  var gk = rJS(window);

  var jio = jIO.createJIO({
    type:"query",
      sub_storage:{
        type:"replicate",
        conflict_handling:2,
        local_sub_storage:{
          type:"indexeddb",
          database:"payzenDb"
        },
        remote_sub_storage:{
          type:"payzenStorage",
          path:"/allPayments"
        }
      }
    });

  gk.declareMethod("getPayment",function(time,offset){
    var dates = getDates(time,offset);
    return jio.allDocs()
    .push(function(data){
      var data = data;
      var promises = [];
      data.data.rows.forEach(function(row){
        promises.push(jio.get(row.id));
      });
      return RSVP.all(promises)
      .then(function(values){
        var rows = new Array();
        for (var i = data.data.rows.length - 1; i >= 0; i--) {
          if (!/_replicate/.test(data.data.rows[i].id)){
            var date = (new Date(values[i].paymentResponse_creationDate)).toISOString();
            if ( dates[0] < date && date < dates[1]){
              data.data.rows[i].value = values[i];
              rows.push(data.data.rows[i]);
            }          
          }
        };
        data.data.rows = rows;
        data.data.total_rows = rows.length;
        return data;
      });
    })
    .fail(function(error){
      console.log(error);
    });
  })
  .declareMethod("syncAll",function(){
    return jio.repair().fail(function(error){
      console.log(error)
    });
  })
  .declareService(function(){
    return this.syncAll();
  });

  var getDates = function(time,offset){
    var dateBefore,interval;
    var dateAfter = new Date();
    dateAfter.setHours(0);
    dateAfter.setMinutes(0);
    dateAfter.setSeconds(0);
    dateAfter.setDate(dateAfter.getDate() + 1);
    // dateAfter = aujourd'hui a 00h00
    dateBefore = new Date(dateAfter.getTime());
    switch(time){
      case "Day":
        dateBefore.setDate(dateBefore.getDate() - 1);
        break;
      case "Week":
        dateBefore.setDate(dateBefore.getDate() - 7);
        break;
      case "Month":
        dateBefore.setMonth(dateBefore.getMonth() - 1);
        break;
      default:
        dateBefore.setMonth(dateBefore.getMonth() - 3);
        break;
    }
    if (time == "Day" || time == "Week"){
      for (var i = 0; i < offset; i++) {
        dateBefore.setDate(dateBefore.getDate() - 1 );
        dateAfter.setDate(dateAfter.getDate() - 1);
      };
    } else {
      for (var i = 0; i < offset; i++) {
        dateBefore.setMonth(dateBefore.getMonth() - 1 );
        dateAfter.setMonth(dateAfter.getMonth() - 1);
      };
    }
    return [dateBefore.toISOString(),dateAfter.toISOString()];
  }
}(window, rJS, jIO, RSVP));