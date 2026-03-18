$(function(){
    let currentQuiz = null;
    $("#startButton").on("click", function(){
        if(currentQuiz === null){
            currentQuiz = 0;
            $("#question").text(questions[0].question);
            questions[0].answers.forEach(function(element, index, array){
                $("#options").append(
                    `<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`
                );
            });
            $("#startButton").val("下一題");
        }else{
            $.each($(":radio"), function(i, val){
                if(val.checked){
                    console.log(i);
                    if(isNaN(questions[currentQuiz].answers[i][1])){
                        let finalResult = questions[currentQuiz].answers[i][1];
                        $("#question").text(finalAnswers[finalResult][0]);
                        $("#options").empty();
                        $("#options").append(`<p>${finalAnswers[finalResult][1]}</p><br>`);
                        currentQuiz = null;
                        $("#startButton").val("重新開始");
                    }else{
                        currentQuiz = questions[currentQuiz].answers[i][1]-1;
                        $("#question").text(questions[currentQuiz].question);
                        $("#options").empty();
                        questions[currentQuiz].answers.forEach(function(element, index, array){
                            $("#options").append(
                                `<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`
                            );
                        });
                    }
                    return false;
                }
            });
        }
    });
});