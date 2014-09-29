//DATAMODEL CLASS----------------------------------------------------------------------------------------

function DataModel(myId){
  this.classArray = [];
}

DataModel.prototype.addClass = function( aClass ){
  this.classArray.push(aClass);
  aClass.parentModel = this;
}

DataModel.prototype.removeClass = function( aClass ){
  var index = this.classArray.indexOf(aClass);
  if (index > -1) {
    aClass.parentModel = null;
    this.classArray.splice(index, 1);
    saveModel(this,1);
    return true;
  }
  return false;
}

DataModel.prototype.getClass = function( aName ){
  var lookup = {};
  for (var i = 0, len = this.classArray.length; i < len; i++) {
    lookup[this.classArray[i].name] = this.classArray[i];
  }
  return lookup[aName];
} 

//DATACLASS CLASS---------------------------------------------------------------------------------------

function DataClass( aName ){
  this.propertyArray = [];
  this.name = aName;
  this.parentModel = null;
}

DataClass.prototype.setName = function( aName ){
  this.name = aName;
}

DataClass.prototype.addProperty = function( aProperty ){
  this.propertyArray.push(aProperty);
  aProperty.parent = this;
}

DataClass.prototype.removeProperty = function( aProperty ){
  var index = this.propertyArray.indexOf(aProperty);
  if (index > -1) {
    aProperty.parent = null;
    this.propertyArray.splice(index, 1);
    saveModel(this.parentModel,1);
    return true;
  }
  return false;
}

DataClass.prototype.getProperty = function( aName ){
  var lookup = {};
  for (var i = 0, len = this.propertyArray.length; i < len; i++) {
    lookup[this.propertyArray[i].name] = this.propertyArray[i];
  }
  return lookup[aName];
} 

//PROPERTY CLASS---------------------------------------------------------------------------------------

function Property(aName, aType){
  this.name = aName;
  this.type = stringToType(aType, "");
  this.parent = null;
}

Property.prototype.setName = function(aName){
  this.name = aName;
  saveModel(this.parent.parentModel,1);
}

Property.prototype.setType = function(aType){
  this.type = stringToType(aType, "");
  saveModel(this.parent.parentModel,1);

}

//TYPES-------------------------------------------------------------------------------------
function PrimitiveType(aType){
  this.toString = aType
}

function ObjectType(aType){
  this.toString = aType;
}

function ArrayType(innerType){
  this.innerType = stringToType(innerType, "");
  this.toString = "["+this.innerType.toString+"]";
}

function DictType (aKeyType, aValueType){
  this.keyType = stringToType(aKeyType, "");
  this.valueType = stringToType(aValueType, "");
  this.toString = "["+this.keyType.toString+":"+this.valueType.toString+"]";
}

//Utility function

//converts string to Type
function stringToType(typeString){
  if (typeString.charAt(0)!="[" || typeString.charAt(typeString.length-1)!="]"){
    if(typeString === "Bool" || typeString === "Int" ||
     typeString === "Double" || typeString === "Float" ||
     typeString === "String"){
      return new PrimitiveType(typeString);
    }else{
      return new ObjectType(typeString);
    }
  }else{
    var inner = typeString.substring(1,typeString.length-1);
    var firstColumnIndex = inner.indexOf(':');
    var firstOpenningBracketIndex = inner.indexOf('[');
    if(firstColumnIndex == -1 || firstOpenningBracketIndex == 0){
      //outer layer is an array
      return new ArrayType(inner);
    }else{
      //outer layer is a dict
      var key = inner.substring(0,firstColumnIndex);
      var value = inner.substring(firstColumnIndex+1, inner.length);
      return new DictType(key,value);
    }
  }
}