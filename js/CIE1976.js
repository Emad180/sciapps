function preload(){
    img = loadImage('images/CIE1976gamut.png');
}

// global variable for the calculatexyz method in CIEFileReader class 
let xyzWavelength = [];
let xValues = [];
let yValues = [];
let zValues = [];

let z = 0;

// global variable for userLoadedFile method in CIEFileReader class 
let wavelengthcol = [];
let intensitycol = [];

// global variable for getData method in CIEFileReader class 
let wavelength = [];
let xdata = [];
let ydata = [];
let zdata = [];

//CIE chromaticity coordinates x, y
let x, y;

// x and y coordinate poits
let xcoordinate = [];
let ycoordinate = [];

//symbol array
let symbol = ['\u2660', '\u2207', '\u2663', '+', '±', 'x', 'o', '\u2665', '\u2666', '\u2022', '#', '&'];
let symbolpoint = [];
let namesArray = [];

let inputx, inputy, inputcct, input_file_id;

let file_name, filename1;

let canvas

function setup(){
    canvas = createCanvas(windowWidth*70/100, 550);
    canvas.parent("forCanvas");
    ciegraph = new CIEGraph();
    ciefileReader = new CIEFileReader();
    ciefileReader.getData();
}

function draw(){
    background(256);
    ciegraph.CIEimage();
    ciegraph.axis();
    ciefileReader.text();
    ciefileReader.CIEpoint();
}

function realTimeChanger(){
    //nothing here but it works
}

