define(['IUI-core','Template'],function(IUI){

	var validator= function(){
		return {valid:true};
	}
	var ObservableModel=IUI.Class.extend({
		classType: 'ObservableModel',
		initialize: function(model,handler,list,options){
			this._uid=IUI.getUID();
			//IUI.Class.prototype.initialize.call(this,options);
			options=((options) || ({}));
			if(typeof handler === "object"){
				list=handler;
				delete handler;
			}	
			
			var _data={},
				_handleChange=this._handleChange.bind(this);
			if((options.shouldValidate===false || !options.validator)){
				validator = validator;
			}
			this._data=_data;
			this.handler=handler;
			
			
			this.model=model || {};
			for(var key in model){
				if(list && (list.indexOf(key)===-1)){
					continue;
				}
				
				Object.defineProperty(this._data,key,{
					value: this.model[key],
					writable: true
    			});
				
				Object.defineProperty(this.model,key,{	
					set: (function(key){
						return function(value){
							var valid=validator(value);
							if(_data[key]!==value && valid.valid){
								_data[key]=value;
								_handleChange(key,value);
							}
						}
					})(key),
					get: (function(key){
						return function(){
							return _data[key];
						}
					})(key)
				});
			}
		},
		
		_handleChange: function(key,value,sender){
			(this.handler) && (this.handler(key,value,sender));
		}
	});
	
	
	ObservableModel.bindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.bindConainerModel(containerModel,mappingArray);
		containerModel.bindOptionModel(optionsModel,mappingArray);
	}
	
	
	IUI.ObservableModel=ObservableModel;
	


});