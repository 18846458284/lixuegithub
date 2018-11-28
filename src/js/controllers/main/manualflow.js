linker.controller('ManualFlowController', function($scope, $http, $window, webService, responseService) {
	var initdata = function() {
		$scope.recharge = new Object();
		$scope.recharge.scope = "全国";
		$scope.recharge.callbackUrl = "";
		$scope.alert = new Object();
	}
	var init = function() {
		$scope.downcontrol = false;
		$scope.infocontrol = false;
		$scope.isactive = true;
		$scope.check = new Object();
		$scope.alertInfo = new Object();
		initdata();
		$("#file").change(function() {
			var file = $("#file").val();
			var fileFormat = file.substring(file.lastIndexOf(".")+1).toLowerCase();
			if (file == "") {
				$scope.$apply(function() {
					$scope.alert.file = true;
					$scope.alertInfo.file = "请选择文件";
				})
			} else if(fileFormat!="xls" && fileFormat != "xlsx") {
				$scope.$apply(function() {
					$scope.alert.file = true;
					$scope.alertInfo.file = "仅支持xlsx和xls格式的文件";
				})
			} else {
				$scope.$apply(function() {
					$scope.alert.file = false;
					$scope.alertInfo.file = "";
				})
			}
		});
	};
	init();
	$scope.downtrue = function() {
		$window.location = "/op/recharge/rechargeResult?";
		$("#fileadd")[0].reset();
		$scope.downcontrol = false;
	}
	$scope.downcancel = function() {
		$("#fileadd")[0].reset();
		$scope.downcontrol = false;
	}
	$scope.sendfile = function() {
		var file = $("#file").val();
		var fileFormat = file.substring(file.lastIndexOf(".")+1).toLowerCase();
		if (!file) {
			$scope.alert.file = true;
			$scope.alertInfo.file = "请选择文件";
			return;
		}
		if (fileFormat!="xls" && fileFormat != "xlsx") {
			$scope.alert.file = true;
			$scope.alertInfo.file = "仅支持xlsx和xls格式的文件";
			return;
		}
		$scope.alert.file = false;
		$scope.alertInfo.file = "";
		$("#fileadd").ajaxSubmit({
			dataType: 'text',
			cache: false,
			beforeSend: function() {
				$scope.infocontrol = true;
			},
			success: function(data) {
				$scope.$apply(function() {
					$scope.infocontrol = false;
				});
				var test = eval("(" + data + ")");
				if (test.reply != 1) {
					layer.alert(test.replyDesc, {
						icon: 2
					});
				} else {
					$scope.$apply(function() {
						$scope.downcontrol = true;
					});
				}
			},
			error: function(xhr) {
				$scope.$apply(function() {
					$scope.infocontrol = false;
				});
				var error = eval("(" + xhr.responseText + ")");
				layer.alert(error.error, {
					icon: 2
				});
			}
		});
	}
	$scope.active = function(position) {
		if (position == 0 && $scope.isactive == true) {
			return;
		}
		if (position == 1 && $scope.isactive == false) {
			return;
		}
		$(function() {
			$('#myTab li:eq(' + position + ') a').tab('show');
		});
		$scope.isactive = !$scope.isactive;
		initdata();
	};
	$scope.send = function() {
		for (var i in $scope.check) {
			$scope.check[i]();
			if ($scope.alert[i] == true)
				return;
		}
		$scope.control = true;
		var callbackUrl = encodeURI($scope.recharge.callbackUrl);
		webService.get_data("/op/recharge/recharge?phoneNo=" + $scope.recharge.phoneNo +
			"&scope=" + $scope.recharge.scope +
			"&spec=" + $scope.recharge.spec +
			"&callbackUrl=" + callbackUrl
		).then(function(data) {
				if (data.reply != 1) {
					$scope.control = false;
					responseService.errorResponse(data.replyDesc);
				} else {
					$scope.control = false;
					initdata();
					layer.alert('提交成功', {
						icon: 1
					});
				}
			},
			function(error) {
				$scope.control = false;
				responseService.errorResponse(error);
			});
	};
	$scope.check.phoneNo = function() {
		if (!$scope.recharge.phoneNo) {
			$scope.alert.phoneNo = true;
			$scope.alertInfo.phoneNo = "请填写手机号";
		} else {
			var phone = /^1\d{10}$/;
			if (!phone.test($scope.recharge.phoneNo)) {
				$scope.alert.phoneNo = true;
				$scope.alertInfo.phoneNo = "手机号是以1开头的11位数字";
			} else {
				$scope.alert.phoneNo = false;
				$scope.alertInfo.phoneNo = "";
			}
		}
	}
	$scope.check.callbackUrl = function() {
		if (!$scope.recharge.callbackUrl) {
			$scope.alert.callbackUrl = false;
			$scope.alertInfo.callbackUrl = "";
		} else {
			var l = $scope.recharge.callbackUrl.length;
			var blen = 0;
			for (i = 0; i < l; i++) {
				if (($scope.recharge.callbackUrl.charCodeAt(i) & 0xff00) != 0) {
					blen++;
				}
				blen++;
			}
			if (blen <= 128) {
				$scope.alert.callbackUrl = false;
				$scope.alertInfo.callbackUrl = "";
			} else {
				$scope.alert.callbackUrl = true;
				$scope.alertInfo.callbackUrl = "长度不超过128位";
			}
		}
	}
	$scope.check.spec = function() {
		if (!$scope.recharge.spec) $scope.recharge.spec = "";
		var check_data = $scope.recharge.spec;
		if (check_data == "") {
			$scope.alert.spec = true;
			$scope.alertInfo.spec = "请填写规格";
			return;
		}
		var filterNum = /^[1-9]\d*$/;
		var filterUnit = /^[1-9]\d+[m|M|g|G]{1}$/;
		var changeUnit = /^[1-9]\d+[m|M]{1}$/;
		var changeUnitg = /^[1-9]\d+[g|G]{1}$/;
		if (changeUnit.test(check_data)) {
			check_data = check_data.substring(0, check_data.length - 1);
			if (check_data > 1048576) {
				$scope.alert.spec = true;
				$scope.alertInfo.spec = "范围：0-1048576M";
				return;
			}
		}
		if (filterNum.test(check_data)) {
			if (check_data > 1048576) {
				$scope.alert.spec = true;
				$scope.alertInfo.spec = "范围：0-1048576M";
				return;
			}
		}
		if (changeUnitg.test(check_data)) {
			check_data = check_data.substring(0, check_data.length - 1);
			if (check_data > 1024) {
				$scope.alert.spec = true;
				$scope.alertInfo.spec = "范围：0-1024G";
				return;
			}
			check_data = check_data + 'G';
		}
		if (filterUnit.test(check_data) || filterNum.test(check_data)) {
			$scope.alert.spec = false;
			$scope.alertInfo.spec = "";
		} else {
			$scope.alert.spec = true;
			$scope.alertInfo.spec = "请按照正确格式输入，如10, 30M, 70m, 1G, 11g都是合法输入";
		}
	};
});