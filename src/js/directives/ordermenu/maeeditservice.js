linker.directive('editservice', function(responseService, maeOrdersService) {
	return {
		templateUrl: './templates/directives/maeeditservice.html',
		scope: {
			type: "=",
			control: "=",
			refresh: '&refreshFn',
			original: "=",
		},

		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.alert = new Object();
				$scope.customer_Service = new Object();
				angular.copy($scope.original, $scope.customer_Service);
				$scope.zt = false;
				$scope.no = false;
				
			if($scope.type == "floworderno" || $scope.type == "voiceorderno"){
				$scope.no = true;
			}
			if($scope.type == "flowstatus" || $scope.type == "voicestatus"){
				$scope.zt = true;
			}
			
			$scope.checkStatus = function() {
				$('#reason1').empty();
				var responseCode = $('#check_status').val();
				if(!responseCode){
					$('#reason1').append("请选择修改的状态");
					$('#reason1').show();
					return false;
				}
			}
			
			var _checkStatus = function() {
				$('#reason1').empty();
				var responseCode = $('#check_status').val();
				if(!responseCode){
					$('#reason1').append("请选择修改的状态");
					$('#reason1').show();
					return false;
				}
				return true;
			}
			
			$scope.checkResponse = function() {
				var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				$('#reason2').empty();
				var responseCode = $('#edit_response').val();
				if(!responseCode){
					$('#reason2').append("请填写响应码");
					$('#reason2').show();
					return false;
				}
				if(!filter.test(responseCode)){
					$('#reason2').append("请输入汉字,数字,字母或下划线");
					$('#reason2').show();
					return false;
				}
				var l = responseCode.length;
				if (l > 64) {
					$scope.alert.responseCode = true;
					return false;
				} else {
					$scope.alert.responseCode = false;
					return true;
				}
			}
			
			var thischeckResponse = function() {
				var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				$('#reason2').empty();
				var responseCode = $('#edit_response').val();
				if(!responseCode){
					$('#reason2').append("请填写响应码");
					$('#reason2').show();
					return false;
				}
				if(!filter.test(responseCode)){
					$('#reason2').append("请输入汉字,数字,字母或下划线");
					$('#reason2').show();
					return false;
				}
				var l = responseCode.length;
				if (l > 64) {
					$scope.alert.responseCode = true;
					return false;
				} else {
					$scope.alert.responseCode = false;
					return true;
				}
			}
			
			$scope.checkOrderNo = function() {
				var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				$('#reason').empty();
				var orderNo = $('#edit_orderno').val();
				if(!orderNo){
					$('#reason').append("请填写渠道订单号");
					$('#reason').show();
					return false;
				}
				if(!filter.test(orderNo)){
					$('#reason').append("请输入汉字,数字,字母或下划线");
					$('#reason').show();
					return false;
				}
				var l = orderNo.length;
				if (l > 64) {
					$scope.alert.orderNo = true;
					return false;
				} else {
					$scope.alert.orderNo = false;
					return true;
				}
			}
			
			var _checkOrderNo = function() {
				var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				$('#reason').empty();
				var orderNo = $('#edit_orderno').val();
				if(!orderNo){
					$('#reason').append("请填写渠道订单号");
					$('#reason').show();
					return false;
				}
				if(!filter.test(orderNo)){
					$('#reason').append("请输入汉字,数字,字母或下划线");
					$('#reason').show();
					return false;
				}
				var l = orderNo.length;
				if (l > 64) {
					$scope.alert.orderNo = true;
					return false;
				} else {
					$scope.alert.orderNo = false;
					return true;
				}
			}
			$scope.commit = function() {
				if ($scope.type == "floworderno" && _checkOrderNo()) {
					var data = {
						"activeId": $scope.customer_Service.activeId,
						"moOrderNo": $scope.customer_Service.moOrderNo,
						"userId": $scope.customer_Service.userId,
						"activeTime": $scope.customer_Service.activeTime,
						"activeCode": $scope.customer_Service.activeCode,
					};
					maeOrdersService.editOrderNo(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.customer_Service.moOrderNo = "";
					});
				}
				if ($scope.type == "voiceorderno" && _checkOrderNo()) {
					var data = {
						"activeId": $scope.customer_Service.activeId,
						"moOrderNo": $scope.customer_Service.moOrderNo,
						"userId": $scope.customer_Service.userId,
						"activeTime": $scope.customer_Service.activeTime,
						"activeCode": $scope.customer_Service.activeCode,
					};
					maeOrdersService.editVoiceOrderNo(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.customer_Service.moOrderNo = "";
					});
				}
				
				if ($scope.type == "flowstatus" &&  thischeckResponse() && _checkStatus() ) {
					var data = {
						"activeId": $scope.customer_Service.activeId,
						"state": $scope.alert.state,
						"moResponseCode": $scope.customer_Service.moResponseCode,
						"moOrderNo": $scope.customer_Service.moOrderNo,
						"userId": $scope.customer_Service.userId,
						"activeTime": $scope.customer_Service.activeTime,
						"activeCode": $scope.customer_Service.activeCode,
					};
					maeOrdersService.editOrderState(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.customer_Service.state = "";
						$scope.customer_Service.moResponseCode = "";
					});
				}
				
				if ($scope.type == "voicestatus" &&  thischeckResponse() && _checkStatus() ) {
					var data = {
						"activeId": $scope.customer_Service.activeId,
						"state": $scope.alert.state,
						"moResponseCode": $scope.customer_Service.moResponseCode,
						"moOrderNo": $scope.customer_Service.moOrderNo,
						"userId": $scope.customer_Service.userId,
						"activeTime": $scope.customer_Service.activeTime,
						"activeCode": $scope.customer_Service.activeCode,
					};
					maeOrdersService.editVoiceOrderState(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.customer_Service.state = "";
						$scope.customer_Service.moResponseCode = "";
					});
				}
				
				
			}
			$scope.close = function() {
				$scope.control = false;
			}
		}
	  }
	}
})