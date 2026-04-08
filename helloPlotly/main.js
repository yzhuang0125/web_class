d3.csv("https://raw.githubusercontent.com/ryanchung403/dataset/refs/heads/main/harry_potter.csv").then(
    res => {
        // console.log(res);
        drawPlot(res);
    }
);

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function drawPlot(res) {
    console.log(res);
    console.log(unpack(res, "revenue"));
    let trace1 = {
        x: unpack(res, "release_year"),
        y: unpack(res, "revenue"),
        type: "scatter",
        mode: "lines+markers+text",
        //text: set1.map(point => point[2]),
        textposition: "top center",
        name: "Set 1",
        marker: {
            color: "blue",
            // size: [1, 8, 14, 50]
        }
    };

    // trace1.x = set1.map(point => point[0]);
    // trace1.y = set1.map(point => point[1]);

    let trace2 = {
        x: unpack(res, "release_year"),
        y: unpack(res, "budget"),
        type: "scatter",
        mode: "lines+markers+text",
        //text: set2.map(point => point[2]),
        textposition: "top center",
        name: "Set 2"

    };


    let data = [
        trace1, 
        trace2
    ];

    let layout = {
        title: { text: "My First Plotly Chart" },
        margin: { t: 50, r: 50, b: 50, l: 50 }
    };

    Plotly.newPlot("myGraph", data, layout);
}








/*
Plotly.newPlot("myGraph",[{
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: "scatter"
}],{
    title: { text: "My First Plotly Chart" },
    margin: { t: 50, r: 50, b: 50, l: 50 }
});
*/

//Plotly.newPlot("myGraph",[],{});