class CIEGraph{
    constructor(){

        this.borderWidth = createSelect();
        this.borderWidth.position(525, 142);
        this.borderWidth.parent("forCanvas");
        this.borderWidth.style('fontSize', '12px');
        this.borderWidth.style('width', '80px');
        this.borderWidth.style('height', '18px');
        this.borderWidth.option(1, '1'); 
        this.borderWidth.option(2, '2');
        this.borderWidth.option(3, '3');
        this.borderWidth.option(4, '4');
        this.borderWidth.option(5, '5');
        this.borderWidth.input(realTimeChanger);

        this.axisScaleFontSize = createSelect();
        this.axisScaleFontSize.position(550, 247);
        this.axisScaleFontSize.parent("forCanvas");
        this.axisScaleFontSize.style('fontSize', '12px');
        this.axisScaleFontSize.style('width', '40px');
        this.axisScaleFontSize.style('height', '18px');
        this.axisScaleFontSize.option(10, '10'); 
        this.axisScaleFontSize.option(12, '12');
        this.axisScaleFontSize.option(14, '14');
        this.axisScaleFontSize.option(16, '16');
        this.axisScaleFontSize.option(18, '18');
        this.axisScaleFontSize.input(realTimeChanger);

        this.axisScaleFont = createSelect();
        this.axisScaleFont.position(640, 182);
        this.axisScaleFont.parent("forCanvas");
        this.axisScaleFont.style('fontSize', '12px');
        this.axisScaleFont.style('width', '120px');
        this.axisScaleFont.style('height', '18px');
        this.axisScaleFont.option("Georgia"); 
        this.axisScaleFont.option("Arial");
        this.axisScaleFont.option("Walter Turncoat");
        this.axisScaleFont.option("Times New Roman");
        this.axisScaleFont.input(realTimeChanger);

        this.axisFont = createSelect();
        this.axisFont.position(640, 246);
        this.axisFont.parent("forCanvas");
        this.axisFont.style('fontSize', '12px');
        this.axisFont.style('width', '120px');
        this.axisFont.style('height', '18px');
        this.axisFont.option("Georgia"); 
        this.axisFont.option("Arial");
        this.axisFont.option("Walter Turncoat");
        this.axisFont.option("Times New Roman");
        this.axisFont.input(realTimeChanger);

        this.axisColor = createSelect();
        this.axisColor.position(650, 140);
        this.axisColor.parent("forCanvas");
        this.axisColor.style('fontSize', '12px');
        this.axisColor.style('width', '110px');
        this.axisColor.style('height', '18px');
        this.axisColor.option("black"); 
        this.axisColor.option("red");
        this.axisColor.option("green");
        this.axisColor.option("magenta");
        this.axisColor.option("yellow");
        this.axisColor.option("blue");
        this.axisColor.input(realTimeChanger); 

        this.axisTitleColor = createSelect();
        this.axisTitleColor.position(527, 204);
        this.axisTitleColor.parent("forCanvas");
        this.axisTitleColor.style('fontSize', '12px');
        this.axisTitleColor.style('width', '110px');
        this.axisTitleColor.style('height', '18px');
        this.axisTitleColor.option("black"); 
        this.axisTitleColor.option("red");
        this.axisTitleColor.option("green");
        this.axisTitleColor.option("magenta");
        this.axisTitleColor.option("yellow");
        this.axisTitleColor.option("blue");
        this.axisTitleColor.input(realTimeChanger);

        this.axisScaleColor = createSelect();
        this.axisScaleColor.position(530, 270);
        this.axisScaleColor.parent("forCanvas");
        this.axisScaleColor.style('fontSize', '12px');
        this.axisScaleColor.style('width', '110px');
        this.axisScaleColor.style('height', '18px');
        this.axisScaleColor.option("black"); 
        this.axisScaleColor.option("red");
        this.axisScaleColor.option("green");
        this.axisScaleColor.option("magenta");
        this.axisScaleColor.option("yellow");
        this.axisScaleColor.option("blue");
        this.axisScaleColor.input(realTimeChanger);

        this.scaleTitleFontSize = createSelect();
        this.scaleTitleFontSize.position(545, 182);
        this.scaleTitleFontSize.parent("forCanvas");
        this.scaleTitleFontSize.style('fontSize', '12px');
        this.scaleTitleFontSize.style('width', '40px');
        this.scaleTitleFontSize.style('height', '18px');
        this.scaleTitleFontSize.option(10, '10'); 
        this.scaleTitleFontSize.option(12, '12');
        this.scaleTitleFontSize.option(14, '14');
        this.scaleTitleFontSize.option(16, '16');
        this.scaleTitleFontSize.option(18, '18');
        this.scaleTitleFontSize.option(20, '20');
        this.scaleTitleFontSize.option(22, '22');
        this.scaleTitleFontSize.input(realTimeChanger);

    }
    axis(){
        textAlign(CENTER);
        strokeWeight(1)
        line(478, 0, 478, 550);
        line(762, 0, 762, 550);
        line(0, 550, 760, 550);
        line(480, 120, 760, 120);
        line(480, 162, 760, 162);
        line(480, 225, 760, 225);
        line(480, 290, 760, 290);

        push();
        translate(100, 462);
        stroke(this.axisColor.value());
        strokeWeight(this.borderWidth.value());
        line(0, 0, 336, 0);
        line(0, 0, 0, -378);
        line(0, -378, 336, -378);
        line(336, 0, 336, -378);
        
        strokeWeight(this.borderWidth.value());
        for(let i = 0; i <= 336; i = i + 48){
            line(i, 0, i, 8);
        }

        for(let i = 0; i <= 378; i = i + 54){
            line(0, -i, -8, -i);
        }
        
        strokeWeight(Number(this.axisScaleFontSize.value())/15);
        textSize(Number(this.axisScaleFontSize.value())); 
        fill(this.axisScaleColor.value());
        stroke(this.axisScaleColor.value());
        textFont(`${this.axisFont.value()}`);  
        for(let q = 0; q <= 336; q = q + 48){
            text(`${round(0.1*(q/48), 1)}`, q, 25);
        }
        for(let q = 0; q <= 378; q = q + 54){
            text(`${round(0.1*(q/54), 1)}`, -25, -q);
        }
     
        strokeWeight(0.5);
        noFill();
        beginShape();
        for(let l = 0; l < xdata.length; l++){
            vertex((4*xdata[l]/(xdata[l]+(15*ydata[l])+(3*zdata[l])))*480, (9*ydata[l]/(xdata[l]+(15*ydata[l])+(3*zdata[l])))*(-542));
        }
        endShape(CLOSE);
        pop();

        push();
        fill(this.axisTitleColor.value());
        textFont(`${this.axisScaleFont.value()}`);
        textSize(Number(this.scaleTitleFontSize.value()));
        text('u\'', 270, 505);
        text('v\'', 55, 280);
        pop();

        fill('black');
        textSize(12);
        textStyle(BOLD);
        text('Border:', 510, 135);
        text('Axis:', 505, 243);
        text('Axis title:', 515, 178);
        text('Legends:', 515, 310);

        textStyle(ITALIC);
        textSize(12);
        textFont("Arial");
        text('Color', 630, 155);  // border color
        text('Color', 505, 217);  // axis title color
        text('Color', 505, 285);  // for axis
        text('Color', 505, 355);  // for legends
        text('Width', 505, 155);
        text('Font', 620, 195);   // for axis title
        text('Font', 620, 260);   // for axis
        text('Font', 620, 330);   // for legends
        text('Font size', 515, 195);  // axis title
        text('Font size', 515, 260);  // for axis
        text('Font size', 515, 330);   // for legends
        text('File id:', 510, 85);

        textSize(28);
        textStyle(NORMAL);
        textFont('Walter Turncoat')
        text('CIELUV chromaticiy diagram 1976', 250, 50);
    }
    CIEimage(){
        image(img, 85, 120, 319, 359);
    }
}

