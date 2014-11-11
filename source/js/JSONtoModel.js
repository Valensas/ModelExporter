function jsonToModelPreparer(dataModel){
	console.log("jsonToModelPreparer")

	if(jsonArray.length>0){
		var containerCount=0;
		for(var i = 0; i<jsonArray.length; i++){
			if(jsonArray[i].typeOfJSON  == 'array'){
				JSONtoModel(dataModel,'Container'+(containerCount+1),jsonArray[i]);
				containerCount++;
			}else{
				JSONtoModel(dataModel,'Class'+(i-containerCount+1),jsonArray[i]);
			}
		}
        saveModel(dataModel,1);
	}else{
		return;
	}
}

function JSONtoModel (dataModel,name,obj){
	 console.log("JSONToModel")

	if(obj == null){
		return;
	}else if(obj.typeOfJSON === 'array'){
		var object = obj.json;
		var myClass = new DataClass(name);
		myClass.setContainer(true);
		var typeStr = typeAdjuster(dataModel, 'objects', object);
	    property = new Property('objects',typeStr);
	    myClass.addProperty(property);
		dataModel.addClass(myClass);
	}
	else {
		var object;
		if(obj.typeOfJSON === 'dict'){
			object = obj.json;
		}else{
			object = obj;
		}
		var myClass = dataModel.getClass(name);
		if(myClass == undefined){
			myClass  = new DataClass(name);
			var key;
			for (key in object) {
	     		if (object.hasOwnProperty(key)){
	     			var val = object[key];
	     			var typeStr = typeAdjuster(dataModel, key, val);
	     			property = new Property(key,typeStr);
	     			myClass.addProperty(property);
	     		}
	     	}
	     	dataModel.addClass(myClass);
		}else{
			for (key in object) {
	     		if (object.hasOwnProperty(key)){
	     			var property = myClass.getProperty(key);
	     			var val = object[key];
	     			var typeStr = typeAdjuster(dataModel, key, val);
	     			if(property == undefined){
	     				property = new Property(key,typeStr);
	     				myClass.addProperty(property);
	     			}else if(property.type.toString === ""){
	     				property.setType(typeStr);
	     			}
	     		}
	     	}
		}
	}
}

function typeAdjuster(dataModel, key, val){
	var typeOfVal = typeof val;
	if(typeOfVal === 'boolean'){
		return 'Bool';
	}else if(typeOfVal === 'number'){
		if (isInt(val)){
			return 'Int';
		}else{
			return 'Double';
		}
	}else if(typeOfVal === 'string'){
		return 'String';
	}else if(typeOfVal === 'object'){
		if($.isArray(val)){
			for(var i = 0 ; i<val.length ; i++){
				typeAdjuster(dataModel, key, val[i]);
			}
			return '['+typeAdjuster(dataModel, key, val[0])+']';
		}else if(val === null){
			return "";
		}else{
			JSONtoModel(dataModel,capitaliseFirstLetter(key),val);
			return capitaliseFirstLetter(key);
		}
	}else{
		alert("invalid JSON");
	}
}
 
function isInt(n){
    return typeof n== "number" && isFinite(n) && n%1===0;
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}