ModelExporter
=============

Easily create model objects for different languages with your structure.

Current export options: Obj-C, Swift 
Current import options: Manual

How To Use It
-------------
It's just a couple of HTML, CSS and JS files. So, either download source files and open in your browser locally, or simply [use this link](http://rawgit.com/Valensas/ModelExporter/master/source/ModelExporter.html) remotely.


Current version of Model Exporter supports two programming languages : Swift & Objective-C

Construct & Edit  your class hierarchy using following hotkeys:

	Control + N  			    -> add sibling node (either a sibling class or a sibling property)
	Control + M  			    -> add child node (add a property node to the selected class node)
	Control + Backspace 	-> remove selected node and its child nodes from your class hierarchy
	Control + Arrow keys 	-> change selected node using arrow keys
	Double Click 			    -> edit names of the classes and properties


How to write types of the properties:

	-Supported types:
		Bool, Int, Double, Float, String
	-Array notation:
		[someType]
	-Dictionary notation:
		[someKeyType:someValueType]
	-Object notation:
		Any other string is considered as object, carefully type your type names.

Model Exporter uses the type notations declared above for both Swift and Objective-C.

Therefore, following conversions should be made for Objective-C types:

	-bool   		  - Bool
	-int 			    -	Int
	-double 		  -	Double
	-float 			  -	Float
	-NSString		  -	String
	-NSArray		  -	[typeOfElements]
	-NSDictionary -	[typeOfKeys:typeOfValues]
