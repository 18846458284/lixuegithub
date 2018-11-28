linker.directive('deleterole',function(webService,responseService){
	return{
		templateUrl: './templates/directives/deleterole.html',
		scope:{
			control:"=",
			refresh:'&refreshFn',
			original: "=",
		},
		restrict:'ACEM',
		link:function($scope){
			$scope.init = function() {
				$scope.dele = new Object();
				angular.copy($scope.original,$scope.dele);
			}
			$scope.ok = function(){
				webService.get_data("/user/role/deleteRole?roleId="+$scope.dele.id)
				.then(function(response){
					if(responseService.successResponse(response)){
						$scope.cancel();
						$scope.refresh();
						layer.alert('操作成功',{
				            	icon: 1
				            });
					}
				},function(error) {
					responseService.errorResponse("操作失败。" + error);
				}); 				
			}
			$scope.cancel = function(){
				$scope.control = false;
				console.log("333");
			}
		}
	}				
})