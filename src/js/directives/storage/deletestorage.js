linker.directive('deletestorage',function(responseService,storageService){
	return{
		templateUrl: './templates/directives/storage/deletestorage.html',
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
				var data = {
					"id" : $scope.dele.id
				};
				storageService.delete_storage(data).then(function(response){
					if(responseService.successResponse(response)){
						$scope.cancel();
						$scope.refresh();
						layer.alert('操作成功',{
				            	icon: 1
				            });
					}
				},function(errorMessage) {
						responseService.errorResponse("操作失败");
						$scope.cancel();
					}); 				
			}
			$scope.cancel = function(){
				$scope.control = false;
				console.log("333");
			}
		}
	}				
})