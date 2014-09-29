function createSwiftZip(dataModel){
	var zip = new JSZip();
	zip.folder("Swift Files")
	var swiftCode = modelToSwift(dataModel);
	for (var i = 0; i<swiftCode.length; i++){
	  	zip.file("Swift Files/"+dataModel.classArray[i].name+".swift", swiftCode[i]);
	 }
	location.href="data:application/zip;base64," + zip.generate({type:"base64"});
}

function createObjCZip(dataModel){
	var zip = new JSZip();
	zip.folder("ObjectiveC Files")
	var objcCode = modelToObjC(dataModel);
	for (var i = 0; i<objcCode.length; i++){
	  	zip.file("ObjectiveC Files/"+dataModel.classArray[i].name+".h", objcCode[i].headerStr);
	  	zip.file("ObjectiveC Files/"+dataModel.classArray[i].name+".m", objcCode[i].classStr);
	 }
	location.href="data:application/zip;base64," + zip.generate({type:"base64"});
}
     