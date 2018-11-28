linker.directive('batcheditstorage', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batcheditstorage.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset: '&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.data = new Object();
				$scope.alertInfo = new Object();
				$scope.alert = new Object();
				$scope.data.state="";
				$scope.data.discount="";
			}
			$scope.checkdiscount = function() {
				var reg = /^([1-9]\d*)$/;
				if ($scope.data.discount < 1 || $scope.data.discount > 10000 || !reg.test($scope.data.discount)) {
					if(!$scope.data.discount){
						$scope.alertInfo.discount = "";
						$scope.alert.discount = false;
						return;
					}
					$scope.alertInfo.discount = "必须是1-10000的整数";
					$scope.alert.discount = true;
				}else{
					$scope.alertInfo.discount = "";
					$scope.alert.discount = false;
				}
			}
			$scope.send = function() {
				$scope.checkdiscount();
				if($scope.alert.discount==true)return;
				var goodsShelfIds = "";
				for (var i in $scope.control.data) {
					goodsShelfIds += "," + $scope.control.data[i].id;
				}
				goodsShelfIds = goodsShelfIds.substr(1);
				webService.get_data("/op/shelf/editBranchShelf?goodsShelfIds=" + goodsShelfIds + "&discount=" + $scope.data.discount +"&state="+$scope.data.state).then(function(data) {
						if(data.data==true){
							layer.alert('修改成功', {
								icon: 1
							});
						}else{
							responseService.errorResponse("修改失败");
						}
						$scope.refresh();
						$scope.back();

					},
					function(error) {
						responseService.errorResponse("批量编辑货架失败");
					});
			};
			$scope.back = function() {
				$scope.control = false;
				$scope.reset();
			};
		},
	}
})