//
var app = angular.module("twitterApp", ['dndLists']);
app.controller("mainController", function($scope, $http, $sce) {

  //Variable Declaration 
	var tweets = [];
	var savedList = [];

	// Check the local Storage
	savedList = localStorage.getItem("storedList")!== null ? localStorage.getItem("storedList") : [];

	$scope.models = {
			selected: null,
			tweetsList: {"searchedTweets": tweets, "savedTweets": savedList.length > 0 ? JSON.parse(savedList) : []}
		};
	
	/**
	 * Search the top 10 tweets based on the "Search Tweets" keyword
	 * @method searchTweets
	 * @param: {String} searchKeyword
	 * @return  {object} - of searched tweets
	 */
	$scope.searchTweets= function(searchKeyword){
		var endpoint = 'http://tweetsaver.herokuapp.com/?q='+searchKeyword+'&count=10';
		var trustedUrl = $sce.trustAsResourceUrl(endpoint);
		
		//Make JSONP call to fetch the tweets from the server
		$http.jsonp(trustedUrl, {jsonpCallbackParam: 'callback'})
		.then(function(response){
			allTweets = response.data.tweets;
			$scope.models.tweetsList.searchedTweets = allTweets;
		});
	}
	/**
	 * Save the tweet to the drop area if it does not exist in the saved list
	 * @method onDrop
	 * @param: srcList, srcIndex, targetList, targetIndex
	 * @return  {boolean}
	 */

	$scope.onDrop = function(srcList, srcIndex, targetList, targetIndex) {      
		//Check tweet in saved list
		var tweetId = srcList[srcIndex].id;
		
		if(isTweetExist(tweetId,targetList) || targetList.length === 0){
			saveTweet(srcList, srcIndex, targetList, targetIndex);
		}
	};

	/**
	 * Check if the tweet exists in the saved list 
	 * @method isTweetExist
	 * @param: id, targetList
	 * @return  {boolean}
	 */

	function isTweetExist(id, targetList){
		for(var i = 0; i< targetList.length ; i++){
			if(targetList[i].id === id){
				return false;
			}
		}
		return true;
	}

	/**
	 * Save the tweets in local storage and target list
	 * @method saveTweet
	 * @param: srcList, srcIndex, targetList, targetIndex
	 * @return  {boolean}
	 */

	function saveTweet(srcList, srcIndex, targetList, targetIndex){
		targetList.splice(targetIndex, 0, srcList[srcIndex]);
		localStorage.setItem("storedList", JSON.stringify(targetList));
		// incase item is already inserted
		return true;
	}
	/**
	 * Clear the saved tweets list
	 * @method clearTweets
	 * @param: None
	 * @return 
	 */
	$scope.clearTweets = function(){
		$scope.models.tweetsList.savedTweets =[];
		localStorage.setItem("storedList",'');
	}

	});
