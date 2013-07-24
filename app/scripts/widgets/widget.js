var Widget = angular.module('rendering', []);

Widget.directive('render', function($compile,Database) {
  
  var getTemplate = function(scope,name,element,ngModel) {
    var tpl;
    var type = Database.findType(scope.doc['@class'],scope.doc[name],name);
    
    
    
    switch(type){          
          case "STRING":
           tpl = getStringTemplate(element,name);
          break;
          case "INTEGER":
          tpl = getNumberTemplate(element,name);
          break;
           case "DATE":
           var format = Database.getDateFormat();
          tpl = getDateTemplate(element,format,name);           
           break;
          case "DATETIME":
          var format = Database.getDateTimeFormat();
           tpl = getDateTimeTemplate(element,format,name);
            
          break;
        }

      
        var select = "<select class='span2' ng-disabled='true'><option value='" +type+"''>" + type+ "</option></select>";
        var del = "<a href='javascript:void(0)'' class='btn btn-mini pull-right' tooltip='Delete field' ng-click='deleteField(\"" + name + "\")' ><i class='icon-trash'></i></a>";
        return '<ng-form name="formID">{{formID.$valid}}' + tpl +  select + del + '</ng-form>';
  }

  var linker = function(scope, element, attrs,ngModel) {

      attrs.$observe('render-field',function(){
        var name = element.attr('render-field') ? element.attr('render-field') : "text";
        var el = angular.element($compile(getTemplate(scope,name,element,ngModel))(scope));
        element.append(el);
      });
      
  }

  var getStringTemplate = function(element,name){
    return "<textarea class='input-xlarge span6' ng-model='" + element.attr('ng-model') + "' ></textarea>";
  };
  var getNumberTemplate = function(element,name){
    return "<input type='number' name='" +name+ "' class='input-xlarge span6' ng-model='" + element.attr('ng-model') + "' />";
  };
  var getDateTemplate = function (element,format,name){
    return "<input type='text' class='input-xlarge span6' ng-model='" + element.attr('ng-model') + "' data-date-type='string' data-date-format='" + format+ "' bs-datepicker>";
  };
  var getDateTimeTemplate = function(element,format,name){
    return "<input type='text' class='input-xlarge span6' ng-model='" + element.attr('ng-model') + "' data-date-type='string' data-date-format='"+format+"' bs-datepicker>";
  };
  return {
    // A = attribute, E = Element, C = Class and M = HTML Comment
    require: 'ngModel',
    restrict:'A',
    //The link function is responsible for registering DOM listeners as well as updating the DOM.
    link: linker
  }
});

Widget.directive('docform', function($compile,Database) {
  
  var getTemplate = function(scope,name,element) {
    var tpl;
    var type = Database.findType(scope.doc['@class'],scope.doc[name],name);
    switch(type){          
          case "STRING":
           tpl = getStringTemplate(name);
          break;
          case "INTEGER":
          tpl = getNumberTemplate(name);
          break;
           case "DATE":
           var format = Database.getDateFormat();
          tpl = getDateTemplate(format,name);           
           break;
          case "DATETIME":
          var format = Database.getDateTimeFormat();
           tpl = getDateTimeTemplate(format,name);
            
          break;
        }

      
        var select = "<select class='span2' ng-disabled='true'><option value='" +type+"''>" + type+ "</option></select>";
        var del = "<a href='javascript:void(0)'' class='btn btn-mini pull-right' tooltip='Delete field' ng-click='deleteField(\"" + name + "\")' ><i class='icon-trash'></i></a>";
        return  tpl +  select + del ;
  }

  var linker = function(scope, element, attrs) {
          
      var docHtml = '<ng-form name="formID">{{formID.$valid}}'
      angular.forEach(scope.headers,function(el){
        docHtml = docHtml +'<div class="control-group" ><label class="control-label">'+ el +' </label> <div class="controls controls-row" >' + getTemplate(scope,el,element) + '</div></div>'
      });
      docHtml = docHtml + '</ng-form>';
      var el = angular.element($compile(docHtml)(scope));
      element.append(el);
      scope.$watch('formID.$valid', function(validity) {
        scope.docValid = validity;
      });
      
  }

  var getStringTemplate = function(name){
    var tpl = "<textarea class='input-xlarge span6' ng-model='doc[\""+ name + "\"]' ></textarea>";
    return tpl;
  };
  var getNumberTemplate = function(name){
    var tpl = "<input type='number' name='" +name+ "' class='input-xlarge span6' ng-model='doc[\""+ name +"\"]' />";
    return tpl;
  };
  var getDateTemplate = function (format,name){
    return "<input type='text' class='input-xlarge span6' ng-model='doc[\""+ name +"\"]' data-date-type='string' data-date-format='" + format+ "' bs-datepicker>";
  };
  var getDateTimeTemplate = function(format,name){
    return "<input type='text' class='input-xlarge span6' ng-model='doc[\""+ name +"\"]' data-date-type='string' data-date-format='"+format+"' bs-datepicker>";
  };
  return {
    // A = attribute, E = Element, C = Class and M = HTML Comment
    restrict:'A',
    //The link function is responsible for registering DOM listeners as well as updating the DOM.
    link: linker
  }
});