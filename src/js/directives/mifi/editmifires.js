linker.directive('editmifires', function(check,$filter, webService, responseService) {
	return {
		templateUrl: './templates/directives/editmifires.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			editcontroldata: '='
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function(){
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.mifiobj = new Object();
				$scope.check = new Object();
				angular.copy($scope.editcontroldata, $scope.mifiobj);
				
				
				//获取套餐
				webService.get_data("/mifi/admin/v2/cardtype/queryall").then(function(data) {
						$scope.cardTypes = data.data;
					},
					function(error) {
						responseService.errorResponse("读取套餐类型失败");
					});
				//获取省份
				webService.get_data("/mifi/admin/v2/province/query").then(function(data) {
						$scope.provinces = data.data;
					},
					function(error) {
						responseService.errorResponse("读取省份信息失败");
					});
				//获取来源
				webService.get_data("/mifi/admin/v2/usergroup/query?pageCount=100&pageNo=1").then(function(data) {
						$scope.groups = data.pagedListDTO.records;
					},
					function(error) {
						responseService.errorResponse("读取用户来源配置失败");
					});
				
				$scope.check.mifiPhoneNo = function() {
					
					if(!$scope.mifiobj.imsi && !$scope.mifiobj.mifiPhoneNo){
						$scope.alert.info = true;
						$scope.alertInfo.info = "IMSI和资费卡号至少输入一项";
						return;
					}
					if($scope.mifiobj.mifiPhoneNo && $scope.mifiobj.mifiPhoneNo != "无"){
						$scope.alert.info = false;
						$scope.alertInfo.info = "";
						var phoneNoFilter = /^([1-9][0-9]{0,15})$/; 
						if (!phoneNoFilter.test($scope.mifiobj.mifiPhoneNo) ) {
							$scope.alert.mifiPhoneNo = true;
							$scope.alertInfo.mifiPhoneNo = "非零开头1-16位数字";
							return;
						}
					}
					
					if($scope.mifiobj.imsi && $scope.mifiobj.imsi!= "无"){
						$scope.alert.info = false;
						$scope.alertInfo.info = "";
						if($scope.mifiobj.imsi.length != 15){
							$scope.alert.imsi = true;
							$scope.alertInfo.imsi = "IMSI不填或15位";
							return;
						}
					}
					
					$scope.alert.mifiPhoneNo = false;
					$scope.alertInfo.mifiPhoneNo = "";
					$scope.alert.imsi = false;
					$scope.alertInfo.imsi = "";
					$scope.alert.info = false;
					$scope.alertInfo.info = "";
					
				};
				
		/*		$scope.check.imsi = function() {
					if (!$scope.mifiobj.imsi) {
						$scope.alert.imsi = true;
						$scope.alertInfo.imsi = "请输入imsi";
					} else {
						var imsilen = $scope.mifiobj.imsi;
						if(imsilen.length != 15){
							$scope.alert.imsi = true;
							$scope.alertInfo.imsi = "请输入15位的imsi";
						}else{
							$scope.alert.imsi = false;
							$scope.alertInfo.imsi = "";
						}
					}
				};*/
				$scope.check.mo = function() {
					if (!$scope.mifiobj.mo) {
						$scope.alert.mo = true;
						$scope.alertInfo.mo = "请选择运营商";
					} else {
						$scope.alert.mo = false;
						$scope.alertInfo.mo = "";
					}
				};
				$scope.check.province = function() {
					if (!$scope.mifiobj.province) {
						$scope.alert.province = true;
						$scope.alertInfo.province = "请选择省份";
					} else {
						$scope.alert.province = false;
						$scope.alertInfo.province = "";
					}
				};
				$scope.check.groupName = function() {
					var groupNamelen = $scope.mifiobj.groupName;
					if (!$scope.mifiobj.groupName) {
						$scope.alert.groupName = true;
						$scope.alertInfo.groupName = "请选择使用角色";
					} else if(groupNamelen.length > 32){
						$scope.alert.groupName = true;
						$scope.alertInfo.groupName = "最多32位";
					} else {
						$scope.alert.groupName = false;
						$scope.alertInfo.groupName = "";
					}
				};
				$scope.check.cardType = function() {
					if (!$scope.mifiobj.cardType) {
						$scope.alert.cardType = true;
						$scope.alertInfo.cardType = "请选择套餐类型";
					} else {
						$scope.alert.cardType = false;
						$scope.alertInfo.cardType = "";
					}
				};
			/*	$scope.check.mifiNo = function() {
					if (!$scope.mifiobj.mifiNo) {
						$scope.alert.mifiNo = true;
						$scope.alertInfo.mifiNo = "不能为空";
					} else {
						var mifiNolen = $scope.mifiobj.mifiNo;
						if(mifiNolen.length > 32){
							$scope.alert.mifiNo = true;
							$scope.alertInfo.mifiNo = "最多32位";
						}else{
							$scope.alert.mifiNo = false;
							$scope.alertInfo.mifiNo = "";
						}
					}
				};*/
				$scope.check.activeState = function() {
					if (!$scope.mifiobj.activeState) {
						$scope.alert.activeState = true;
						$scope.alertInfo.activeState = "请选择状态";
					} else {
						$scope.alert.activeState = false;
						$scope.alertInfo.activeState = "";
					}
				};
		
				$scope.check.concurrency = function() {
					if ($scope.mifiobj.concurrency == 0) {
						$scope.alert.concurrency = false;
						$scope.alertInfo.concurrency = "";
						return;
					}
					if (!$scope.mifiobj.concurrency) {
						$scope.alert.concurrency = true;
						$scope.alertInfo.concurrency = "请输入并发数";
						return;
					}
					if(check.nan($scope.mifiobj.concurrency)){
						$scope.alert.concurrency = true;
						$scope.alertInfo.concurrency = "请输入0-9999的整数";
						return;
					}
					if(!check.integer($scope.mifiobj.concurrency)){
						$scope.alert.concurrency = true;
						$scope.alertInfo.concurrency = "请输入0-9999的整数";
						return;
					}
					if(!check.compare_size($scope.mifiobj.concurrency,9999)){
						$scope.alert.concurrency = true;
						$scope.alertInfo.concurrency = "请输入0-9999的整数";
						return;
					}
					else {
						$scope.alert.concurrency = false;
						$scope.alertInfo.concurrency = "";
						return;
					}
				};
				
				
				$scope.send = function() {
					for (var i in $scope.check) {
						$scope.check[i]();
						if ($scope.alert[i] == true)
							return;
					}
					var movalue ;
					webService.get_data("/mifi/admin/v2/mificard/edit?cardId=" + $scope.mifiobj.cardId +
						"&mifiPhoneNo=" + ($scope.mifiobj.mifiPhoneNo =="无"?"":$scope.mifiobj.mifiPhoneNo) +
						"&moType=" + $scope.mifiobj.mo +
						"&province=" + $scope.mifiobj.province +
						"&groupName=" + $scope.mifiobj.groupName +
						"&imsi=" + ($scope.mifiobj.imsi == "无"?"":$scope.mifiobj.imsi)  +
						"&cardType=" + $scope.mifiobj.cardType +
						"&concurrency=" + $scope.mifiobj.concurrency +
						"&activeState=" + $scope.mifiobj.activeState).then(function(data) {
							if(data.code == 200){
								$scope.close();
								$scope.refresh();
								layer.alert('操作成功', {
									icon: 1
								});
							} else {
								responseService.errorResponse("操作失败。" + data.desc);
							}
							
						},
						function(error) {
							responseService.errorResponse("操作失败。" + error);
						});
				};
				
				$scope.close = function() {
					$scope.control = false;
				}
			}

			}
		}
})
