linker.directive('batchedit', function(check, webService, $compile, $filter, responseService,mifiUserInfoService) {
	return {
		templateUrl: './templates/directives/editbatchmifires.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset: '&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function(){
				$scope.alert = new Object();
  //获取套餐
				webService.get_data("/mifi/admin/v2/cardtype/queryall").then(function(data) {
					$scope.cardTypes = data.data;
				},
				function(error) {
					responseService.errorResponse("读取套餐类型失败");
				});
//			$scope.checkCardType = function() {
//				$('#reason2').empty();
//				var responseCode = $('#check_cardtype').val();
//				if(!responseCode){
//					$('#reason2').append("请选择套餐类型");
//					$('#reason2').show();
//					return false;
//				}
//			}
			
			var _checkCardType = function() {
				$('#reason2').empty();
				var responseCode = $('#check_cardtype').val();
				if(!responseCode){
//					$('#reason2').append("请选择套餐类型");
//					$('#reason2').show();
					return false;
				}
				return true;
			}
			
//			
//			$scope.checkStatus = function() {
//				$('#reason1').empty();
//				var responseCode = $('#check_status').val();
//				if(!responseCode){
//					$('#reason1').append("请选择状态");
//					$('#reason1').show();
//					return false;
//				}
//			}
//			
			var _checkStatus = function() {
				$('#reason1').empty();
				var responseCode = $('#check_status').val();
				if(!responseCode){
//					$('#reason1').append("请选择状态");
//					$('#reason1').show();
					return false;
				}
				return true;
			}
			
			$scope.commit = function() {
				if(_checkStatus() || _checkCardType()){
					var ids = "";
					for (var i in $scope.control.data) {
						ids += "," + $scope.control.data[i].cardId;
					}
					ids = ids.substr(1);
					var data = {
						"ids":ids,
						"cardType": $scope.alert.cardType,
						"activeState": $scope.alert.activeState,
					};
					mifiUserInfoService.editbatchmifires(data).then(function(response) {
						if (response.code == 200) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						} else {
							$scope.close();
							$scope.refresh();
							layer.alert('操作失败', {
								icon: 2
							});
						}

					}, function(errorResponse) {
						$scope.close();
						$scope.refresh();
						layer.alert('操作失败', {
							icon: 2
						});
					});
				} else{
					layer.alert('不修改请取消', {
						icon: 0
					});
				}

			}
			$scope.close = function() {
				$scope.control = false;
				$scope.reset();
			}
			}
		}
	}
})
