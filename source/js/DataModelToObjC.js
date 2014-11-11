function modelToObjC(dataModel){
  console.log("model To ObjectiveC")
  var objCList = [];
  for (var i = 0; i<dataModel.classArray.length; i++){
    var objCHeader = "";
    var objCClass = "";

    var myDataClass = dataModel.classArray[i];

    objCHeader += headerDeclerationToObjC(myDataClass);

    if( myDataClass.container === "true" ){
      objCHeader += containerHeaderToObjC(myDataClass.propertyArray[0].name);
      objCClass += containerImplementationToObjC(myDataClass.name,myDataClass.propertyArray[0].name);
    } else {
        //write header file
      for (var j = 0; j<myDataClass.propertyArray.length; j++){
        var myProperty = myDataClass.propertyArray[j];
        objCHeader += propertyDeclerationToObjC(myProperty.name,myProperty.type);
      }
      objCHeader += headerEndToObjC();
      //write m file
      objCClass += classDeclerationToObjC(myDataClass.name)
      for (var j = 0; j<myDataClass.propertyArray.length; j++){
        var myProperty = myDataClass.propertyArray[j];
        objCClass += propertyInitToObjC(myProperty.name, myProperty.type, 2);
      }
      objCClass += endOfClassToObjC();
    }

    var objCobject = {headerStr:objCHeader, classStr:objCClass }
    objCList.push(objCobject);
  }
  return objCList;
}
function containerHeaderToObjC(propertyName){
  var str = String.format('@property (nonatomic, strong) NSArray *{0};\n',propertyName);
  str += '\n-(instancetype)initWithJson:(NSArray*) arr;\n';
  str += '\n@end\n\n\n'
  return str;
}
function containerImplementationToObjC(className, propertyName){
  var str = String.format('#import "{0}.h"\n\n@implementation {0}\n\n',className);
  str += '-(instancetype)initWithJson:(NSArray*) arr {\n\n';
  str += indent(1);
  str += 'if (self = [super init]) {\n\n';
  str += indent(2);
  str += String.format('NSMutableArray *{0}_dummy = [NSMutableArray array];\n',propertyName);
  str += indent(2);
  str += String.format('for (NSDictionary *{0}_val in arr){\n',propertyName);
  str += indent(3);
  str += String.format('{0} *{1}_val_dummy = [[{0} alloc] initWithJson:{1}_val];\n',capitaliseFirstLetter(propertyName),propertyName);
  str += indent(3);
  str += String.format('[{0}_dummy addObject:{0}_val_dummy];\n',propertyName);
  str += indent(2)+"}\n";
  str += indent(2);
  str += String.format('self.{0} = {0}_dummy;\n\n',propertyName);
  str += indent(1)+"}\n\n";
  str += indent(1)+'return self;\n\n}\n\n@end\n\n\n';
  return str;
}
function headerDeclerationToObjC(myClass){
  var str = ('#import "Foundation/Foundation.h"\n');
  var objectList = [""];
  for (var i = 0; i<myClass.propertyArray.length; i++){
    var objTypeStr = getObject(myClass.propertyArray[i].type);
    if (!(objectList.indexOf(objTypeStr) > -1)){
      str += String.format('#import "{0}.h"\n',objTypeStr);
      objectList[objectList.length] = objTypeStr;
    }
  }
  str += String.format('\n@interface {0} : NSObject\n\n',myClass.name);
  return str;
}
function propertyDeclerationToObjC(name, type){
  var typeStr =  typeConverter(type);
  var str = '@property (nonatomic';
  if(!(typeStr == "bool" || typeStr == "int" || typeStr == "double"|| typeStr == "float")){
    str += String.format(', strong) {0} *{1};\n',typeStr,name);    
  }else{
    str += String.format(') {0} {1};\n',typeStr,name);
  }
  return str;
}
function headerEndToObjC(){
  var str = '\n-(instancetype)initWithJson:(NSDictionary*)dict;\n';
  str += '\n@end\n\n\n'
  return str;
}
function classDeclerationToObjC(className){
  var str = String.format('#import "{0}.h"\n\n@implementation {0}\n\n',className);
  str += '-(instancetype)initWithJson:(NSDictionary*) dict {\n\n';
  str += indent(1);
  str += 'if (self = [super init]) {\n\n'
  return str;
}
function propertyInitToObjC(name, type, numOfTabs){
  
  var str = "";
  if (type instanceof PrimitiveType){
    var typeStr = typeConverter(type);
    if(typeStr == "bool" || typeStr == "int" || typeStr == "double" || typeStr == "float"){
      str += indent(numOfTabs);
      str += String.format('self.{0} = [dict[@"{0}"] {1}Value];\n\n',name,typeStr);
    }else{
      str += indent(numOfTabs);
      str += String.format('self.{0} = dict[@"{0}"];\n\n',name);
    }
  }else if(type instanceof ArrayType){
    if(!haveObject(type.innerType)){
      str += indent(numOfTabs); 
      str += String.format('self.{0} = dict[@"{0}"];\n\n',name);
    }else{
      str += indent(numOfTabs);
      str += String.format('NSMutableArray *{0}_dummy = [NSMutableArray array];\n',name)

      var newName = "";
      var collectionType = "";
      if (type.innerType instanceof ArrayType){
        newName = name + "_arr";
        collectionType = "NSArray";
      }else if (type.innerType instanceof DictType){
        newName = name + "_dict";
        collectionType = "NSDictionary";
      }else{
        newName = name + "_val";
        collectionType = "NSDictionary";
      }

      str += indent(numOfTabs);
      str += String.format('for ({0} *{1} in dict[@"{2}"]){\n',collectionType,newName,name);
        
      str += propertyInitToObjCNested(newName,type.innerType,++numOfTabs);

      str += indent(numOfTabs);
      str += String.format('[{0}_dummy addObject:{1}_dummy];\n',name,newName);

      str += indent(--numOfTabs);
      str += '}\n';
      str += indent(numOfTabs);
      str += String.format('self.{0} = {0}_dummy;\n\n',name);
    }
  }else if ( type instanceof DictType){
    if(!haveObject(type.valueType)){
      str += indent(numOfTabs); 
      str += String.format('self.{0} = dict[@"{0}"];\n\n',name);
    }else{
      var keyType = type.keyType,
        valueType = type.valueType,
        keyTypeStr = typeConverter(keyType),
        valueTypeStr = typeConverter(valueType),
        keyName = name + "_key",
        valueName = name + "_value";

      str += indent(numOfTabs);
      str += String.format('NSMutableDictionary *{0}_dummy = [NSMutableDictionary dictionary];\n',name)
      str += indent(numOfTabs);

      if (keyTypeStr == "bool" || keyTypeStr == "int" || keyTypeStr == "double" || keyTypeStr == "float"){
        str += String.format('for (NSNumber *{0} in dict[@"{1}"]) {\n', keyName, name); 
      }else{
        str += String.format('for ({0} *{1} in dict[@"{2}"]) {\n',keyTypeStr, keyName, name); 
      }

      str += indent(++numOfTabs);
      if (valueType instanceof ArrayType){
        str += String.format('NSMutableArray *{0} = [dict[@"{1}"] objectForKey:{2}];\n',valueName,name,keyName);
      }else{
        str += String.format('NSMutableDictionary *{0} = [dict[@"{1}"] objectForKey:{2}];\n',valueName,name,keyName);
      }

      if(valueType instanceof ArrayType || valueType instanceof DictType){
        str += propertyInitToObjCNested(valueName,valueType,numOfTabs);
      }else{
        String.format('{0} *{1}_dummy = [[{0} alloc] initWithJson:{1}];\n',valueTypeStr,valueName);
      }

      str += indent(numOfTabs);
      str += String.format('[{0}_dummy setObject:{1}_dummy forKey:{2}];\n',name,valueName,keyName);

      str += indent(--numOfTabs);
      str += '}\n';
      str += indent(numOfTabs);
      str += String.format('self.{0} = {0}_dummy;\n\n',name);
    }
  }else{
    //object
    str += indent(numOfTabs);
    str += String.format('self.{0} = [[{1} alloc] initWithJson:dict[@"{0}"]];\n\n',name,typeConverter(type));
  }
  return str;
}
function propertyInitToObjCNested(name, type, numOfTabs){
  if(!haveObject(type)){
    str += String.format('self.{0} = {0};\n',name)
  }else{
    var typeStr = typeConverter(type);
    var str = "";
    str += indent(numOfTabs);
    if( type instanceof ArrayType){
      var innerTypeStr = typeConverter(type.innerType);
      str += String.format('NSMutableArray *{0}_dummy = [NSMutableArray array];\n',name);

      var newName = "";
      var collectionType = "";
      if (type.type instanceof ArrayType){
        newName = name + "_arr";
        collectionType = "NSArray";
      }else if (type.type instanceof DictType){
        newName = name + "_dict";
        collectionType = "NSDictionary";
      }else{
        newName = name + "_val";
        collectionType = "NSDictionary";
      }

      str += indent(numOfTabs);
      str += String.format('for ({0} *{1} in {2}){\n',collectionType,newName,name);
        
      str += propertyInitToObjCNested(newName,type.innerType,++numOfTabs);

      str += indent(numOfTabs);
      str += String.format('[{0}_dummy addObject:{1}_dummy];\n',name,newName);

      str += indent(--numOfTabs);
      str += '}\n';
    }else if ( type instanceof DictType){
      var keyType = type.keyType,
        valueType = type.valueType,
        keyTypeStr = typeConverter(keyType),
        valueTypeStr = typeConverter(valueType),
        keyName = name + "_key",
        valueName = name + "_value";

      str += String.format('NSMutableDictionary *{0}_dummy = [NSMutableDictionary dictionary];\n',name)
      str += indent(numOfTabs);

      if (keyTypeStr == "bool" || keyTypeStr == "int" || keyTypeStr == "double" || keyTypeStr == "float"){
        str += String.format('for (NSNumber *{0} in {1}]) {\n', keyName, name); 
      }else{
        str += String.format('for ({0} *{1} in {2}]) {\n',keyTypeStr, keyName, name); 
      }

      str += indent(++numOfTabs);
      if (valueType instanceof ArrayType){
        str += String.format('NSMutableArray *{0} = [{1} objectForKey:{2}];\n',valueName,name,keyName);
      }else{
        str += String.format('NSMutableDictionary *{0} = [{1} objectForKey:{2}];\n',valueName,name,keyName);
      }

      str += propertyInitToObjCNested(valueName,valueType,numOfTabs);
      str += indent(numOfTabs);
      str += String.format('[{0}_dummy setObject:{1}_dummy forKey:{2}];\n',name,valueName,keyName);

      str += indent(--numOfTabs);
      str += '}\n';
    }else{
      //object
      str += String.format('{0} *{1}_dummy = [[{0} alloc] initWithJson:{1}];\n',type.toString,name);
    }
  }
  return str;
}
function endOfClassToObjC(){
  var str = indent(1)+"}\n\n";
  str += indent(1)+'return self;\n\n}\n\n@end\n\n\n';
  return str;
}   
//utility functions
function typeConverter(type){
  if (type instanceof ArrayType ){
    return "NSArray";
  }else if(type instanceof DictType ){
    return "NSDictionary";
  }else{
    switch (type.toString){
      case "Bool" :
        return "bool";
        break;
      case "Double" :
        return "double";
        break;
      case "Int" :
        return "int";
        break;
      case "Float" :
        return "float";
        break;
      case "String" :
        return "NSString";
        break;
      default:
        return type.toString;
    }
  }
}
function getObject(type){
  if(type instanceof PrimitiveType){
    return "";
  }else if(type instanceof ArrayType){
    return getObject(type.innerType);
  }else if(type instanceof DictType){
    return getObject(type.valueType);
  }else{
    return type.toString;
  }
}
function haveObject(type){
  if(type instanceof PrimitiveType){
    return false;
  }else if(type instanceof ArrayType){
    return haveObject(type.innerType);
  }else if(type instanceof DictType){
    return haveObject(type.valueType);
  }else{
    return true;
  }
}