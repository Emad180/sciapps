window.onload = function () {
    //This function reads local file user's input
    let input = document.getElementById('choose_file');
    input.addEventListener('change', () => {
        let showAlert = true;
        let linesArray = [];
        let xArray = [];
        let yArray = [];
        let xyArray = [];
        let file = input.files;
        if(file.legnth == 0) return;
        const file1 = file[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let valiString = ['text/plain', 'text/csv', 'text/xls', 'text/xlsx', 'text/uxd'];
            let validation = file1.type;
            if(valiString.includes(validation)){
                const file2 = e.target.result;
                const lines = file2.split(/\r\n|\n/);
                lines.forEach(element => {
                    if(/[^0-9,.\s\tEe+]/g.test(element)){
                        //pass
                    }else if(element == ''){
                        //pass;
                    }else{
                        let rowTrimed = element.replace(/^\s+|\s+$/gm,'');
                        if(/[,]|\s+/.test(rowTrimed)){
                            linesArray.push(rowTrimed.replace(/[,]|\s+/, '    '));
                        }else{
                            if(showAlert){
                                alert(`Upload correct file format .txt/.csv, the delemiter must be ','/'Tab'`);
                                showAlert = false;
                            }
                        }
                    }
                });
                
                var str = linesArray.join('\n');
         
                document.getElementById('xcolumn').value = str; 
                let textArea = str.split('\n')
                textArea.forEach(line => {
                    let value = line.split('    ');
                    let xAxis = Number(value[0]);
                    let yAxis = Number(value[1].replace(/[^0-9.\s\tEe+]/, ''));
                    xArray.push(xAxis);
                    yArray.push(yAxis);
                });
                //Where the processing function added to process the user's read file
                console.log(xArray, yArray);
                dataProcessing(xArray, yArray);
                for(let i = 0; i < yArray.length; i++){
                    xyArray.push(xArray[i]*yArray[i]);
                }
                document.getElementById('lifetime_result').innerHTML = (xyArray.reduce(sum)/yArray.reduce(sum)).toFixed(4);
            }else{
               alert('Upload .txt or .csv file format');
            }
        }
        reader.onerror = (error) => {
            alert("Failed to read file!\n\n" + reader.error);
        };
        reader.readAsText(file1);
    })
}

function dataProcessing(Array1, Array2){
    document.getElementById('forcanvas').innerHTML = '';
    document.getElementById('forcanvas').innerHTML = '<canvas id="myChart" width="400" height="320"></canvas>';
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array1,  
            datasets: [{
                label: 'Lifetime', 
                data: Array2,
                pointRadius: 0,
                borderColor: "black",
            }]
        },
        options: {
          scales: {
            x: {
                ticks: {
                  callback: function(value, index, values) { 
                    return Math.floor(Array1[index]);
                  },
                  beginAtZero: true,
                  maxTicksLimit: 8,
                },
                title: {
                  display: true,
                  text: 'Time'
                },
                grid:{
                 display:false,
                 borderWidth: 2,
                 borderColor: 'black',
                 beginAtZero: true,
                }  
            },
            y: {
              ticks: {
                // stepSize: ,
                beginAtZero: true,
              },
              title: {
                display: true,
                text: 'Counts'
              },
              grid:{
                display:false,
                borderWidth: 2,
                borderColor: 'black',
              }
            }
          }
        }
    });
}

// Function to sum up all elements of Array
function sum(total, num){
    return total + num;
}
