//treeview----------------------------------------------------------------------------------------------
$(function(){
  console.log("Treeview is created")
  var dataBeforeEdit;
  $("#tree").fancytree({
    source:[],
    extensions: ["edit", "table", "gridnav"],
    titlesTabbable: true,     // Add all node titles to TAB chain
    edit:{
      triggerStart: ["f2", "dblclick", "shift+click", "mac+enter"],
      beforeEdit: function(event, data){
        dataBeforeEdit = data.node.title;
        // Return false to prevent edit mode
      },
      edit: function(event, data){
        // Editor was opened (available as data.input)
      },
      beforeClose: function(event, data){
        // Return false to prevent cancel/save (data.input is available)
        if(data.input.val()=="" && data.orgTitle == ""){
          if(!model.removeClass(data.node.data.object)){
            data.node.data.object.parent.removeProperty(data.node.data.object);
          }
        }
      },
      save: function(event, data){
        // Save data.input.val() or return false to keep editor open
        console.log("name field is edited")
        data.node.data.object.setName(data.input.val());
        //replaceTypeName(dataBeforeEdit,data.input.val());
        // We return true, so ext-edit will set the current user input
        // as title
        return true;
      },
      close: function(event, data){
        // Editor was removed
         if (data.save){
          var obj = data.node.data.object;
          if(obj instanceof DataClass){
            $("#tree").trigger("nodeCommand", {cmd: "addChild"});
          }else if(obj instanceof Property){
            document.getElementById("typeBox_"+obj.parent.name+"_"+obj.name).focus();
          }else{
            alert("error in auto tab")
          }
         }
      }
    },
    table: {
      indentation: 5,
      nodeColumnIdx: 0
    },
    gridnav: {
      autofocusInput: false,
      handleCursorKeys: true
    },
    renderColumns: function(event, data) {
      var node = data.node,
      $tdList = $(node.tr).find(">td");

      if( node.isFolder() ) {
        // make the title cell span the remaining columns, if it is a folder:
        $tdList.eq(0)
        .prop("colspan", 2)
        .nextAll().remove();
      }else{
        $tdList.eq(1).html("<input type='text' id='typeBox_"+
          node.data.object.parent.name+"_"+node.data.object.name+
          "' name='typeBox' value='"+node.data.object.type.toString+"'>");
      }
    }
  }).on("nodeCommand", function(event, data){
    // Custom event handler that is triggered by keydown-handler and
    // context menu:
    var refNode, moveMode,
      tree = $(this).fancytree("getTree"),
      node = tree.getActiveNode(),
      selectedClass = null,
      selectedProperty = null;

    switch( data.cmd ) {
    case "moveUp":
      node.moveTo(node.getPrevSibling(), "before");
      //node.setActive();
      break;
    case "moveDown":
      node.moveTo(node.getNextSibling(), "after");
      //node.setActive();
      break;
    case "indent":
      refNode = node.getPrevSibling();
      node.moveTo(refNode, "child");
      refNode.setExpanded();
      //node.setActive();
      break;
    case "outdent":
      node.moveTo(node.getParent(), "after");
      //node.setActive();
      break;
    case "remove":
      if(model.removeClass(node.data.object)){
        if(node.getPrevSibling() != null){
          node.getPrevSibling().editStart();
        }
        node.remove();    
      }else{
        if(node.data.object.parent.removeProperty(node.data.object)){
          if(node.getPrevSibling() != null){
            node.getPrevSibling().editStart();
          }          
          node.remove();
        }
      }
      break;
    case "addChild":
      if(node){
        if (node.isChildOf(tree.getRootNode())){
          var obj = new Property("","");
          node.data.object.addProperty(obj);
          node.editCreateNode("child", {title:"", data:{object:obj}, folder:false});
        }
      }
      break;
    case "addSibling":
      var obj = new DataClass("");
      if(node){
        if (node.isChildOf(tree.getRootNode())){
          model.addClass(obj);
          node.editCreateNode("after", {title:"", data:{object:obj}, folder:true});
        }
        else{
          var obj = new Property("","");
          node.data.object.parent.addProperty(obj);
          node.editCreateNode("after", {title:"", data:{object:obj}, folder:false});
        }
      }
      break;
    default:
      alert("Unhandled command: " + data.cmd);
      return;
    }
  }).on("keydown", function(e){
    var c = String.fromCharCode(e.which),
      cmd = null;
    if( c === "M" && e.ctrlKey) {
      cmd = "addChild";
    } else if( c === "N" && e.ctrlKey) {
      cmd = "addSibling";
    } else if( e.which === $.ui.keyCode.BACKSPACE && e.ctrlKey) {
      cmd = "remove";
    } else if( e.which === $.ui.keyCode.UP && e.ctrlKey ) {
      cmd = "moveUp";
    } else if( e.which === $.ui.keyCode.DOWN && e.ctrlKey ) {
      cmd = "moveDown";
    } else if( e.which === $.ui.keyCode.RIGHT && e.ctrlKey ) {
      cmd = "indent";
    } else if( e.which === $.ui.keyCode.LEFT && e.ctrlKey ) {
      cmd = "outdent";
    }
    if( cmd ){
      $(this).trigger("nodeCommand", {cmd: cmd});
      return false;
    }
  });


  $("#tree").delegate("input[name=typeBox]", "change", function(e){
    console.log("type field is edited")

    var node = $.ui.fancytree.getNode(e);
    if(e.target.value != "" && node.title != "" && e.target.value != node.data.object.type.toString){
      e.stopPropagation();  // prevent fancytree activate for this row
      node.data.object.setType(e.target.value);
      $("#tree").trigger("nodeCommand", {cmd: "addSibling"});
    }
  });
});

function modelToTreeView (root, dataModel) {
  console.log("modelToTreeView")

  root.removeChildren();
  var childList = [];
  var grandChildList = [];
  for (var i = 0 ; i<dataModel.classArray.length ; i++){
    childList.push({
      title: dataModel.classArray[i].name,
      data : {object:dataModel.classArray[i]},
      folder: true
    });
    grandChildList[i]=[];
    for (var j = 0 ; j<dataModel.classArray[i].propertyArray.length ; j++){
      grandChildList[i].push({
        title : dataModel.classArray[i].propertyArray[j].name,
        data : {object:dataModel.classArray[i].propertyArray[j]},
        folder : false
      });
    }
  }
  root.addChildren(childList);
  for (var i = 0 ; i<childList.length ; i++){
    root.children[i].addChildren(grandChildList[i]);
  }
}

// function replaceTypeName(oldStr, newStr){
//   var root = $("#tree").fancytree("getRootNode");
//   var classArray= root.children
//   for (var i = 0; i < classArray.length; i++){
//     for (var j = 0; j<classArray[i].children.length; j++){
//       var obj = classArray[i].children[j].data.object;
//       var input = document.getElementById("typeBox_"+obj.parent.name+"_"+obj.name);
//       if(input){
//         var typeStr = input.value;
//         var newType = typeStr.replace(oldStr, newStr);
//         obj.setType(newType);
//       }
//     }
//   }
//   //modelToTreeView(root,model)
// }