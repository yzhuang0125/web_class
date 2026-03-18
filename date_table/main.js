$(function() {

    $("#courseTable").append("<tr><th>場次</th><th>時間</th><th>主題</th></tr>");
    let topicCount = topic.length;

    let millisecondsPerDay = 24 * 60 * 60 * 1000;

    for(let i = 0; i < topicCount; i++) {

        let color = "";
        if(topic[i].includes("Online")){
            color = "style='background-color:	Gainsboro'";
        }

        $("#courseTable").append(
            "<tr>" +
            `<td>${i + 1}</td>` +
            `<td>${new Date(startDate.getTime() + 7 * i * millisecondsPerDay).toLocaleDateString().slice(5)}</td>` + 
            `<td>${topic[i]}</td>` +
            "</tr>"
        );
    }
    
});

$("#addBtn").click(function(){

    let newTopic = $("#newTopic").val();

    if(newTopic == "") return;

    topic.push(newTopic);

    let i = topic.length - 1;

    let millisecondsPerDay = 24 * 60 * 60 * 1000;

    let color = "";
    if(newTopic.includes("Online")){
        color = "style='background-color:	Gainsboro'";
    }

    $("#courseTable").append(
        `<tr ${color}>` +
        `<td>${i + 1}</td>` +
        `<td>${new Date(startDate.getTime() + 7 * i * millisecondsPerDay).toLocaleDateString().slice(5)}</td>` +
        `<td>${newTopic}</td>` +
        "</tr>"
    );

    $("#newTopic").val("");
});