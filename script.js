//necc variables
//the canvas
var canvas = document.getElementById("img-canvas");
var canvasParent = document.getElementById("img-canvas-parent"); //the div that holds the canvas
var pallete = document.getElementById("pallete");
var allColors = document.getElementById("all-colors-list");
var selectedColor = document.getElementById("selected-color");
var selectedColorHex = document.getElementById("selected-color-hex");
var selectedColorRGB = document.getElementById("selected-color-rgb");

var ctx = canvas.getContext("2d");
var url = window.URL || window.webkitURL;
var imgInput = null;
var currentImageData = null;

//console.log(Marvin);

//function to get image file
function uploadImage()
{   
    if (imgInput) imgInput.remove();

    var tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = "image/*"
    tempInput.onchange = copyImageToCanvas;
    tempInput.click();

    imgInput = tempInput;
}

function copyImageToCanvas()
{   
    var img = new MarvinImage();
    img.load(url.createObjectURL(imgInput.files[0]), function(e) {

        if (img.width > 300 || img.height > 400)
        {
            var clonedImage = img.clone();
            Marvin.scale(img, clonedImage, Math.floor(img.width/1.6), Math.floor(img.height/1.6));

            img = clonedImage;
        }

        //set canvas dimensions as well as its parent
        canvasParent.style.width = img.width+"px";
        canvasParent.style.height = img.height+"px";
        canvasParent.style.marginBottom = "1vh";
        canvasParent.style.marginTop = "1vh";
        canvas.width = img.width;
        canvas.height = img.height;
        img.draw(canvas);

        getColors(img);

        //assign image to global variable
        currentImageData = img;
    })

}

function getColors(img)
{   
    //sort image into clusters of colors
    clusters = [];
    latestCluster = null;

    //loop through every pixel and get its color - 0_0 thats a lot of pixels
    //group pixels into a cluster and if a pixel does not match cluster color
    //then create new cluster with that color
    //then loop through every pixel
    for (let x = 0; x < canvas.width; x++)
    {   
        for (let y = 0; y < canvas.height; y++)
        {
            var r = img.getIntComponent0(x,y);
            var g = img.getIntComponent1(x,y);
            var b = img.getIntComponent2(x,y);
            //var a = img.getAlphaComponent(x,y);

            var pxlColor = [r, g, b];

            //initialize cluster variables if first 1
            if (latestCluster == null) 
            {
                latestCluster = 0;
                clusters.push([pxlColor]);
                continue;
            }
            
            //if this color is diff than previous than add it to new colors
            //only if it doesnt match the other colors
            if (distance(clusters[latestCluster][0], pxlColor) > 5)
            {   
                var isMatched = false;
                for (let x = 0; x < clusters.length; x++)
                {
                    if (distance(clusters[x][0], pxlColor) < 5) 
                    {   
                        clusters[x].push([pxlColor]);
                        isMatched = true;
                    }
                }

                if (isMatched) continue;

                latestCluster++;
                clusters.push([pxlColor]);
            }
            else
            {
                clusters[latestCluster].push([pxlColor]);
            }
        }
    }

    //now that we hav the colors - lets show them in the UI
    assignPallete(clusters);
    assignAllColors(clusters);
}

function assignAllColors(clusters) {
    //empty previous colors
    allColors.innerHTML = "";

    //split colors into chunks
    var chunkSize = 3;
    var rowedColors = [];
    for (let i = 0; i <clusters.length; i += chunkSize) {
        rowedColors.push(clusters.slice(i, i + chunkSize));
    }

    //loop through each chunk, make a row and add the colors in the chunk
    for (let x = 0; x < rowedColors.length; x++) {
        var colorItemParent = document.createElement("div");
        colorItemParent.className = "color-list-item";
        allColors.appendChild(colorItemParent);

        colorRow = rowedColors[x];
        for (let j = 0; j < colorRow.length; j++) {
            var color = colorRow[j][0];
            
            //create the little color preview
            //also store rgb and hex texts for later on retrieval if needed
            var colorPreview = document.createElement("button");
            colorPreview.className = "color-list-item-preview";
            colorPreview.hex = "HEX: #" + componentToHex(color[0])+componentToHex(color[1])+componentToHex(color[2]);
            colorPreview.rgb = "RGB: "+color[0]+" "+color[1]+" "+color[2];
            colorPreview.style.gridColumn = (j+1)+"/"+(j+2);
            colorPreview.style.backgroundColor = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            
            //add onclick method for selected color viewing
            //access the hex and rgb values we stored earlier
            colorPreview.onclick = function(e) {
                selectedColor.style.backgroundColor = this.style.backgroundColor;
                selectedColorHex.textContent = this.hex;
                selectedColorRGB.textContent = this.rgb;
            }

            colorItemParent.appendChild(colorPreview);
        }
    }
}

function assignPallete(clusters) {
    //empty previous colors
    pallete.innerHTML = "";

    //5 most used colors
    var palleteColors = clusters.sort((a, b) => {return b.length - a.length;}).slice(0, 5);

    //split colors into chunks
    var chunkSize = 3;
    var rowedColors = [];
    for (let i = 0; i < palleteColors.length; i += chunkSize) {
        rowedColors.push(palleteColors.slice(i, i + chunkSize));
    }
    
    //loop through each chunk, make a row and add the colors in the chunk
    for (let x = 0; x < rowedColors.length; x++) {
        var colorItemParent = document.createElement("div");
        colorItemParent.className = "color-list-item";
        pallete.appendChild(colorItemParent);

        colorRow = rowedColors[x];
        for (let j = 0; j < colorRow.length; j++) {
            var color = colorRow[j][0];
            
            var colorPreview = document.createElement("button");
            colorPreview.className = "color-list-item-preview";
            colorPreview.hex = "HEX: #" + componentToHex(color[0])+componentToHex(color[1])+componentToHex(color[2]);
            colorPreview.rgb = color[0]+" "+color[1]+" "+color[2];
            colorPreview.style.gridColumn = (j+1)+"/"+(j+2);
            colorPreview.style.backgroundColor = "rgb("+color[0]+","+color[1]+","+color[2]+")";

            //add onclick method for selected color viewing
            //access the hex and rgb values we stored earlier
            colorPreview.onclick = function(e) {
                selectedColor.style.backgroundColor = this.style.backgroundColor;
                selectedColorHex.textContent = this.hex;
                selectedColorRGB.textContent = this.rgb;
            }
            
            colorItemParent.appendChild(colorPreview);
        }
    }
}

//get the euclidean distance from colors 
function distance(color1, color2)
{   
    //calculate distance as if each color was a vector3
    var xDis = Math.abs(color2[0]-color1[0]);
    var yDis = Math.abs(color2[1]-color1[1]);
    var zDis = Math.abs(color2[2]-color1[2]);

    return Math.floor(Math.sqrt(xDis^2+yDis^2+zDis^2));
}

function getMouseOnCanvas(mouseEvent) 
{
    var r = canvas.getBoundingClientRect();

    return {x: Math.floor(mouseEvent.clientX - r.left), y: Math.floor(mouseEvent.clientY - r.top)};
}