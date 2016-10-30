/*jslint indent: 2, maxlen: 80, nomen: true */
/*global console, window, document, rJS, RSVP, $ */
(function ($, window, RSVP, rJS) {
  "use strict";

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
    return [dateBefore,dateAfter];
  }

  var addUnique = function(array,element){
  	if (array.indexOf(element) < 0){
  		array.push(element);
  		return true;
  	}
  	return false;
  }

  rJS(window)
  .ready(function(g){
    g.render();
  })
  .declareMethod("render",function(){

  })
  .declareMethod("setContent",function(time,offset){
    var g = this;
    g.getAllPayment(time,offset)
    .push(function(data){
    	g.getDeclaredGadget("table")
			.push(function(gadget){
	      var dates = getDates(time,offset);
	      var result = new Array();
	      var row,j;
	      switch (time){
	        case "Day":
	        var client_time = new Array();
	          result.push({time:"Total",amount:0,orders:0,client:0,payed:0,refused:0});
	          result.push({time:"Credit",amount:0,orders:0,client:0,payed:0,refused:0});
	          for (var i = 23 ; i >= 0; i--) {
	          	result.push({time: (i < 10 ? '0' + i : i+'' )+':00' ,amount:0,orders:0,client:0,payed:0,refused:0})
	          	client_time.push(new Array());
	          };
	          var client_refused = new Array();
	          var client_credit = new Array();
	          var client = new Array();
	          for (var i = data.data.rows.length - 1; i >= 0; i--) {
	          	row = data.data.rows[i].value;
	          	if (row.paymentResponse_operationType){ // Payment credit
	          		if (row.commonResponse_transactionStatusLabel == "REFUSED"){
	          			if (addUnique(client_refused,row.customerResponse_billingDetails_reference)){
	          				result[1].refused++;
	          				result[1].orders++;
	          			}
	          		} else {
	          			result[1].amount -= row.paymentResponse_amount;
	          			addUnique(client_credit,row.customerResponse_billingDetails_reference);
	          			result[1].payed++;
	          			result[1].orders++;
	          		}
	          	} else { // payment debit
	          		j = 25 - (new Date(row.paymentResponse_creationDate)).getHours();
	          		if (row.commonResponse_transactionStatusLabel == "REFUSED"){
	          			if (addUnique(client_refused,row.customerResponse_billingDetails_reference)){
	          				result[j].refused++;
	          				result[j].orders++;
	          				result[0].refused++;
	          				result[0].orders++;
	          				addUnique(client_time[j-2],row.customerResponse_billingDetails_reference);
	          			}
	          		} else {
	          			result[0].amount += row.paymentResponse_amount;
	          			result[j].amount += row.paymentResponse_amount;
	          			addUnique(client,row.customerResponse_billingDetails_reference);
	          			addUnique(client_time[j-2],row.customerResponse_billingDetails_reference);
	          			result[0].payed++;
	          			result[0].orders++;
	          			result[j].payed++;
	          			result[j].orders++;
	          		}
	          	}
	          };
	          result[0].client = client.length;
	          result[1].client = client_credit.length;
	          for (var i = client_time.length - 1; i >= 0; i--) {
	          	result[i+2].client = client_time[i].length;
	          };
	          gadget.setData({
			        "aaData":result,
			        "aoColumns":[{
		          	"sTitle":"Time",
		          	"mData":"time"
		          },{
		          	"sTitle":"Amount",
		          	"mData":"amount"
		          },{
		          	"sTitle":"Orders",
		          	"mData":"orders"
		          },{
		          	"sTitle":"Clients",
		          	"mData":"client"
		          },{
		          	"sTitle":"Payed",
		          	"mData":"payed"
		          },{
		          	"sTitle":"Refused",
		          	"mData":"refused"
		          }],
				      "searching": false,
							"paging": false,
					    "ordering": false
		        });
	          break;
	        case "Week":
	        	
	          break;
	        default:
	        	gadget.clearData();
	          break;
	      }
	    });
    });
  })
  .declareAcquiredMethod("nav_main_gadget","main_gadget")
  .declareAcquiredMethod("getAllPayment","storage_getPayment");

}($, window, RSVP, rJS));