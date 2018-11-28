function storageService(http, q) {
	var getStorage = function(conditions) {
		var deferred = q.defer();
		var params = {
			"goodsName": conditions.goodsName,
			"spec": conditions.spec,
			"mo": conditions.mo,
			"discount": conditions.discount,
			"state": conditions.state,
			"appendState": conditions.appendState,
			"AppId": conditions.appId,
			"sourceProvince": conditions.sourceProvince,
			"bizType": conditions.bizType,
			"pageIndex": conditions.pageIndex,
			"pageSize": conditions.pageSize,
		};
		var url = "/op/shelf/queryShelf?appId=" + params.AppId + "&appendState=" + params.appendState + "&goodsName=" + params.goodsName + "&discount=" + params.discount+ "&mo=" + params.mo + "&spec=" + params.spec + "&state=" + params.state + "&sourceProvince=" + params.sourceProvince +
			"&pageIndex=" + params.pageIndex + "&pageSize=" + params.pageSize + "&bizType=" + params.bizType;
		var request = {
			url: url,
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
	var checkgoodsName = function() {
		$('#goods_name').empty();
		var goods_name = $('#storage_goodsname').val();
		if (!goods_name) {
			$('#goods_name').append("请选择商品名称");
			$('#goods_name').show();
			return false;
		}
		return true;
	}
	var checktimeoutMinute = function() {
		$('#timeout').empty();
		var timeout = $('#storage_timeout').val();
		var reg = /^([1-9]\d*)$/;
		if (!timeout || timeout < 1 || timeout > 9999 || isNaN(timeout) || !reg.test(timeout)) {
			$('#timeout').append("必须是1-9999的整数");
			$('#timeout').show();
			return false;
		}
		return true;
	}
	var checkstate = function() {
		$('#good_state').empty();
		var state = $('#storage_state').val();
		if (!state) {
			$('#good_state').append("请选择状态");
			$('#good_state').show();
			return false;
		}
		return true;
	}
	var checkdiscount = function() {
		$('#good_discount').empty();
		var discount = $('#storage_discount').val();
		var reg = /^([1-9]\d*)$/;
		if (discount < 1 || discount > 10000 || isNaN(discount) || !reg.test(discount)) {
			$('#good_discount').append("必须是1-10000的整数");
			$('#good_discount').show();
			return false;
		}
		return true;
	}
	var commit = function(conditions) {
		var deferred = q.defer();

		var data = {
			"goodsId": conditions.goodsId,
			"appId": conditions.appId,
			"state": conditions.state,
			"timeoutMinute": conditions.timeoutMinute,
			"priorityStrategy": conditions.priorityStrategy,
			"discount": conditions.discount,
			"priority": conditions.priority,
			"initWaitTime": conditions.initWaitTime,
		}
		var url = "/op/shelf/addShelf?goodsId=" + data.goodsId + "&appId=" + data.appId + "&state=" + data.state + "&timeoutMinute=" + data.timeoutMinute + "&priorityStrategy=" + data.priorityStrategy + "&discount=" + data.discount + "&priority=" + data.priority + "&initWaitTime=" + data.initWaitTime;
		var request = {
			"url": url,
			"data": data
		}
		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	}
	var editshelf = function(conditions) {
		var deferred = q.defer();

		var data = {
			"id": conditions.id,
			"appId": conditions.appId,
			"state": conditions.state,
			"timeoutMinute": conditions.timeoutMinute,
			"priorityStrategy": conditions.priorityStrategy,
			"discount": conditions.discount,
			"priority": conditions.priority,
			"initWaitTime": conditions.initWaitTime,
		}
		var url = "/op/shelf/editShelf?id=" + data.id + "&appId=" + data.appId + "&state=" + data.state + "&timeoutMinute=" + data.timeoutMinute + "&priorityStrategy=" + data.priorityStrategy + "&discount=" + data.discount + "&priority=" + data.priority + "&initWaitTime=" + data.initWaitTime;
		var request = {
			"url": url,
			"data": data
		}
		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	}
	var delete_storage = function(condition) {
		var deferred = q.defer();
		var params = {
			"id": condition.id
		}
		var url = "/op/shelf/delShelf?id=" + params.id;
		var request = {
			"url": url,
			"params ": params
		}
		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	}

	return {
		"getStorage": getStorage,
		"getAgents": getAgents,
		"checkgoodsName": checkgoodsName,
		"checktimeoutMinute": checktimeoutMinute,
		"checkstate": checkstate,
		"checkdiscount": checkdiscount,
		"commit": commit,
		"editshelf": editshelf,
		"delete_storage": delete_storage
	}
}
linker.factory('storageService', ['$http', '$q', storageService]);