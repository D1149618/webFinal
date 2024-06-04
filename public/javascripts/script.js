const form = document.getElementById('selectform');
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('rent').value;
    const res = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
    });
    if (res.ok) {
        const response = await res.json();
        let formattedResult = '<table><tr><th>Year</th><th>Rent</th></tr>';
        if (name.toString() == 'suite') {
            response.forEach(row => {
                formattedResult += `<tr><td>${row.year}</td><td>${row.suite}</td></tr>`;
            });
            drawSuiteChart(response); // 畫出套房的折線圖
        } else {
            response.forEach(row => {
                formattedResult += `<tr><td>${row.year}</td><td>${row.building}</td></tr>`;
            });
            drawBuildingChart(response); // 畫出���宅大樓的折線圖
        }
        formattedResult += '</table>';
        document.getElementById('log').innerHTML = formattedResult;
    } else {
        document.getElementById('log').textContent = 'Error';
    }
});

let suiteChart;
let buildingChart;

// 畫出套房的折線圖
function drawSuiteChart(data) {
    const years = data.map(row => row.year);
    const suite = data.map(row => row.suite);
    const ctx = document.getElementById('suiteChart').getContext('2d');

    // 如果已經存在圖表，先銷毀它
    if (buildingChart) {
        buildingChart.destroy();
    }

    suiteChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: '套房',
                data: suite,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 畫出住宅大樓的折線圖
function drawBuildingChart(data) {
    const years = data.map(row => row.year);
    const building = data.map(row => row.building);
    const ctx = document.getElementById('buildingChart').getContext('2d');

    // 如果已經存在圖表，先銷毀它
    if (suiteChart) {
        suiteChart.destroy();
    }

    buildingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: '住宅大樓',
                data: building,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}