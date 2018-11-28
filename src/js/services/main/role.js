function roleService(http,q){
	
	var getAgents = function(){
		var deferred = q.defer();
		var url = "/op/agent/getAgents";
		var request = {
			"url":url
		}
		 http(request).success(function(response){
			deferred.resolve(response);
		}).error(function(error){
			deferred.reject(error);
		});
		return deferred.promise ;
	}
	
	

	
	var commit = function(conditions){
		var deferred = q.defer();
		
		var data = {
			"goodsId": conditions.goodsId,
			"appId": conditions.appId,
			"state": conditions.state,
			"timeoutMinute":conditions.timeoutMinute,
			"priorityStrategy":conditions.priorityStrategy,
			"discount":conditions.discount,
			"priority":conditions.priority,
			"initWaitTime":conditions.initWaitTime,
		}
		var url = "/op/shelf/addShelf?goodsId="+data.goodsId+"&appId="+data.appId+"&state="+data.state+"&timeoutMinute="+data.timeoutMinute+"&priorityStrategy="+data.priorityStrategy+"&discount="+data.discount+"&priority="+data.priority+"&initWaitTime="+data.initWaitTime;
		var request = {
			"url": url,
			"data": data
		}
		http(request).success(function(data){
			deferred.resolve(data);
		}).error(function(error){
			deferred.reject(error.responseText);
		});
		return deferred.promise;		
	}
	var editshelf = function(conditions){
		var deferred = q.defer();
		
		var data = {
			"id": conditions.id,
			"appId": conditions.appId,
			"state": conditions.state,
			"timeoutMinute":conditions.timeoutMinute,
			"priorityStrategy":conditions.priorityStrategy,
			"discount":conditions.discount,
			"priority":conditions.priority,
			"initWaitTime":conditions.initWaitTime,
		}
		var url = "/op/shelf/editShelf?id="+data.id+"&appId="+data.appId+"&state="+data.state+"&timeoutMinute="+data.timeoutMinute+"&priorityStrategy="+data.priorityStrategy+"&discount="+data.discount+"&priority="+data.priority+"&initWaitTime="+data.initWaitTime;
		var request = {
			"url": url,
			"data": data
		}
		http(request).success(function(data){
			deferred.resolve(data);
		}).error(function(error){
			deferred.reject(error.responseText);
		});
		return deferred.promise;		
	}
	var delete_storage = function(condition){
		var deferred = q.defer();		
		var params  = {
			"id":condition.id
		}
		var url = "/op/shelf/delShelf?id="+params.id;
		var request = {
			"url": url,
			"params ": params 
		}
		http(request).success(function(data){
			deferred.resolve(data);
		}).error(function(error){
			deferred.reject(error.responseText);
		});
		return deferred.promise;	
	}
	
	return{
		"getStorage":getStorage,
		"getAgents":getAgents,
		"checkgoodsName":checkgoodsName,
		"checktimeoutMinute":checktimeoutMinute,
		"checkstate":checkstate,
		"checkdiscount":checkdiscount,
		"commit":commit,
		"editshelf":editshelf,
		"delete_storage":delete_storage
	}	
}
linker.factory('roleService',['$http','$q',roleService]);