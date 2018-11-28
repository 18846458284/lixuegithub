linker.controller('MaeOrderForCompareController', ['$scope', '$window', '$state', '$location', 'maeForCompareService', 'responseService', 'webService',
	function($scope, $window, $state, $location, maeForCompareService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

/*		$scope.orderBy = "createdTime";
		$scope.orderByValue = "-1";*/
		$scope.timeStamp=new Date().getTime();
		$scope.channelId = _.isUndefined($state.params.byChannelId) ? "" : $state.params.byChannelId;
		$scope.state = _.isUndefined($state.params.byState) ? "" : $state.params.byState;
		$scope.fromDate = _.isUndefined($state.params.byFromDate) ? "" : $state.params.byFromDate;
		$scope.toDate = _.isUndefined($state.params.byToDate) ? "" : $state.params.byToDate;

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
		var check = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.channelId)&&($scope.channelId!="")) {
					layer.alert('请输入汉字,数字或者字母', {
						icon: 0
					});
					$scope.channelId="";
					return false;
				} else {
					return true;
				}
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
		$scope.getPagesAndRecords = function() {
			if (checkDate() && check()) {
				maeForCompareService.getMaeForCompare({
					channelId: $scope.channelId,
					startDate: $scope.fromDate,
					endDate: $scope.toDate,
					page: $scope.page,
					num: $scope.num,
					state:$scope.state,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.maeforcompare = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if($scope.totalPage<$scope.page && $scope.page > 1){
							$scope.page=$scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取对账信息失败");
				});
			}

		};
	
		
	
		$scope.filterOrder = function() {
			if (checkDate() && check()) {
				$scope.timeStamp=new Date().getTime();
				$location.path("/admin/maeforcompare/" + $scope.channelId +"/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.state +"/"+$scope.timeStamp);
				}
		};
		function strtotime2(time){
	 		var date = new Date(time);
	 		var year = date.getYear() + 1900;
	 		var month = date.getMonth()+1;
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var date = date.getDate();
			
			if(month<10){
				month = '0'+ month;
			} 
			if(date<10){
				date = '0'+ date;
			}
			if(hours <10){
				hours = '0'+ hours;
			}
			if(minutes <10){
				minutes = '0'+ minutes;
			}
			if(seconds <10){
				seconds = '0'+ seconds;
			}
			return year + '-' + month + '-' + date + ' ' + hours +':'+ minutes + ':' + seconds;
	 	}
		
		$scope.strtime2 = function(str){
			var timenum = parseInt(str);
			if(timenum>0){
				var strt = strtotime2(timenum);
			}else{
				strt = "";
			} 
			return strt; 
		}
		
		initial();

	}
]);