window.onload = function () {
    // shortening some comands
    let d = Decimal;
    d.set({ precision: 1025 });
    
    async function getData(){
        // variable to get data from standard cie.csv file 
        let wavelength = [];
        let xdata = [];
        let ydata = [];
        let zdata = [];
        const response = await fetch('files/ciexyz31_1.csv');
        const data = await response.text();
    
        const rows = data.split('\n').slice();
        rows.forEach(element => {
            const row = element.split(',');
            wavelength.push(row[0]);
            xdata.push(row[1]);
            ydata.push(row[2]);
            zdata.push(row[3].replace(/[\r\n]/gm, ''));
        });
        return {wavelength, xdata, ydata, zdata}
    }

    //This function reads local file user's input
    let input = document.getElementById('choose_file');
    let xArray = [];
    let yArray = [];
    input.addEventListener('change', () => {
        let showAlert = true;
        let linesArray = [];

        let xyArray = [];
        let file = input.files;
        if(file.legnth == 0) return;
        const file1 = file[0];
        let reader = new FileReader();
        let index = file1.name.lastIndexOf('.');
        let fileExt = file1.name.substring(index);
        if(fileExt === '.txt' || fileExt === '.csv' || fileExt === '.uxd' || fileExt === '.xls' || fileExt === '.xlsx'){
            reader.onload = (e) => {
                const file2 = e.target.result;
                const lines = file2.split(/\r\n|\n/);
                lines.forEach(element => {
                    if(/[^0-9,.\s\tEe+-]/g.test(element)){
                        //pass
                    }else if(element == '' || isNaN(element[0]) || isNaN(element[1])){
                        //pass;
                    }else{
                        let rowTrimed = element.replace(/^\s+|\s+$/gm,'');
                        if(/[,]|\s+/.test(rowTrimed)){
                            linesArray.push(rowTrimed.replace(/[,]|\s+/, '    '));
                        }else{
                            if(showAlert){
                                alert(`the delemiter must be ','/'Tab'`);
                                showAlert = false;
                            }
                        }
                    }
                });

                var str = linesArray.join('\n');

                document.getElementById('textarea').value = str; 
                let textArea = str.split('\n');
                // To avoid duplicating graph
                xArray = [];
                yArray = [];
                textArea.forEach(line => {
                    let value = line.split('    ');
                    let xAxis = Number(value[0]);
                    let yAxis = Number(value[1].replace(/[^0-9.\s\tEe+-]/, ''));
                    xArray.push(xAxis);
                    yArray.push(yAxis);
                });
                //Where the processing function added to process the user's read file
                dataProcessing(xArray, yArray);
            }
            reader.onerror = (error) => {
                alert("Failed to read file!\n\n" + reader.error);
            };
        reader.readAsText(file1);
        }else{
              alert('Upload .txt or .csv file format');
        }
    });

    dataProcessing(xArray, yArray);
    function dataProcessing(Array1, Array2){
        let data = {
            labels: Array1,  
            datasets: [{
                label: '', 
                data: Array2,
                pointHoverRadius: 0,
                pointRadius: 0,
                borderColor: "black",
                borderWidth: 2,
                hitRadius: 0,
                pointHitRadius: 0,
            }]
        }
        let config = {
            type: 'line',
            data,
            options: {
                plugins: {
                    tooltip: {
                        enabled: false,
                    }
                },  
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                    callback: function(value, index, values) { 
                        return Math.floor(Array1[index]);
                    },
                    beginAtZero: true,
                    maxTicksLimit: 8,
                    maxRotation: 0,
                    },
                    title: {
                    display: true,
                    text: 'Wavelength (nm)'
                    },
                    grid:{
                    display:true,
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
                    text: 'Intensity (Counts)'
                },
                grid:{
                    display:true,
                    borderWidth: 2,
                    borderColor: 'black',
                }
                }
            }
            }
        };

        if(typeof myChart.id == 'number'){
            myChart.destroy();
        }
        let ctx = document.getElementById("myChart").getContext('2d');
        myChart = new Chart(ctx, config);
    
        
        //for handling the crosshair lines
        myChart.canvas.addEventListener('mousemove', (e) => {
            crosshair(myChart, e);
        })
        
        function crosshair(chart, mousemove){
            chart.update('none');
            const xm = mousemove.offsetX;
            const ym = mousemove.offsetY;
            const {ctx, scales: {x, y}, chartArea: {top, bottom, right, left, width, height} } = chart;
            const xIndex = x.getValueForPixel(xm);
            const dataLabel = data.labels[xIndex];
            if(xm >= left && xm <= right){
                ctx.save();
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.fillStyle = "#ff0000";
                if(Array1.length == 0){
                    ctx.fillText('upload data', xm+2, ym-5);
                }else{
                    if(xm < right/1.2){
                        ctx.fillText(dataLabel.toFixed(2), xm+2, ym-5);
                    }else{
                        ctx.fillText(dataLabel.toFixed(2), xm-40, ym-5);
                    }
                }
                ctx.moveTo(xm, bottom);
                ctx.lineTo(xm, top);
                ctx.stroke();
                ctx.closePath();
            }
        }
        // for handling the double click functions
        function doubleclick(click2){
            if(Array1.length == 0){
                alert('upload data please');
            }else{
                const {scales: {x, y} } = myChart;
                const xPos = click2.offsetX;
                const xIndex = x.getValueForPixel(xPos);
                const dataLabel = data.labels[xIndex];
                
                let dominWavelengthV = document.getElementById('dominantwavelength');

                if (dominWavelengthV.style.borderWidth == '3px'){
                    dominWavelengthV.value = dataLabel.toFixed(2);
                }else{
                    alert('click to activate input fields');
                }
            }
        }
        myChart.canvas.ondblclick = doubleclick;
    }
    // function to remove background
    document.getElementById('removebackground').addEventListener('click', removebackground);
    function removebackground(){
        let minimumVal = Math.min(...yArray);
        let toTextArea = [];
        let yArrayBR = [];
        for(let i = 0; i < yArray.length; i++){
            yArrayBR.push(Number(d(yArray[i]).minus(minimumVal)));
            toTextArea.push(xArray[i] + '   ' + yArray[i]);
        }
        yArray = yArrayBR;
        document.getElementById('textarea').value = toTextArea.join('\n'); 
        dataProcessing(xArray, yArray);
    };

    // function for starting the calculation
    document.getElementById('calculate').addEventListener('click', calculate);
    async function calculate(){
        let mainData = await getData();

        // declaration to grab all fields value
        let dominWavelengthV = document.getElementById('dominantwavelength').value;
        let xV = document.getElementById('x');
        let yV = document.getElementById('y');
        let xdV = document.getElementById('xd');
        let ydV = document.getElementById('yd');
        let xsV = document.getElementById('xs').innerText;
        let ysV = document.getElementById('ys').innerText;
        let cpV = document.getElementById('cp');

        if(dominWavelengthV == ''){
            alert('Choose the dominant wavelength value please');
        }else{

            xyzWavelength = [];
            xValues = [];
            yValues = [];
            zValues = [];
            //for calculating the x and y values for the whole spectrum
            for(let m = 0; m < mainData.wavelength.length; m++){
                for(let n = 0; n < xArray.length; n++){
                    let num = mainData.wavelength[m];
                    let roundedWavelength = d.round(xArray[n]).valueOf();
                    if(num === roundedWavelength){
                        xyzWavelength.push(roundedWavelength);
                        xValues.push(d(yArray[n]).mul(mainData.xdata[m]).valueOf());
                        yValues.push(d(yArray[n]).mul(mainData.ydata[m]).valueOf());
                        zValues.push(d(yArray[n]).mul(mainData.zdata[m]).valueOf());
                    }else{
                        //pass;
                    }
                }
            }
            let sumX = 0;
            let sumY = 0;
            let sumZ = 0;
            for(let i = 0; i < xyzWavelength.length; i++){
                sumX = d(sumX).plus(xValues[i]);
                sumY = d(sumY).plus(yValues[i]);
                sumZ = d(sumZ).plus(zValues[i]);
            }
            let xx = d(sumX).dividedBy(d(sumX).plus(sumY).plus(sumZ)).toFixed(3);
            let yy = d(sumY).dividedBy(d(sumX).plus(sumY).plus(sumZ)).toFixed(3);
            xV.innerText = xx;
            yV.innerText = yy;

            //for calculating the xd and yd values for the dominant wavelength
            function xdX(){
                let doWaLeRounded = d(dominWavelengthV).round().valueOf();
                for(let i = 0; i < xArray.length; i++){
                    if(doWaLeRounded == d(xArray[i]).round().valueOf()){
                       return yArray[i];
                    }else{
                        //pass
                    }
                }
            }
            function mainD(){
                let doWaLeRounded = d(dominWavelengthV).round().valueOf();
                for(let i = 0; i < mainData.wavelength.length; i++){
                    if(doWaLeRounded == mainData.wavelength[i]){
                       let xMain = mainData.xdata[i];
                       let yMain = mainData.ydata[i];
                       let zMain = mainData.zdata[i];
                       return { xMain, yMain, zMain }
                    }else{
                        //pass
                    }
                }
            }
            let xd = d(d(xdX()).mul(mainD().xMain))
            .dividedBy(d(d(xdX()).mul(mainD().xMain))
            .plus(d(xdX()).mul(mainD().yMain))
            .plus(d(xdX()).mul(mainD().zMain))).toFixed(3);

            let yd = d(d(xdX()).mul(mainD().yMain))
            .dividedBy(d(d(xdX()).mul(mainD().xMain))
            .plus(d(xdX()).mul(mainD().yMain))
            .plus(d(xdX()).mul(mainD().zMain))).toFixed(3);
            
            xdV.innerText = xd;
            ydV.innerText = yd;

            let colorPurity = d.sqrt(d.pow(d(xx).minus(xsV), 2).plus(d.pow(d(yy).minus(ysV),2)))
                    .dividedBy(d.sqrt(d.pow(d(xd).minus(xsV), 2).plus(d.pow(d(yd).minus(ysV), 2))))
                    .mul('100');

            cpV.innerText = colorPurity.toFixed(2);
        }
    }

    // function to reset all fields to blank
    document.getElementById('reset').addEventListener('click', reset);
    function reset(){
        // declaration to grab all fields value
        document.getElementById('dominantwavelength').value = '';
        document.getElementById('x').innerText = '';
        document.getElementById('y').innerText = '';
        document.getElementById('xd').innerText = '';
        document.getElementById('yd').innerText = '';
        document.getElementById('cp').innerText = '';
    }


}

// Theis function to set the standard illuminant values when the user change it
// It must be outside the onload function in order for them to work
function standardIlluminantFunc(){
    let dfs = document.getElementById('standardIlluminant').value;
    document.getElementById("xs").innerText = dfs.replace(/^\[\'|\'\]$/g,'').split("', '")[0];
    document.getElementById("ys").innerText = dfs.replace(/^\[\'|\'\]$/g,'').split("', '")[1];
}

// Theis function for styling the dominant wavelength input fields when the user clicks it
// It must be outside the onload function in order for them to work
function dominantwavelength(){
    document.getElementById('dominantwavelength').style.border = '3px solid red';
}




