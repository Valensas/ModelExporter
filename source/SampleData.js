
function sampleData (){

   var myDataModel = new DataModel();

     var classA = new DataClass("ClassA");

      var a1 = new Property("a1","Int");
      var a2 = new Property("a2","String");
      var a3 = new Property("a3","Object");

      var b1 = new Property("b1","[Int]");
      var b2 = new Property("b2","[String]");
      var b3 = new Property("b3","[Object]");

      var c1 = new Property("c1","[String:String]");
      var c2 = new Property("c2","[String:Object]");

      var d1 = new Property("d1","[[String]]");
      var d2 = new Property("d2","[[Object]]");

      var e1 = new Property("e1","[[[String]]]");
      var e2 = new Property("e2","[[[Object]]]");

      var f1 = new Property("f1","[[String:String]]");
      var f2 = new Property("f2","[[String:Object]]");

      var g1 = new Property("g1","[[[String:String]]]");
      var g2 = new Property("g2","[[[String:Object]]]");

      var h1 = new Property("h1","[String:[String]]");
      var h2 = new Property("h2","[String:[Object]]");

      var i1 = new Property("i1","[[String:[String]]]");
      var i2 = new Property("i2","[[String:[Object]]]");

      var j1 = new Property("j1","[String:[String:String]]");
      var j2 = new Property("j2","[String:[String:Object]]");

      var k1 = new Property("k1","[String:[String:[String]]]");
      var k2 = new Property("k2","[String:[String:[Object]]]");

      var l1 = new Property("l1","[String:[[String:String]]]");
      var l2 = new Property("l2","[String:[[String:Object]]]");

      var m1 = new Property("m1","[[String:[String:String]]]");
      var m2 = new Property("m2","[[String:[String:Object]]]");


//true
      classA.addProperty(a1);
      classA.addProperty(a2);
      classA.addProperty(a3);

      classA.addProperty(b1);
      classA.addProperty(b2);
      classA.addProperty(b3);

      classA.addProperty(c1);
      classA.addProperty(c2);

      classA.addProperty(d1);
      classA.addProperty(d2);

      classA.addProperty(e1);
      classA.addProperty(e2);

//false
      classA.addProperty(f1);
      classA.addProperty(f2);

      classA.addProperty(g1);
      classA.addProperty(g2);

      classA.addProperty(h1);
      classA.addProperty(h2);

      classA.addProperty(i1);
      classA.addProperty(i2);

      classA.addProperty(j1);
      classA.addProperty(j2);

      classA.addProperty(k1);
      classA.addProperty(k2);

      classA.addProperty(l1);
      classA.addProperty(l2);

     classA.addProperty(m1);
     classA.addProperty(m2);

      myDataModel.addClass(classA);

   return myDataModel;
}

function sampleData2 (){

   var myDataModel = new DataModel();

     var person = new DataClass("Person");
       var personName = new Property("name", "[[String:String]]");
       var personAge = new Property("age","[String:[String:Animal]]");
       var personAnimal = new Property("zoo","[[[String:Animal]]]");
       var personPets = new Property("pets","[[String:[String]]]");
       var personDog = new Property("dog","[[String:[Animal]]]");
       var personCat = new Property("cat","[String:[String:[Animal]]]");
     var animal = new DataClass("Animal");
       var animalName = new Property("name", "[String]");
       var animalCanFly = new Property("canFly", "[[String]]");
       var animalNumberOfLegs = new Property("numberOfLegs","Int");
       var animalFriendList = new Property("friendList","[[String:[Double]]]")
     var robot = new DataClass("Robot");
       var robotDoubleNum = new Property("doubleNum", "Double");
       var robotDoubleNumArr = new Property("doubleNumArr", "[Double]");
       var robotDoubleNumArrArr = new Property("doubleNumArrArr", "[[Double]]");
       var robotDoubleNumArrArrArr = new Property("doubleNumArrArr", "[[[Double]]]");
       var robotDoubleMix = new Property("doubleMix", "[[[[Double:[Double:Person]]]]]");
   person.addProperty(personName);
   person.addProperty(personAge);
   person.addProperty(personAnimal);
   person.addProperty(personPets);
   person.addProperty(personDog);
   person.addProperty(personCat);
   myDataModel.addClass(person);

   animal.addProperty(animalName);
   animal.addProperty(animalCanFly);
   animal.addProperty(animalNumberOfLegs);
   animal.addProperty(animalFriendList);
   myDataModel.addClass(animal);

   robot.addProperty(robotDoubleNum);
   robot.addProperty(robotDoubleNumArr);
   robot.addProperty(robotDoubleNumArrArr);
   robot.addProperty(robotDoubleNumArrArrArr);
   robot.addProperty(robotDoubleMix);
   myDataModel.addClass(robot);

return myDataModel;
}