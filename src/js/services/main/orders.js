function orderResource($http, $q) {
	var getOrders = function(conditions) {
		var url = "/op/order/order";
		var params = {
			"appId": conditions.appId,
			"mo": conditions.mo,
			"province": conditions.province,
			"status": conditions.status,
			"fromDate": conditions.fromDate,
			"toDate": conditions.toDate,
			"customerOrderId": conditions.customerOrderId,
			"page": conditions.page,
			"num": conditions.num,
			"phoneNo": conditions.phoneNo,
			"orderBy": conditions.orderBy,
			"spec": conditions.spec,
			"resourceId": conditions.resourceId,
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
	var checkReason = function() {
		$('#reason').empty();
		var serviceReason = $('#service_reason').val();
		if (!serviceReason) {
			$('#reason').append("请选择失败原因");
			$('#reason').show();
			return false;
		}
		return true;
	}
	var checkOperation = function() {
		$('#operation').empty();
		var serviceOperation = $('#service_operation').val();
		if (!serviceOperation) {
			$('#operation').append("请选择操作");
			$('#operation').show();
			return false;
		}
		return true;
	}
	var customer = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"id": conditions.id,
			"operate": conditions.operate,
			"operateReason": conditions.operateReason,
			"operateComment": conditions.operateComment
		}
		var url = "/op/customer/customerService?id=" + params.id + "&operate=" + params.operate + "&operateReason=" + params.operateReason + "&operateComment=" + params.operateComment;
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
	var customerVoice = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"id": conditions.id,
			"operate": conditions.operate,
			"operateReason": conditions.operateReason,
			"operateComment": conditions.operateComment
		}
		var url = "/op/customer/customerVoiceService?id=" + params.id + "&operate=" + params.operate + "&operateReason=" + params.operateReason + "&operateComment=" + params.operateComment;
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
		"getOrders": getOrders,
		"customer": customer,
		"customerVoice": customerVoice,
		"checkReason": checkReason,
		"checkOperation": checkOperation
	}
}
linker.factory('ordersService', ['$http', '$q', orderResource]);