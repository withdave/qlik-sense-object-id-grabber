// Object Grabber
// This script adds the ID of every QS object into the bottom right of each object

// Get list of all object elements. If this doesn't work, try looking for DIVs with attributes set in tid or qva-radial-context-menu
var ogElements = document.getElementsByClassName("qv-gridcell");

// Iterate over elements
for (var i=0; i<ogElements.length; i++) {
    var ogElement = ogElements[i];

    // Build outer div and append
    var ogHtmlOuter = document.createElement("div");
    ogHtmlOuter.style = "position:absolute; bottom:0;right:0;z-index:99999;margin:2px;padding:10px;background-color:#6bb345;user-select:text;color:#FFFFFF";
    ogHtmlOuter.className = "ogOverlay";
    ogHtmlOuter.innerHTML = "<a id=\"ogOverlay" + i + "\" onclick=\"ogCopyToClipboard(document.getElementById('ogOverlay" + i + "').innerHTML)\" style=\"color:#FFFFFF;text-decoration:none;\">" + ogElement.getAttribute("tid") + "</a>";
    ogElement.appendChild(ogHtmlOuter);

    // Write out to console each time
    console.log("Element " + i + " id: " + ogElement.getAttribute("tid"));

}

// Function to copy to clipboard
function ogCopyToClipboard(string) {
    function listener(e) {
    //   e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", string);
    e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    console.log("Copied " + string + " to clipboard");
};
