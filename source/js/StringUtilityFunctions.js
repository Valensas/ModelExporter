//---------------------------------------------------------------------------------------------------------
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
          : match
      ;
    });
  };
}

//String Utility Functions------------------------------------------------

//indentation
function indent(numOfTabs){
  var blanks = '';
  for (var i = 0; i < numOfTabs; i++){
    blanks += '    ';
  }
  return blanks;
}

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};