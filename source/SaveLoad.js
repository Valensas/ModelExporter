
function saveModel(dataModel, id){

	var classArrayLength = dataModel.classArray.length;
	localStorage.setItem(id+'_class_length', classArrayLength);

	for (var i = 0; i < classArrayLength; i++) {
		var myClass = dataModel.classArray[i];
		localStorage.setItem(id + '_class_' + i, myClass.name);

		var propertyArrayLength = myClass.propertyArray.length;
		localStorage.setItem(id + '_class_'+ i +'_length', propertyArrayLength);

		for(var j = 0; j < propertyArrayLength; j++){
			var myProperty = myClass.propertyArray[j];
			localStorage.setItem(id + '_class_' + i + '_propertyName_' + j, myProperty.name);
			localStorage.setItem(id + '_class_' + i + '_propertyType_' + j, myProperty.type.toString);
		}

	};
	
}

function loadModel(id){
	var classArrayLength = localStorage.getItem(id + "_class_length");
	if(!classArrayLength){
		return null;
	}
 	var dataModel = new DataModel(id);
	for (var i = 0; i < classArrayLength; i++) {
		var className = localStorage.getItem(id + '_class_' + i);
		var newClass = new DataClass(className);

		var propertyArrayLength = localStorage.getItem(id + '_class_'+ i +'_length');

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