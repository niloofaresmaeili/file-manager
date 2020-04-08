var getTitle = function () {
  $.post("/show" , {} , function (data){
      alert(typeof(data));
      console.log(data);
      for(var i=0; i<data.length ; i++){
          $("#itemtitle").append(`<a>` + data[i].name +`</a><hr style="color: rgb(179, 174, 174)"></hr>`);   
      };
      data.array.forEach(element => {console.log(element)});
      /*data.forEach(element => console.log(element));
      data.forEach(function (item , index){
          $("#into").append("<p>" + index.id + " : " + index.name + "</p>");
      });*/
      
  });
} ;

getTitle() ;