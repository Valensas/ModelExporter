
function saveModel(dataModel, id){
	console.log("saveModel")
	
	localStorage.clear();	
	localStorage.setItem(id+'_saved_successfully', false);
	var classArrayLength = dataModel.classArray.length;
	localStorage.setItem(id+'_class_length', classArrayLength);
	for (var i = 0; i < classArrayLength; i++) {
		var myClass = dataModel.classArray[i];
		localStorage.setItem(id + '_class_' + i, myClass.name);

		var propertyArrayLength = myClass.propertyArray.length;
		localStorage.setItem(id + '_class_'+ i +'_length', propertyArrayLength);

		var isContainer = myClass.container;
		localStorage.setItem(id + '_class_'+ i +'_container', isContainer);

		for(var j = 0; j < propertyArrayLength; j++){
			var myProperty = myClass.propertyArray[j];
			if(myProperty.type == null){
				console.log("a property is skipped\n")
			}else{
				localStorage.setItem(id + '_class_' + i + '_propertyName_' + j, myProperty.name);
				localStorage.setItem(id + '_class_' + i + '_propertyType_' + j, myProperty.type.toString);
			}
		}
		if(i == classArrayLength-1){
			localStorage.setItem(id+'_saved_successfully', true);	
		}
	}
}

function isSaved(id){
	var classArrayLength = localStorage.getItem(id + "_class_length");
	if(!classArrayLength){
		return false;
	}
	return true
}

function loadModel(id){
	console.log("loadModel")

	var classArrayLength = localStorage.getItem(id + "_class_length");
 	var dataModel = new DataModel(id);
	for (var i = 0; i < classArrayLength; i++) {
		var className = localStorage.getItem(id + '_class_' + i);
		var newClass = new DataClass(className);

		var propertyArrayLength = localStorage.getItem(id + '_class_'+ i +'_length');
		var isContainer = localStorage.getItem(id + '_class_'+ i +'_container');

		newClass.setContainer(isContainer);

		for(var j = 0; j < propertyArrayLength; j++){
			var propertyName = localStorage.getItem(id + '_class_' + i + '_propertyName_' + j);
			var propertyType = localStorage.getItem(id + '_class_' + i + '_propertyType_' + j);
			var newProperty = new Property(propertyName, propertyType);
			newClass.addProperty(newProperty);
		}
		dataModel.addClass(newClass);
	};

	return dataModel;
}