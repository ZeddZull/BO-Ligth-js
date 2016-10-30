(function (jIO, RSVP, JSON){

  function PayzenStorage(option){
    this.path = option.path;
  }

  PayzenStorage.prototype.hasCapacity = function (name){
    return (name === "list") || (name === "include") || (name === 'get');
  }

  PayzenStorage.prototype.buildQuery = function (){

    var that = this;
    return new RSVP.Queue()
    .push(function(){
      return jIO.util.ajax({
        type:"GET",
        url:that.path
      });
    })
    .push(function(response){
      var data = JSON.parse(response.target.response);
      var rows = [];
      data.forEach(function(a){
        rows.push({
          id:a.paymentResponse_transactionUuid,
          value: {},
          doc: a
        });
      });
      return rows;
    });
  }

  PayzenStorage.prototype.bulk = function (){

    var that = this;
    return new RSVP.Queue()
    .push(function(){
      return jIO.util.ajax({
        type:"GET",
        url:that.path
      });
    })
    .push(function(response){
      var data = JSON.parse(response.target.response);
      return data;
    });
  }

  PayzenStorage.prototype.get = function (id){

    var that = this;
    return new RSVP.Queue()
    .push(function(){
      return jIO.util.ajax({
        type:"GET",
        url:that.path + "/" + id
      });
    })
    .push(function(response){
      return JSON.parse(response.target.response);
    });
  }

  jIO.addStorage('payzenStorage',PayzenStorage);

}(jIO, RSVP, JSON));
