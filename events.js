//script is responsible for event listeners

//initialize global variables
var dynamicColorPreview = document.getElementById("dynamic-color-preview");
var dynamicColorPreviewNodes = dynamicColorPreview.childNodes;
var staticColorPreview = document.getElementById("static-color-preview");
var staticColorPreviewNodes = staticColorPreview.childNodes;

//for dynamic hover color
window.addEventListener("mousemove", (e) => {
    if (e.target.id !== "img-canvas" || !currentImageData) return;

    var mousePos = getMouseOnCanvas(e);

    var r = currentImageData.getIntComponent0(mousePos.x,mousePos.y);
    var g = currentImageData.getIntComponent1(mousePos.x,mousePos.y);
    var b = currentImageData.getIntComponent2(mousePos.x,mousePos.y);

    //assign background color to color preview by accessing the child nodes
    dynamicColorPreviewNodes[1].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    dynamicColorPreviewNodes[3].textContent = "hex: #" + componentToHex(r) + componentToHex(g) + componentToHex(g);
    dynamicColorPreviewNodes[7].textContent = r.toString();
    dynamicColorPreviewNodes[9].textContent = g.toString();
    dynamicColorPreviewNodes[11].textContent = b.toString();
})

window.addEventListener("click", (e) => {
    //click for static color from image
    switch (e.target.id) {
        case "img-canvas":
            {
                var mousePos = getMouseOnCanvas(e);

                var r = currentImageData.getIntComponent0(mousePos.x,mousePos.y);
                var g = currentImageData.getIntComponent1(mousePos.x,mousePos.y);
                var b = currentImageData.getIntComponent2(mousePos.x,mousePos.y);

                var hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                //assign background color to color preview by accessing the child nodes
                staticColorPreviewNodes[1].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
                staticColorPreviewNodes[3].textContent = "hex: #" + componentToHex(r) + componentToHex(g) + componentToHex(g);
                staticColorPreviewNodes[7].textContent = r.toString();
                staticColorPreviewNodes[9].textContent = g.toString();
                staticColorPreviewNodes[11].textContent = b.toString();

                return;
            }
    }
})

//convert value to hex - used to convert rgb to hex
function componentToHex(c) {
    if (!c) return "00";
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}