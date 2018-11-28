linker.controller('MifiUserInfoController', ['$scope', '$window', '$state', '$location', 'mifiUserInfoService', 'responseService', 'webService',
	function($scope, $window, $state, $location, mifiUserInfoService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		$scope.timeStamp = new Date().getTime();
		
		$scope.mifiNo = _.isUndefined($state.params.bymifiNo) ? "" : $state.params.bymifiNo;
		$scope.mifiPhoneNo = _.isUndefined($state.params.bymifiPhoneNo) ? "" : $state.params.bymifiPhoneNo;
		$scope.groupName = _.isUndefined($state.params.bygroupName) ? "" : $state.params.bygroupName;
		$scope.fromDate = _.isUndefined($state.params.bystartTime) ? "" : $state.params.bystartTime;
		$scope.toDate = _.isUndefined($state.params.byendTime) ? "" : $state.params.byendTime;

		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('page', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
				$scope.$watch('num', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
//				获取用户来源配置
				webService.get_data("/mifi/admin/v2/usergroup/query?pageCount=100&pageNo=1").then(function(data) {
						$scope.list = data.pagedListDTO.records;
					},
					function(error) {
						responseService.errorResponse("读取用户来源失败");
					});
				$scope.getPagesAndRecords();
			}
		};

		$scope.initDateComponent = function(param) {
			laydate({
				elem: '#' + param,
				isclear: true,
				istoday: false,
				choose: function(date) {
					$scope[param] = date;
				}
			});
		};
		var checkDate = function() {
			var d1 = new Date($scope.fromDate.replace(/\-/g, "\/"));
			var d2 = new Date($scope.toDate.replace(/\-/g, "\/"));
			if ($scope.fromDate != "" && $scope.toDate != "" && d1 > d2) {
				layer.alert('结束时间不能小于开始时间', {
					icon: 0 //failure icon; icon 1: success icon; icon 0: alert icon;
				});
				document.getElementById("fromDate").value = "";
				document.getElementById("toDate").value = "";
				return true;
			} else {
				return true;
			}
		};
		
		var checkMifiNo = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.mifiNo)&&($scope.mifiNo!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.mifiNo = "";
				return false;
			} else {
				return true;
			}
		}
		var checkMifiPhoneNo = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.mifiPhoneNo)&&($scope.mifiPhoneNo!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.mifiPhoneNo = "";
				return false;
			} else {
				return true;
			}
		}
		
		$scope.getPagesAndRecords = function() {
			if (checkDate() && checkMifiPhoneNo() && checkMifiNo()) {
				mifiUserInfoService.getDatas({
					mifiNo: $scope.mifiNo,
					mifiPhoneNo: $scope.mifiPhoneNo,
					groupName: $scope.groupName,
					startTime: $scope.fromDate,
					endTime: $scope.toDate,
					page: $scope.page,
					num: $scope.num,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (response.code == 200) {
						$scope.dates = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}else{
						responseService.errorResponse(response.desc);
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取流量用户信息失败");
				});
			}

		};
		$scope.filterData = function() {
			if (checkDate() && checkMifiPhoneNo() && checkMifiNo()) {
				$scope.timeStamp = new Date().getTime();
				$location.path("/admin/mifiuser/" + $scope.mifiNo + "/" + $scope.mifiPhoneNo + "/" + $scope.groupName + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.timeStamp);
			}
		};

		$scope.exportDatas = function() {
			if (checkDate() && checkMifiPhoneNo() && checkMifiNo()) {
				$scope.filterData();
				$window.location = "/mifi/admin/v2/endusersession/export?mifiNo=" + $scope.mifiNo + "&mifiPhoneNo=" + $scope.mifiPhoneNo + "&groupName=" + $scope.groupName +
				"&startTime=" + document.getElementById("fromDate").value + "&endTime=" + document.getElementById("toDate").value;
			}
		};
		initial();
	}
]);