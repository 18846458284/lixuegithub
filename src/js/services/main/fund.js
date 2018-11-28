function fundService(http, q) {
	var getFunds = function(conditions) {
		var deferred = q.defer();
		var url = "/op/deposit/depositQuery";
		var params = {
			"appId": conditions.appId,
			"fromDate": conditions.fromDate,
			"toDate": conditions.toDate,
			"orderBy": conditions.orderBy,
			"page": conditions.page,
			"num": conditions.num,
			"timeStamp": conditions.timeStamp
		};
		var request = {
			url: url,
			params: params
		};

		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	}
	var getAgents = function() {
		var deferred = q.defer();
		var url = "/op/agent/getAgents";
		var request = {
			"url": url
		}
		http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	return {
		"getFunds": getFunds,
		"getAgents": getAgents,
	}
}
linker.factory('fundService', ['$http', '$q', fundService]);