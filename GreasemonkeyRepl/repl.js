var win = window.open("", "greasemonkey_repl", "width=600, height=400, location=no, toolbar=no, menubar=no, resizable=yes");
var doc = win.document;
doc.body.innerHTML = GM_getResourceText("dialog");

var runButton = doc.getElementById("GreasemonkeyReplButton");
runButton.addEventListener("click", runRepl, false);

function runRepl(){
  var inputEl = doc.getElementById("GreasemonkeyReplInput");
  var outputEl = doc.getElementById("GreasemonkeyReplOutput");
  
  var input = inputEl.value;
  var output = eval( input );
  outputEl.value = output;
}
