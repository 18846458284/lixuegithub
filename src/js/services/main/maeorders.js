function orderResource($http, $q) {
	var getMaeOrders = function(conditions) {
		var url = "/op/maeFlow/mae_flow";
		var params = {
			"mo": conditions.mo,
			"fromDate": conditions.fromDate,
			"toDate": conditions.toDate,
			"page": conditions.page,
			"num": conditions.num,
			"phoneNo": conditions.phoneNo,
			"spec": conditions.spec,
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
	
	var getMaeVoiceOrders = function(conditions) {
		var url = "/op/maeVoice/mae_voice";
		var params = {
			"mo": conditions.mo,
			"fromDate": conditions.fromDate,
			"toDate": conditions.toDate,
			"page": conditions.page,
			"num": conditions.num,
			"phoneNo": conditions.phoneNo,
			"spec": conditions.spec,
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
	var editOrderNo = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"activeId": conditions.activeId,
			"moOrderNo": conditions.moOrderNo,
			"phoneNo": conditions.userId,
			"orderCreateTime": conditions.activeTime,
			"activeCode": conditions.activeCode
		}
		var url = "/op/maeFlow/edit_mae_orderno?activeId=" + params.activeId +
									"&moOrderNo=" + params.moOrderNo +
									"&phoneNo=" + params.phoneNo +
									"&orderCreateTime=" + params.orderCreateTime +
									"&activeCode=" + params.activeCode;
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
	var editOrderState = function(conditions) {
		var deferred = $q.defer();
		var params = {
				"activeId": conditions.activeId,
				"state": conditions.state,
				"moResponseCode": conditions.moResponseCode,
				"moOrderNo": conditions.moOrderNo,
				"phoneNo": conditions.userId,
				"orderCreateTime": conditions.activeTime,
				"activeCode": conditions.activeCode
		}
		var url = "/op/maeFlow/edit_mae_orderstate?activeId=" + params.activeId+
										"&state=" + params.state+ 
										"&moResponseCode=" +params.moResponseCode +
										"&moOrderNo=" +params.moOrderNo +
										"&phoneNo=" +params.phoneNo +
										"&orderCreateTime=" +params.orderCreateTime +
										"&activeCode=" + params.activeCode;
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
	
	var editVoiceOrderNo = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"activeId": conditions.activeId,
			"moOrderNo": conditions.moOrderNo,
			"phoneNo": conditions.userId,
			"orderCreateTime": conditions.activeTime,
			"activeCode": conditions.activeCode
		}
		var url = "/op/maeVoice/edit_mae_voice_orderno?activeId=" + params.activeId+ 
											"&moOrderNo=" + params.moOrderNo+
											"&phoneNo=" + params.phoneNo+
											"&orderCreateTime=" + params.orderCreateTime+
											"&activeCode=" + params.activeCode;
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
	var editVoiceOrderState = function(conditions) {
		var deferred = $q.defer();
		var params = {
				"activeId": conditions.activeId,
				"state": conditions.state,
				"moResponseCode": conditions.moResponseCode,
				"moOrderNo": conditions.moOrderNo,
				"phoneNo": conditions.userId,
				"orderCreateTime": conditions.activeTime,
				"activeCode": conditions.activeCode
		}
		var url = "/op/maeVoice/edit_mae_voice_orderstate?activeId=" + params.activeId+ 
											   "&state=" + params.state+
											   "&moResponseCode=" +params.moResponseCode+
											   "&moOrderNo=" +params.moOrderNo+
											   "&phoneNo=" +params.phoneNo+
											   "&orderCreateTime=" +params.orderCreateTime+
											   "&activeCode=" + params.activeCode;
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
		"getMaeOrders": getMaeOrders,
		"editOrderNo": editOrderNo,
		"editOrderState": editOrderState,
		"getMaeVoiceOrders":getMaeVoiceOrders,
		"editVoiceOrderState":editVoiceOrderState,
		"editVoiceOrderNo":editVoiceOrderNo
	}
}
linker.factory('maeOrdersService', ['$http', '$q', orderResource]);