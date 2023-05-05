window.onload = function () {
    // shortening some comands
    let d = Decimal;
    d.set({ precision: 1025 });
    //Global constants
    const Smdc = '9.6E-42';
    const U2c = '0.0032';
    const U4c = '0.0023';
    const U6c = '0.0002';
    const ec = '4.803E-10';
    const hc = '6.63E-27'; 
    const c = '2.99792458E+10';

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
                console.log(xArray, yArray);
                dataProcessing(xArray, yArray);
                for(let i = 0; i < yArray.length; i++){
                    xyArray.push(xArray[i]*yArray[i]);
                }
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
                
                let f1min = document.getElementById('f1min');
                let f1max = document.getElementById('f1max');
                let f2min = document.getElementById('f2min');
                let f2max = document.getElementById('f2max');
                let f4min = document.getElementById('f4min');
                let f4max = document.getElementById('f4max');
                let f6min = document.getElementById('f6min');
                let f6max = document.getElementById('f6max');
                if (f1min.style.borderWidth == '3px'){
                    f1min.value = dataLabel.toFixed(2);
                }else if(f1max.style.borderWidth == '3px'){
                    f1max.value = dataLabel.toFixed(2);
                }else if(f2min.style.borderWidth == '3px'){
                    f2min.value = dataLabel.toFixed(2);
                }else if(f2max.style.borderWidth == '3px'){
                    f2max.value = dataLabel.toFixed(2);
                }else if(f4min.style.borderWidth == '3px'){
                    f4min.value = dataLabel.toFixed(2);
                }else if(f4max.style.borderWidth == '3px'){
                    f4max.value = dataLabel.toFixed(2);
                }else if(f6min.style.borderWidth == '3px'){
                    f6min.value = dataLabel.toFixed(2);
                }else if(f6max.style.borderWidth == '3px'){
                    f6max.value = dataLabel.toFixed(2);
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
        yArrayBR = [];
        yArray.forEach(element => {
            yArrayBR.push(element-minimumVal);
        });
        yArray = [];
        yArray = yArrayBR;
        dataProcessing(xArray, yArray);
        console.log(yArrayBR);
    };

    // function for starting the calculation
    document.getElementById('calculate').addEventListener('click', calculate);
    function calculate(){
        // declaration to get the intial input values
        let f1min = Number(document.getElementById('f1min').value);
        let f1max = Number(document.getElementById('f1max').value);
        let f2min = Number(document.getElementById('f2min').value);
        let f2max = Number(document.getElementById('f2max').value);
        let f4min = Number(document.getElementById('f4min').value);
        let f4max = Number(document.getElementById('f4max').value);
        let f6min = Number(document.getElementById('f6min').value);
        let f6max = Number(document.getElementById('f6max').value);

        // declaration to grab the areas fields
        let f1area = document.getElementById('f1area');
        let f2area = document.getElementById('f2area');
        let f4area = document.getElementById('f4area');
        let f6area = document.getElementById('f6area');

        // declaration to grab the wavelength fields
        let f1wavelength = document.getElementById('f1wavelength');
        let f2wavelength = document.getElementById('f2wavelength');
        let f4wavelength = document.getElementById('f4wavelength');
        let f6wavelength = document.getElementById('f6wavelength');

        //Declaration to grab the J-O paramters (omegaj) fields
        let f2omega = document.getElementById('f2omega');
        let f4omega = document.getElementById('f4omega');
        let f6omega = document.getElementById('f6omega');

        //Declaration to grab the refractive index value
        let n1 = Number(document.getElementById('refIndex1').value);
        let n2 = Number(document.getElementById('refIndex2').value);
        let n4 = Number(document.getElementById('refIndex4').value);
        let n6 = Number(document.getElementById('refIndex6').value); 

        //Declaration to grab the transition probabilities fields
        let f1tranprob = document.getElementById('f1tranprob');
        let f2tranprob = document.getElementById('f2tranprob');
        let f4tranprob = document.getElementById('f4tranprob');
        let f6tranprob = document.getElementById('f6tranprob');

        //Deglaration to grab the branching ratio result fields
        let f1branch = document.getElementById("f1branch");
        let f2branch = document.getElementById("f2branch");
        let f4branch = document.getElementById("f4branch");
        let f6branch = document.getElementById("f6branch");

        //Deglaration to grab the wavenumber fields
        let f1v = document.getElementById("f1v");
        let f2v = document.getElementById("f2v");
        let f4v = document.getElementById("f4v");
        let f6v = document.getElementById("f6v");

        //Deglaration to grab the delta lamda (fwhm) fields
        let delta_lamda_f1 = document.getElementById("delta_lamda_f1");
        let delta_lamda_f2 = document.getElementById("delta_lamda_f2");
        let delta_lamda_f4 = document.getElementById("delta_lamda_f4");
        let delta_lamda_f6 = document.getElementById("delta_lamda_f6");

        //Deglaration to grab the delta lamda (fwhm) fields
        let stimEmission1 = document.getElementById("stimEmission1");
        let stimEmission2 = document.getElementById("stimEmission2");
        let stimEmission4 = document.getElementById("stimEmission4");
        let stimEmission6 = document.getElementById("stimEmission6");

        //Deglaration to grab the gain band width (sigma x effective bandwidth) fields
        let gainBand1 = document.getElementById("gainBand1");
        let gainBand2 = document.getElementById("gainBand2");
        let gainBand4 = document.getElementById("gainBand4");
        let gainBand6 = document.getElementById("gainBand6");

        //Deglaration to grab the optical gain (sigma x lifetime) fields
        let opticalgain2 = document.getElementById("opticalgain2");

        // For the asymmetry ratio and the quantum efficiency
        let asymetryRatio = document.getElementById('AsymmetricRatioValue'); 
        let lifetime = Number(document.getElementById('lifetime').value);
        let radLifetime = document.getElementById('radLifetime');
        let quantumEffeciency = document.getElementById('quantumEffeciency');

        if(f1min == '' || f1max == '' || f2min == '' || f2max == '' || f4min == '' || f4max == ''){
            alert('min and max values of f1, f2, and f4 transitions are crucial');
        }else if(n1 == '' || n2 == '' || n4 == ''){
            alert('Insert the corresponding refractive indexes (n)');
        }else{
            let f1xarray = [];
            let f1yarray = [];

            let f2xarray = [];
            let f2yarray = [];

            let f4xarray = [];
            let f4yarray = [];

            let f6xarray = [];
            let f6yarray = [];
            if(f1min > f1max || f2min > f2max || f4min > f4max || f6min > f6max){
                alert('The min value of any transition can not be greator than its max value');
            }else{
                // 5D0 - 7F1 transition calculations
                xArray.forEach(element => {
                    if(element >= f1min && element <= f1max){
                        f1xarray.push(element);
                        f1yarray.push(yArray[xArray.indexOf(Number(element))]);
                    }
                });
                f1area.innerText = d(integration(f1xarray, f1yarray)).toFixed(2);
                f1wavelength.innerText = f1xarray[f1yarray.indexOf(Math.max(...f1yarray))].toFixed(3);
                f1tranprob.innerText = d(tranprob1(f1wavelength.innerText, n1)).toFixed(3);
                f1v.innerText = d(10000000).div(f1wavelength.innerText).toFixed(3);
                delta_lamda_f1.innerText = d(fwhm(f1xarray, f1yarray)).toFixed(3);
                stimEmission1.innerText = d(stimEmission(f1wavelength.innerText, f1tranprob.innerText, c, n1, delta_lamda_f1.innerText)).toFixed(3);
                gainBand1.innerText = d(gainBandWidth(stimEmission1.innerText, delta_lamda_f1.innerText)).toFixed(3);

                // 5D0 - 7F2 transition calculations
                xArray.forEach(element => {
                    if(element >= f2min && element <= f2max){
                        f2xarray.push(element);
                        f2yarray.push(yArray[xArray.indexOf(Number(element))]);
                    }
                });
                f2area.innerText = d(integration(f2xarray, f2yarray)).toFixed(2);
                f2wavelength.innerText = f2xarray[f2yarray.indexOf(Math.max(...f2yarray))].toFixed(3);
                f2omega.innerText = d(omegaj(Smdc, f1wavelength.innerText, ec, f2wavelength.innerText, n1, n2, f1area.innerText, f2area.innerText, U2c)).toFixed(3);
                f2tranprob.innerText = d(tranprobj(f2wavelength.innerText, n2, f2omega.innerText, U2c, 2)).toFixed(3);
                f2v.innerText = d(10000000).div(f2wavelength.innerText).toFixed(3);
                delta_lamda_f2.innerText = d(fwhm(f2xarray, f2yarray)).toFixed(3);
                stimEmission2.innerText = d(stimEmission(f2wavelength.innerText, f2tranprob.innerText, c, n2, delta_lamda_f2.innerText)).toFixed(3);
                gainBand2.innerText = d(gainBandWidth(stimEmission2.innerText, delta_lamda_f2.innerText)).toFixed(3);
                opticalgain2.innerText = d(opticalGain(stimEmission2.innerText, lifetime)).toFixed(3);

                // 5D0 - 7F4 transition calculations
                xArray.forEach(element => {
                    if(element >= f4min && element <= f4max){
                        f4xarray.push(element);
                        f4yarray.push(yArray[xArray.indexOf(Number(element))]);
                    }
                });
                f4area.innerText = d(integration(f4xarray, f4yarray)).toFixed(2);
                f4wavelength.innerText = f4xarray[f4yarray.indexOf(Math.max(...f4yarray))].toFixed(3);
                f4omega.innerText = d(omegaj(Smdc, f1wavelength.innerText, ec, f4wavelength.innerText, n1, n4, f1area.innerText, f4area.innerText, U4c)).toFixed(3);
                f4tranprob.innerText = d(tranprobj(f4wavelength.innerText, n4, f4omega.innerText, U4c, 4)).toFixed(3);
                f4v.innerText = d(10000000).div(f4wavelength.innerText).toFixed(3);
                delta_lamda_f4.innerText = d(fwhm(f4xarray, f4yarray)).toFixed(3);
                stimEmission4.innerText = d(stimEmission(f4wavelength.innerText, f4tranprob.innerText, c, n4, delta_lamda_f4.innerText)).toFixed(3);
                gainBand4.innerText = d(gainBandWidth(stimEmission4.innerText, delta_lamda_f4.innerText)).toFixed(3);

                //radiative lifetime in case of only f4
                radLifetime.innerText = d(1).dividedBy(d(f2tranprob.innerText).plus(f4tranprob.innerText)).mul('1E+6').toFixed(3);

                //Calculated branching ratios for f1, f2, and f4
                f1branch.innerText = d(d(f1tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                .plus(f2tranprob.innerText).plus(f4tranprob.innerText)).toFixed(3);

                f2branch.innerText = d(d(f2tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                .plus(f2tranprob.innerText).plus(f4tranprob.innerText)).toFixed(3);

                f4branch.innerText = d(d(f4tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                .plus(f2tranprob.innerText).plus(f4tranprob.innerText)).toFixed(3);

                // 5D0 - 7F6 transition calculations
                if(f6min == '' || f6max == '' || n6 == ''){
                    //pass;
                }else if(f6min < xArray[0] || f6min > xArray[xArray.length-1] || f6max < xArray[0] || f6max > xArray[xArray.length-1]){
                    alert('The input values of the 5D0-7F6 transition are out of range');
                }else{
                    xArray.forEach(element => {
                        if(element >= f6min && element <= f6max){
                            f6xarray.push(element);
                            f6yarray.push(yArray[xArray.indexOf(Number(element))]);
                        }
                    });
                    f6area.innerText = d(integration(f6xarray, f6yarray)).toFixed(2);
                    f6wavelength.innerText = f6xarray[f6yarray.indexOf(Math.max(...f6yarray))].toFixed(3);
                    f6omega.innerText = d(omegaj(Smdc, f1wavelength.innerText, ec, f6wavelength.innerText, n1, n6, f1area.innerText, f6area.innerText, U6c)).toFixed(3);
                    f6tranprob.innerText = d(tranprobj(f6wavelength.innerText, n6, f6omega.innerText, U6c, 6)).toFixed(3);
                    f6v.innerText = d(10000000).div(f6wavelength.innerText).toFixed(3);
                    delta_lamda_f6.innerText = d(fwhm(f6xarray, f6yarray)).toFixed(3);
                    stimEmission6.innerText = d(stimEmission(f6wavelength.innerText, f6tranprob.innerText, c, n6, delta_lamda_f6.innerText)).toFixed(3);
                    gainBand6.innerText = d(gainBandWidth(stimEmission6.innerText, delta_lamda_f6.innerText)).toFixed(3);

                    //Calculated branching ratios for f1, f2, and f4
                    f1branch.innerText = d(d(f1tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                    .plus(f2tranprob.innerText).plus(f4tranprob.innerText).plus(f6tranprob.innerText)).toFixed(3);

                    f2branch.innerText = d(d(f2tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                    .plus(f2tranprob.innerText).plus(f4tranprob.innerText).plus(f6tranprob.innerText)).toFixed(3);

                    f4branch.innerText = d(d(f4tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                    .plus(f2tranprob.innerText).plus(f4tranprob.innerText).plus(f6tranprob.innerText)).toFixed(3);

                    f6branch.innerText = d(d(f6tranprob.innerText).mul(100)).div(d(f1tranprob.innerText)
                    .plus(f2tranprob.innerText).plus(f4tranprob.innerText).plus(f6tranprob.innerText)).toFixed(3);
                    //radiative lifetime
                    radLifetime.innerText = d(1).dividedBy(d(f2tranprob.innerText).plus(f4tranprob.innerText)
                    .plus(f6tranprob.innerText)).mul('1E+6').toFixed(3);
                }
                
                //For calculating the asymmertry ratio, radiative lifetime and the quantum efficiency
                asymetryRatio.innerText = d(asymetricRatio(f1area.innerText, f2area.innerText)).toFixed(3);
                quantumEffeciency.innerText = d(lifetime).dividedBy(radLifetime.innerText).mul(100).toFixed(3);

            }
        }
    }

    // Function to take in x and y Arrays and calculate the integral (Area under the curve)
    function integration(arrayx, arrayy) {
        let integral = d(0);
        for (let i = 0; i <= arrayx.length - 2; i ++) {
            integral = (integral.plus(d(d(arrayx[i+1]).minus(arrayx[i])).mul(arrayy[i])));
        }
        return integral.valueOf();
    }

    //The following two functions used to calculate the transition probabilities
    function tranprob1(v1, n1){
        let A1 = d(d(64).mul(d.pow(d.acos(-1), 4)).mul(d.pow(d(10000000).div(v1), 3)).mul(d.pow(n1, 3)).mul(Smdc))
        .div(d(3).mul(hc));
        return A1.valueOf();
    }
    function tranprobj(vj, nj, omegaj, uj, j){
        let Aj = d(d(64).mul(d.pow(d.acos(-1) ,4)).mul(d.pow(d(10000000).div(vj) ,3)).mul(nj)
        .mul(d.pow(d.pow(nj ,2).plus(2) ,2)).mul(d.pow(ec ,2)).mul(omegaj).mul(uj)).mul('1E-20')
        .div(d(3).mul(9).mul(hc));
        return Aj.valueOf();
    }
    
    // This function for calculating the assymetric ratio valur
    function asymetricRatio(a, b){
        let asymetryRatio = d(b).dividedBy(a);
        return asymetryRatio.valueOf();
    }

    // function to calculate judd-ofelt parameter omegas
    function omegaj(smd, v1, en, vj, n1, nj, integv1, integvj, uj){
        let part1 =  d(d(smd).mul(d.pow(vj, 3))).div(d.pow(en, 2).mul(d.pow(v1, 3)));
        let part2 = d(d(9).mul(d.pow(n1, 3))).div(d(nj).mul(d.pow(d.pow(nj, 2).plus(2), 2)));
        let part3 = d(integvj).div(d(uj).mul(integv1));
        return d(part1).mul(part2).mul(part3).mul('1E20').valueOf();
    }

    // Function to calculate full width at half maxima
    function fwhm(x, y) {
        let halfMax = d(Math.max(...y)).dividedBy(2);
        let MaxIndex = y.indexOf(Math.max(...y));
        let leftFwhmIndex = 0;
        let rightFwhmIndex = 0;
        
        // find the left index where y value is greater than or equal half max
        for (let i = 0; i < MaxIndex; i++) {
          if (halfMax <= y[0]){
            leftFwhmIndex = 0;
          }else if (y[i] > halfMax) {
            leftFwhmIndex = i;
            break;
          }
        }
        
        // find the right index where y value is greater than or equal half max
        for (let i = y.length; i > MaxIndex; i--) {
          if (halfMax <= y[-1]){
            rightFwhmIndex = -1;
          }else if (y[i] > halfMax) {
            rightFwhmIndex = i;
            break;
          }
        }
        
        // calculate the full width at half maxima
        let fwhm = d(x[rightFwhmIndex]).minus(x[leftFwhmIndex]);
        return fwhm.valueOf();
    }

    // This function for calculating the stimulated emission cross section
    function stimEmission(ll, aa, cc, nn, eff){
        let stimEmissionResult = d(d.pow(d(ll).dividedBy(10000000), 4).mul(aa))
        .dividedBy(d(8).mul(d.acos(-1)).mul(cc).mul(d.pow(nn, 2)).mul(d(eff).dividedBy(10000000)));
        return d(stimEmissionResult).mul('1E+22').valueOf();
    }

    // This function for calculating the gain band width (sigma x effective band width)
    function gainBandWidth(stim, eff1){
        let gainBandWidthResult = d(stim).mul(d(eff1).dividedBy(10000000));
        return d(gainBandWidthResult).mul('1E+6').valueOf();
    }

    // This function for calculating the optical gain (sigma x lifetime)
    function opticalGain(stim, lifeT){
        let opticalGainResult = d(stim).mul(lifeT);
        return d(opticalGainResult).mul('1E-3').valueOf();
    }

    // function to reset all fields to blank
    document.getElementById('reset').addEventListener('click', reset);
    function reset(){
        // declaration to get the intial input values
        document.getElementById('f1min').value = '';
        document.getElementById('f1max').value = '';
        document.getElementById('f2min').value = '';
        document.getElementById('f2max').value = '';
        document.getElementById('f4min').value = '';
        document.getElementById('f4max').value = '';
        document.getElementById('f6min').value = '';
        document.getElementById('f6max').value = '';

        // declaration to grab the areas fields
        document.getElementById('f1area').innerText = '';
        document.getElementById('f2area').innerText = '';
        document.getElementById('f4area').innerText = '';
        document.getElementById('f6area').innerText = '';
        
        // declaration to grab the wavelength fields
        document.getElementById('f1wavelength').innerText = '';
        document.getElementById('f2wavelength').innerText = '';
        document.getElementById('f4wavelength').innerText = '';
        document.getElementById('f6wavelength').innerText = '';

        //Declaration to grab the J-O paramters (omegaj) fields
        document.getElementById('f2omega').innerText = '';
        document.getElementById('f4omega').innerText = '';
        document.getElementById('f6omega').innerText = '';

        //Declaration to grab the refractive index value
        document.getElementById('refIndex1').value = '';
        document.getElementById('refIndex2').value = '';
        document.getElementById('refIndex4').value = '';
        document.getElementById('refIndex6').value = ''; 

        //Declaration to grab the transition probabilities fields
        document.getElementById('f1tranprob').innerText = '';
        document.getElementById('f2tranprob').innerText = '';
        document.getElementById('f4tranprob').innerText = '';
        document.getElementById('f6tranprob').innerText = '';

        //Deglaration to grab the branching ratio result fields
        document.getElementById("f1branch").innerText = '';
        document.getElementById("f2branch").innerText = '';
        document.getElementById("f4branch").innerText = '';
        document.getElementById("f6branch").innerText = '';

        //Deglaration to grab the wavenumber fields
        document.getElementById("f1v").innerText = '';
        document.getElementById("f2v").innerText = '';
        document.getElementById("f4v").innerText = '';
        document.getElementById("f6v").innerText = '';

        //Deglaration to grab the delta lamda (fwhm) fields
        document.getElementById("delta_lamda_f1").innerText = '';
        document.getElementById("delta_lamda_f2").innerText = '';
        document.getElementById("delta_lamda_f4").innerText = '';
        document.getElementById("delta_lamda_f6").innerText = '';

        //Deglaration to grab the delta lamda (fwhm) fields
        document.getElementById("stimEmission1").innerText = '';
        document.getElementById("stimEmission2").innerText = '';
        document.getElementById("stimEmission4").innerText = '';
        document.getElementById("stimEmission6").innerText = '';

        //Deglaration to grab the gain band width (sigma x effective bandwidth) fields
        document.getElementById("gainBand1").innerText = '';
        document.getElementById("gainBand2").innerText = '';
        document.getElementById("gainBand4").innerText = '';
        document.getElementById("gainBand6").innerText = '';

        //Deglaration to grab the optical gain (sigma x lifetime) fields
        document.getElementById("opticalgain2").innerText = '';

        // For the asymmetry ratio and the quantum efficiency
        document.getElementById('AsymmetricRatioValue').innerText = ''; 
        document.getElementById('lifetime').value = '';
        document.getElementById('radLifetime').innerText = '';
        document.getElementById('quantumEffeciency').innerText = '';
    }

}

// This function must be outside the onload function to work
// function for calculating the point group symmetry
function pointGroupSymmetery(){
    // This deglaration is to get the result of the asymmetery point group value
    //pgs stand for point group symmetry
    let pgs = document.getElementById("AsymmetryPointGroupResult");

    // These are deglaration to get the asymmetery point values
    let f0 = Number(document.getElementById("pointSymmetery0").value);
    let f1 = Number(document.getElementById("pointSymmetery1").value);
    let f2 = Number(document.getElementById("pointSymmetery2").value);
    let f3 = Number(document.getElementById("pointSymmetery3").value);
    let f4 = Number(document.getElementById("pointSymmetery4").value);
    
    if(f0 == 1 && f1 == 3 && f2 == 5 && f3 == 7 && f4 == 9){
        pgs.innerHTML = 'C' + '<sub>1</sub>' + ', C' + '<sub>s</sub>' + ', C' + '<sub>2</sub>';
    }else if(f0 == 1 && f1 == 3 && f2 == 4 && f3 == 5 && f4 == 7){
        pgs.innerHTML = 'C' + '<sub>2v</sub>';
    }else if(f0 == 0 && f1 == 3 && f2 == 0 && f3 == 0 && f4 == 0){
        pgs.innerHTML = 'C' + '<sub>i</sub>' + ', C' + '<sub>2h</sub>' + ', D' + '<sub>2h</sub>';
    }else if(f0 == 0 && f1 == 3 && f2 == 3 && f3 == 6 && f4 == 6){
        pgs.innerHTML = 'D' + '<sub>2</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 2 && f3 == 3 && f4 == 3){
        pgs.innerHTML = 'D' + '<sub>2d</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 2 && f3 == 4 && f4 == 4){
        pgs.innerHTML = 'D' + '<sub>3</sub>';
    }else if(f0 == 1 && f1 == 2 && f2 == 3 && f3 == 5 && f4 == 6){
        pgs.innerHTML = 'C' + '<sub>3</sub>';
    }else if(f0 == 1 && f1 == 2 && f2 == 3 && f3 == 3 && f4 == 5){
        pgs.innerHTML = 'C' + '<sub>3v</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 1 && f3 == 3 && f4 == 4){
        pgs.innerHTML = 'C' + '<sub>3h</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 0 && f3 == 0 && f4 == 0){
        pgs.innerHTML = 'C' + '<sub>3i</sub>' + ', D' + '<sub>3d</sub>' + ', C' + '<sub>4h</sub>' +
                        ', D' + '<sub>4h</sub>' + ', C' + '<sub>6h</sub>' + ', D' + '<sub>6h</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 1 && f3 == 2 && f4 == 3){
        pgs.innerHTML = 'D' + '<sub>3h</sub>';
    }else if(f0 == 1 && f1 == 2 && f2 == 2 && f3 == 3 && f4 == 5){
        pgs.innerHTML = 'C' + '<sub>4</sub>';
    }else if(f0 == 1 && f1 == 2 && f2 == 2 && f3 == 2 && f4 == 4){
        pgs.innerHTML = 'C' + '<sub>4v</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 0 && f3 == 1 && f4 == 2){
        pgs.innerHTML = 'D' + '<sub>4d</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 3 && f3 == 4 && f4 == 4){
        pgs.innerHTML = 'S' + '<sub>4</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 1 && f3 == 3 && f4 == 3){
        pgs.innerHTML = 'D' + '<sub>4</sub>';
    }else if(f0 == 1 && f1 == 2 && f2 == 2 && f3 == 2 && f4 == 2){
        pgs.innerHTML = 'C' + '<sub>6</sub>' + ', C' + '<sub>6v</sub>';
    }else if(f0 == 0 && f1 == 2 && f2 == 1 && f3 == 2 && f4 == 1){
        pgs.innerHTML = 'D' + '<sub>6</sub>';
    }else if(f0 == 0 && f1 == 1 && f2 == 1 && f3 == 2 && f4 == 2){
        pgs.innerHTML = 'T';
    }else if(f0 == 0 && f1 == 1 && f2 == 1 && f3 == 1 && f4 == 1){
        pgs.innerHTML = 'T' + '<sub>d</sub>';
    }else if(f0 == 0 && f1 == 1 && f2 == 0 && f3 == 0 && f4 == 0){
        pgs.innerHTML = 'T' + '<sub>h</sub>' + ', O' + '<sub>h</sub>' + ', I' + '<sub>h</sub>';
    }else if(f0 == 0 && f1 == 1 && f2 == 0 && f3 == 1 && f4 == 1){
        pgs.innerHTML = 'O';
    }else{
        pgs.innerHTML = 'Invalid combination';
    }
    
}

// These functions for styling the wavelength input fields when the user click them
// They must be outside the onload function in order for them to work
function funf1min(){
    document.getElementById('f1min').style.border = '3px solid red';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf1max(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '3px solid red';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf2min(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '3px solid red';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf2max(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '3px solid red';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf4min(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '3px solid red';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf4max(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '3px solid red';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf6min(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '3px solid red';
    document.getElementById('f6max').style.border = '1px solid black';
}
function funf6max(){
    document.getElementById('f1min').style.border = '1px solid black';
    document.getElementById('f1max').style.border = '1px solid black';
    document.getElementById('f2min').style.border = '1px solid black';
    document.getElementById('f2max').style.border = '1px solid black';
    document.getElementById('f4min').style.border = '1px solid black';
    document.getElementById('f4max').style.border = '1px solid black';
    document.getElementById('f6min').style.border = '1px solid black';
    document.getElementById('f6max').style.border = '3px solid red';
}






