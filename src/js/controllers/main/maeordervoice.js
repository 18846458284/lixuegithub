linker.controller('MaeOrderVoiceController', ['$scope', '$window', '$state', '$location', 'maeOrdersService', 'responseService', 'webService',
	function($scope, $window, $state, $location, maeOrdersService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		/*		$scope.orderBy = "createdTime";
				$scope.orderByValue = "-1";*/
		$scope.timeStamp = new Date().getTime();
		$scope.mo = _.isUndefined($state.params.byMO) ? "" : $state.params.byMO;
		$scope.phoneNo = _.isUndefined($state.params.byphoneNo) ? "" : $state.params.byphoneNo;
		$scope.fromDate = _.isUndefined($state.params.byFromDate) ? "" : $state.params.byFromDate;
		$scope.toDate = _.isUndefined($state.params.byToDate) ? "" : $state.params.byToDate;
		$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;

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
		var checkPhone = function() {
			var phone = $scope.phoneNo;
			if (phone != "" && isNaN(phone)) {
				layer.alert('输入正确手机号', {
					icon: 0
				});
				$scope.phoneNo = "";
				return false;
			} else if (phone != "" && phone.length > 16) {
				layer.alert('输入1-16位手机号', {
					icon: 0
				});
				$scope.phoneNo = "";
				return false;
			} else
				return true;
		}
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
		$scope.getPagesAndRecords = function() {

			if (checkDate() && checkPhone()) {
				maeOrdersService.getMaeVoiceOrders({
					mo: $scope.mo,
					fromDate: $scope.fromDate,
					toDate: $scope.toDate,
					page: $scope.page,
					num: $scope.num,
					phoneNo: $scope.phoneNo,
					spec: $scope.spec,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.maeorders = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取订单信息失败");
				});
			}

		};
		$scope.filterOrder = function() {
			if (checkDate() && checkPhone()) {
				var filterNum = /^[1-9]\d*$/;
				var filterUnit = /^[1-9][0-9]*[元]{1}$/;
				if (filterUnit.test($scope.spec) || filterNum.test($scope.spec) || !$scope.spec) {
					$scope.timeStamp = new Date().getTime();
					$location.path("/admin/maeordervoice/" + $scope.mo + "/" + $scope.phoneNo + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.spec + "/" + $scope.timeStamp);
				} else {
					$scope.spec = "";
					layer.alert('请输入正确面额,默认单位:元', {
						icon: 0
					});
				}
			}
		};


		function strtotime2(time) {
			var date = new Date(time);
			var year = date.getYear() + 1900;
			var month = date.getMonth() + 1;
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var date = date.getDate();

			if (month < 10) {
				month = '0' + month;
			}
			if (date < 10) {
				date = '0' + date;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
		}

		$scope.strtime2 = function(str) {
			var timenum = parseInt(str);
			if (timenum > 0) {
				var strt = strtotime2(timenum);
			} else {
				strt = "";
			}
			return strt;
		}

		$scope.service = function(data, operation) {
			$scope.edit_service = true;
			$scope.passed_data = data;
			$scope.name = operation;
		};
		initial();

	}
]);