class CIEFileReader{
    constructor(){

        this.input_file = createFileInput(this.userFileLoaded);
        this.input_file.position(490, 20);
        this.input_file.parent("forCanvas");

        this.addbutton = createButton('Calculate');
        this.addbutton.position(687, 20);
        this.addbutton.parent("forCanvas");
        this.addbutton.mousePressed(this.calculexy);

        this.addciepoint = createButton('add CIE coordinate');
        this.addciepoint.position(630, 70);
        this.addciepoint.parent("forCanvas");
        this.addciepoint.mousePressed(this.addCIEpoint);

        this.removeciepoint = createButton('Remove CIE coordinate');
        this.removeciepoint.position(490, 95);
        this.removeciepoint.parent("forCanvas");
        this.removeciepoint.mousePressed(this.removeCIEpoint);  

        this.save_image = createButton('Save as image');
        this.save_image.position(656, 95);
        this.save_image.parent("forCanvas");
        this.save_image.mousePressed(this.saveImage);

        inputx = createInput();
        inputx.position(505, 45);
        inputx.size(40);
        inputx.parent("forCanvas");
    
        inputy = createInput();
        inputy.position(590, 45);
        inputy.size(40);
        inputy.parent("forCanvas");

        inputcct = createInput();
        inputcct.position(680, 45);
        inputcct.size(72);
        inputcct.parent("forCanvas");

        input_file_id = createInput();
        input_file_id.position(530, 70);
        input_file_id.size(80);
        input_file_id.parent("forCanvas");

        this.legendFontSize = createSelect();
        this.legendFontSize.position(550, 317);
        this.legendFontSize.parent("forCanvas");
        this.legendFontSize.style('fontSize', '12px');
        this.legendFontSize.style('width', '40px');
        this.legendFontSize.style('height', '18px');
        this.legendFontSize.option(10, '10'); 
        this.legendFontSize.option(12, '12');
        this.legendFontSize.option(14, '14');
        this.legendFontSize.option(16, '16');
        this.legendFontSize.option(18, '18');
        this.legendFontSize.input(realTimeChanger);

        this.legendFont = createSelect();
        this.legendFont.position(640, 317);
        this.legendFont.parent("forCanvas");
        this.legendFont.style('fontSize', '12px');
        this.legendFont.style('width', '120px');
        this.legendFont.style('height', '18px');
        this.legendFont.option("Georgia"); 
        this.legendFont.option("Arial");
        this.legendFont.option("Walter Turncoat");
        this.legendFont.option("Times New Roman");
        this.legendFont.input(realTimeChanger);

        this.legendColor = createSelect();
        this.legendColor.position(527, 342);
        this.legendColor.parent("forCanvas");
        this.legendColor.style('fontSize', '12px');
        this.legendColor.style('width', '110px');
        this.legendColor.style('height', '18px');
        this.legendColor.option("black"); 
        this.legendColor.option("red");
        this.legendColor.option("green");
        this.legendColor.option("magenta");
        this.legendColor.option("yellow");
        this.legendColor.option("blue");
        this.legendColor.input(realTimeChanger);

    }
    async getData(){
        const response = await fetch('files/ciexyz31_1.csv');
        const data = await response.text();
    
        const rows = data.split('\n').slice();
        rows.forEach(element => {
            const row = element.split(',');
            wavelength.push(float(row[0]));
            xdata.push(float(row[1]));
            ydata.push(float(row[2]));
            zdata.push(float(row[3]));
        })
    }

