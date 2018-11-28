function orderResource($http, $q) {
	var getQueueInfo = function(conditions) {
		var url = "/op/queue/getMoProvinceWait";
		var params = {
			"mo": conditions.mo,
			"province": conditions.province,
			"page": conditions.page,
			"num": conditions.num,
			"bizType": conditions.bizType
		};
		var request = {
			url: url,
			params: params
		};

		var deferred = $q.defer();
		$http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	var editqueue = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"id": conditions.id,
			"province": conditions.province,
			"mo": conditions.mo,
			"queueSize": conditions.queueSize
		}
		var url = "/op/queue/setQueueSize?id=" + params.id +
									"&province=" + params.province +
									"&mo=" + params.mo +
									"&queueSize=" + params.queueSize;
		var request = {
			"url": url,
		}
		$http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	var waitToFail = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"id": conditions.id
		}
		var url = "/op/queue/setWaitToFail?id=" + params.id;
		var request = {
			"url": url,
		}
		$http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	
	
	return {
		"getQueueInfo": getQueueInfo,
		"editqueue": editqueue,
		"waitToFail":waitToFail
	}
}
linker.factory('flowQueueService', ['$http', '$q', orderResource]);