function channelTradeResource($http, $q) {
	var getChannelTrade = function(conditions) {
		var url = "/op/report/queryChannelTrade";
		var params = {
			"mo": conditions.mo,
			"province": conditions.province,
			"startDate": conditions.fromDate,
			"endDate": conditions.toDate,
			"page": conditions.page,
			"num": conditions.num,
			"resourceId": conditions.resourceId,
			"bizType":conditions.bizType,
			"timeStamp": conditions.timeStamp,
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
	
	
	return {
		"getChannelTrade": getChannelTrade,
	}
}
linker.factory('channelTradeService', ['$http', '$q', channelTradeResource]);