    text(){
        textSize(16);
        text('u\'', 495, 60);
        text('v\'', 580, 60);
        text('CCT', 660, 60);
    }

    userFileLoaded(file){
        wavelengthcol = [];
        intensitycol = [];

        let index = file.name.lastIndexOf('.');
        let fileExt = file.name.substring(index);
        if(fileExt === '.txt' || fileExt === '.csv' || fileExt === '.uxd' || fileExt === '.xls' || fileExt === '.xlsx'){
            let fileString = file.data.split(/\r\n|\n/);
            fileString.forEach(element => {
                if(/[^0-9,.\s\tEe+-]/g.test(element)){
                    //pass
                }else if(element == ''){
                    //pass;
                }else{
                    let rowTrimed = element.replace(/^\s+|\s+$/gm,'');
                    if(/[,]|\s+/.test(rowTrimed)){
                        let toArrays = rowTrimed.replace(/[,]|\s+/, '\t');
                        let row = toArrays.split('\t');
                        wavelengthcol.push(row[0]);
                        intensitycol.push(row[1]);
                    }else{
                        alert(`the delemiter must be ','/'Tab'`)
                    }
                }
            })
            print(wavelengthcol, intensitycol);
        }else{
            alert('load txt file format please')
        }
        file_name = str(file.name);
        filename1 = file_name.split('.');
    }

    calculexy(){
        xyzWavelength = [];
        xValues = [];
        yValues = [];
        zValues = [];
        // for calculating the x, y, and cct values
        for(let m = 0; m <= wavelength.length; m++){
            for(let n = 0; n <= wavelengthcol.length; n++){
                let num = wavelength[m];
                let roundedWavelength = round(float(wavelengthcol[n]));
                if(num === roundedWavelength){
                    xyzWavelength.push(roundedWavelength);
                    xValues.push(float(intensitycol[n]) * xdata[m]);
                    yValues.push(float(intensitycol[n]) * ydata[m]);
                    zValues.push(float(intensitycol[n]) * zdata[m]);
                }else{
                    //pass;
                }
            }
        }
        let sumX = 0;
        let sumY = 0;
        let sumZ = 0;
        for(let i = 0; i < xyzWavelength.length; i++){
            sumX += xValues[i];
            sumY += yValues[i];
            sumZ += zValues[i];
        }
        x = (4*sumX)/(sumX + (15*sumY) + (3*sumZ));
        y = (9*sumY)/(sumX + (15*sumY) + (3*sumZ));

        print(x, y);
        let n, cct;
        n = (x-0.332)/(0.1858-y);
        cct = (437*pow(n, 3)) + (3601*pow(n, 2)) + (6861*n) + (5517);
        inputx.value(round(x, 3));
        inputy.value(round(y, 3));
        inputcct.value('Not applicable');  //round(cct, 2)
        input_file_id.value(filename1[0]);
    }

    addCIEpoint(){
        let x1 = inputx.value();
        let y1 = inputy.value();
        let file_id = input_file_id.value();
            xcoordinate.push(round(x1, 3));
            ycoordinate.push(round(y1, 3));
            symbolpoint.push(symbol[z]);
            namesArray.push(file_id);

        z++;
        print(x, y, xcoordinate);
    }

    CIEpoint(){
        push();
        fill(this.legendColor.value());
        textFont(this.legendFont.value());
        textSize(Number(this.legendFontSize.value()));
        textAlign(LEFT);
        textStyle(NORMAL);
        for(let j = 0; j <= xcoordinate.length-1; j++){
            push();
            translate(100, 462);
            text(`${symbolpoint[j]}`, (float(xcoordinate[j])*480)-(Number(this.legendFontSize.value()))/3, (float(ycoordinate[j]*-544)) + (Number(this.legendFontSize.value()))/2.5);
            pop();
            push();
            translate(0, 100);
            text(`${symbolpoint[j]} ` + namesArray[j], 300, j*20);
            pop();
        }
        pop();
    }
    removeCIEpoint(){
        xcoordinate.splice(-1, 1);
        ycoordinate.splice(-1, 1);
        symbolpoint.splice(-1, 1);
        namesArray.splice(-1, 1);
        
    }
    saveImage(){
        var to_save = get( 20, 20, 450, 510 ); 
        save(to_save, "CIE1976chromaticitydiagram.png");
    }
}








