function modelToSwift(dataModel){
  var swiftList = []
  for (var i = 0; i<dataModel.classArray.length; i++){
    var swiftClass = "\n";
    var myDataClass = dataModel.classArray[i];
    if(dataModel.classArray[i].container === "true"){
      swiftClass += containerClassToSwift(dataModel.classArray[i].name,dataModel.classArray[i].propertyArray[0].name);
    }else{
      swiftClass += classDeclerationToSwift(myDataClass.name);
      for (var j = 0; j<myDataClass.propertyArray.length; j++){
        var myProperty = myDataClass.propertyArray[j];
        swiftClass += propertyDeclerationToSwift(myProperty.name,myProperty.type);
      }
      swiftClass += initializerToSwift();
      for (var j = 0; j<myDataClass.propertyArray.length; j++){
        var myProperty = myDataClass.propertyArray[j];
        swiftClass += propertyInitToSwift(myProperty.name, myProperty.type, 2);
      }
      swiftClass += endOfClassToSwift();
    }
  swiftList.push(swiftClass);
  }
  return swiftList;
}
function classDeclerationToSwift(className){
  var str = 'import Foundation\n\n';
  str += String.format('class {0} {\n\n', className);
  return str;
} 
function propertyDeclerationToSwift(name, type){
  var str = indent(1);
  if(type instanceof ArrayType){
    if(type.innerType instanceof ArrayType || type.innerType instanceof DictType){
      str += String.format('var {0} : ({1})?\n', name, type.toString);
    }
    else{
      str += String.format('var {0} : {1}?\n', name, type.toString);
    }
  }else{
    str += String.format('var {0} : {1}?\n', name, type.toString);
  }
  return str;
}

function containerClassToSwift(className,propertyName){
  var str = 'import Foundation\n\n';
  str += String.format('class {0} {\n\n', className);
  str += indent(1);
  str += String.format('var {0} : [{1}]?\n',propertyName,capitaliseFirstLetter(propertyName));
  str += '\n'+indent(1);
  str += String.format('init (jsonArray:NSArray) {\n');
  str += indent(2);
  str += 'for dict in jsonArray as? NSDictionary{\n';
  str += indent(3);
  str += String.format('{0}.append({1}(jsonDict: dict))\n',propertyName,capitaliseFirstLetter(propertyName));
  str += indent(2)+"}\n"+indent(1)+"}\n\n}\n\n\n";
  return str;
}

