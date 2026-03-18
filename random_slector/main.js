$(function(){
    console.log("jQuery ready");
    $("input").on("click", function(){  // on -> event
        //  console.log("clicked");
        //  alert("clicked");
        var number = $("li").length;
        var randomNum = Math.floor(Math.random()*number);
        $("h3").text($("li").eq(randomNum).text()); // change title
    })

});