var topic = [
    
    "Introduction",
    "Environment & Randonm Selecting",
    "Date & Time",
    "Psychological Test",
    "Psychological Test Python ver.",
    "SimpleRPG",
    "Plotly.js",
    "Yuan",

];

var startDate = new Date();
function setMonthAndDay(startMonth, startDay) {

    startDate.setMonth(startMonth - 1, startDay);
    startDate.setHours(0, 0, 0 ,0);

}

setMonthAndDay(2, 25);