function initializerToSwift(){
  var str = '\n'+indent(1);
  str += String.format('init (jsonDict:NSDictionary) {\n');
  return str;
}
function propertyInitToSwiftNested(name, type, numOfTabs){
  var str = "";
  if(type instanceof PrimitiveType){
    str += name;
  }else if( type instanceof ArrayType){
    str += indent(numOfTabs);
    str += String.format('var {0}_dummy = {1}()\n',name, type.toString);
    if (type.innerType instanceof ArrayType){
      newName = name + '_arr'; 
    }else if (type.innerType instanceof DictType){
      newName = name + '_dict';       
    }else{
      newName = name + '_val';
    }
    str += indent(numOfTabs);
    str += String.format('for {0} in {1}{\n', newName, name);
    if(type.innerType instanceof ArrayType || type.innerType instanceof DictType){
      str += propertyInitToSwiftNested(newName, type.innerType, ++numOfTabs);
      str += indent(numOfTabs);
      str += String.format('{0}_dummy.append({1}_dummy)\n', name, newName);
    }else{
      str += indent(++numOfTabs);
      str += String.format('{0}_dummy.append({1})\n', name, propertyInitToSwiftNested(newName, type.innerType, 0));
    }
    str += indent(--numOfTabs);
    str += '}\n';
  }else if(type instanceof DictType){
    str += indent(numOfTabs);
    str += '';
    str += String.format('var {0}_dummy = {1}()\n', name, type.toString);
    var keyName = name + '_key';         
    var valueName = '';
    if (type.valueType instanceof ArrayType){
      valueName = name + '_arr';         
    }else if (type.valueType instanceof DictType){
      valueName = name + '_dict';       
    }else{
      valueName = name + '_val';
    }
    str += indent(numOfTabs);
    str += String.format('for ({0}, {1}) in {2} {\n', keyName, valueName, name);
    if(type.valueType instanceof ArrayType || type.valueType instanceof DictType){
      str += propertyInitToSwiftNested(valueName, type.valueType, ++numOfTabs);
      str += indent(numOfTabs);
      str += String.format('{0}_dummy.updateValue({1}_dummy, forKey: {2})\n', name, valueName, keyName);
    }else{
      str += indent(++numOfTabs);
      str += String.format('{0}_dummy.updateValue(', name);
      str += String.format('{0}, forKey: ', propertyInitToSwiftNested(valueName, type.valueType, 0));
      if(type.keyType instanceof PrimitiveType){
        str += keyName;
      }
      else{
        str += propertyInitToSwiftNested(keyName, type.keyType, 0);
      }      
      str += ')\n';
    }
    str += indent(--numOfTabs);
    str += '}\n';
  }else{
    str += String.format('{0}(jsonDict: {1})', type.toString, name);
  }
  return str;
}
function propertyInitToSwift(name, type, numOfTabs){
  str = "";
  if(type instanceof PrimitiveType){
    str += indent(numOfTabs);
    str += String.format('self.{0} = jsonDict["{0}"] as? {1}\n', name, type.toString);
  }else if( type instanceof ArrayType){
    str += "\n";
    str += indent(numOfTabs);
    str += String.format('if let {0} = jsonDict["{0}"] as? {1}{\n', name, printTypeNSDict(type));
    str += indent(++numOfTabs);
    str += String.format('var {0}_dummy = {1}()\n', name, type.toString);
    var newName;
    if (type.innerType instanceof ArrayType){
      newName = name + '_arr';         
    }else if (type.innerType instanceof DictType){
      newName = name + '_dict';       
    }else{
      newName = name + '_val';
    }
    str += indent(numOfTabs);
    str += String.format('for {0} in {1}{\n',newName, name);
    if (type.innerType instanceof ArrayType || type.innerType instanceof DictType){
      str += propertyInitToSwiftNested(newName, type.innerType, ++numOfTabs);
      str += indent(numOfTabs);
      str += String.format('{0}_dummy.append({1}_dummy)\n', name, newName);
    }else{
      str += indent(++numOfTabs);
      str += String.format('{0}_dummy.append({1})\n', name, propertyInitToSwiftNested(newName, type.innerType, 0));
    }
    str += indent(--numOfTabs);
    str += '}\n';
    str += indent(numOfTabs);
    str += String.format('self.{0} = {0}_dummy\n', name);
    str += indent(--numOfTabs);
    str += '}\n';
  }else if(type instanceof DictType){
    str += '\n';
    str += indent(numOfTabs);
    str += String.format('if let {0} = jsonDict["{0}"] as? {1}{\n', name, printTypeNSDict(type));
    str += indent(++numOfTabs);
    str += String.format('var {0}_dummy = {1}()\n', name, type.toString);
    var keyName = name + '_key';         
    var valueName = '';
    if (type.valueType instanceof ArrayType){
      valueName = name + '_arr';         
    }else if (type.valueType instanceof DictType){
      valueName = name + '_dict';       
    }else{
      valueName = name + '_val';
    }
    str += indent(numOfTabs);
    str += String.format('for ({0}, {1}) in {2}{\n', keyName, valueName, name);
    if(type.valueType instanceof ArrayType || type.valueType instanceof DictType){
      str += propertyInitToSwiftNested(valueName, type.valueType, ++numOfTabs);
      str += indent(numOfTabs);
      str += String.format('{0}_dummy.updateValue({1}_dummy, forKey:{2})\n', name, valueName, keyName);
    }else{
      str += indent(++numOfTabs);
      str += String.format('{0}_dummy.updateValue({1}, forKey: ', name, propertyInitToSwiftNested(valueName, type.valueType, 0));
      if(type.keyType instanceof PrimitiveType){
        str += String.format('{0})\n',keyName);
      }
      else{
        str += String.format('{0})\n)', propertyInitToSwiftNested(keyName, type.keyType, 0));
      }      
    }
    str += indent(--numOfTabs);
    str += '}\n';
    str += indent(numOfTabs);
    str += String.format('self.{0} = {0}_dummy\n', name);
    str += indent(--numOfTabs);
    str += '}\n';
  }else{
    str += '\n';
    str += indent(numOfTabs);
    str += String.format('if let {0} = jsonDict["{0}"] as? {1}{\n', name, printTypeNSDict(type));
    str += indent(++numOfTabs);
    str += String.format('self.{0} = {1}(jsonDict: {0})\n', name, type.toString);
    str += indent(--numOfTabs);
    str += '}\n';
  }
  return str;
}
function endOfClassToSwift(){
  return "\n"+indent(1)+"}\n\n}\n\n\n";
}

function printTypeNSDict(type){
  if(type instanceof PrimitiveType){
    return type.toString;
  }else if (type instanceof ArrayType){
    return '['+printTypeNSDict(type.innerType)+']';
  }else if (type instanceof DictType){
    return '['+printTypeNSDict(type.keyType)+':'+printTypeNSDict(type.valueType) +']';
  }else{
    //object
    return 'NSDictionary';
  }
}