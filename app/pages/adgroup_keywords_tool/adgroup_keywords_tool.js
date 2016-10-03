'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('AdgroupKeywordsToolCtrl', function($scope, $location) {

    $scope.x = {};
    $scope.x.phrases = [{text: ''}];
    $scope.settings = {
    	prependPlus: true,
    	prependQuote: true,
    	singularIsPlural: true,
    	modalActionText: '',
    	spellingErrors: true
    };
    
    $scope.modal = {
    	text: '',
    	mode: '',
    	actionText: ''
    };
    
    // Updating lists if settings are changing.
	$scope.$watch('settings', function (newVal, oldVal) {
		
		$scope.keywordChange();
		$scope.phraseBuildLists();
		$scope.countKeywordUsage();
	}, true);
	
	$scope.$watch('x.keywords', function (newVal, oldVal) {

		$scope.phraseBuildLists();
		$scope.countKeywordUsage();
	});
    
    // Updating keyword list.
    $scope.keywordChange = function(){

    	$scope.x.keywords = [];
    	var keywords = $scope.strToArray($scope.x.keywordsText);
    	_.each(keywords, function(keyword){
    		
    		var kwObj = {
    			text: keyword,
    			base: $scope.getKeywordBaseArray(keyword)
    		}
    		
    		if (kwObj.base.length == 0) return;
    		
    		$scope.x.keywords.push(kwObj);
    	});
    }
    
    // Building phrase KW list and adding extra empty phrase if needed.
    $scope.phraseChange = function(phrase){

		// Adding empty phrase UI.
    	if ($scope.x.phrases[0] && $scope.x.phrases[0].text.length > 0) {

    		$scope.x.phrases.unshift({
    			text: '',
    			base: []
    		});
    	}
    	else {
    		$scope.x.phrases.push({text: ''});
    	}
    }

    // String to array.
	$scope.strToArray = function(str, delimiter){

		if (!str) return;

		if (!delimiter) delimiter = "\n";

    	// String to array.
    	var arr = str.split(delimiter);

    	// Remove empty spaces.
    	arr = arr.filter(String);

    	// Remove dupes.
    	arr = _.uniq(arr);
    	
    	return arr;
	}
	
	// Utility to get a base array of a string.
	$scope.getKeywordBaseArray = function(str){
		
		if (!str) return false;
		
		var arr = $scope.strToArray(str, ' ');
		arr.sort();
		arr = _.map(arr, function(item){

			item = item.toLowerCase();
			
			if ($scope.settings.singularIsPlural) {
				item = pluralize(item, 1);
			}
			
			// Removing duplicate spelling errors. programmer = programer.
			if ($scope.settings.spellingErrors) {

			  item = item.replace(/(\w)\1+/g, function (item, match) {
			      return match[0];
			  });
			}
			
			return item;
		});
		return arr;
	}
	
	// Getting keyword list for a phrase.
    $scope.buildPhraseList = function(phrase) {

		if (phrase.text == '') return [];

    	phrase.items = [];
    	_.each($scope.x.keywords, function(keyword){

    		var intersectArray = _.intersection(phrase.base, keyword.base);
    		
    		if (_.isEqual(phrase.base, intersectArray)) {
    			phrase.items.push({
    				keyword: keyword,
    				checked: true
    			});
    		}
    	});
    }
    
	// Getting keyword list for a phrase.
    $scope.phraseBuildLists = function() {

    	_.each($scope.x.phrases, function(phrase){

			phrase.base = $scope.getKeywordBaseArray(phrase.text);
			$scope.buildPhraseList(phrase);
    	});
    }
    
    // Building modal with phrase keyword list.
    $scope.phraseExportList = function(phrase){

    	var output = "";
    	_.each(phrase.items, function(item){
    		
    		var text = item.keyword.text;
    		if (item.checked) {
    			
    			if ($scope.settings.prependPlus) {
    				text = '+' + $scope.strToArray(text, ' ').join(' +');
    			}
    			
    			if ($scope.settings.prependQuote) {
    				text = "'" + text;
    			}
    			
    			output += text + "\n";
    		}
    		
    	});
    	
    	$scope.modal.text = output;
    }
    
    // Add usage count to keywords.
    $scope.countKeywordUsage = function(){
    	
    	// Merging all phrases.
    	var phraseKeywords = [];
    	_.each($scope.x.phrases, function(phrase){
	    	_.each(phrase.items, function(item){
	    		if (item.checked) {
	    			phraseKeywords.push(item.keyword);
	    		}
	    	});
    	});
    	
    	_.each($scope.x.keywords, function(keyword){
    		keyword.usage = 0;
	    	_.each(phraseKeywords, function(phraseKeyword){
	    		if (keyword == phraseKeyword) {
	    			keyword.usage += 1;
	    		}
	    	});
    	});
    }
    
    // Submit phrase action.
    $scope.phraseKeyup = function(phrase, event){
    	
    	if (event == 13) {
			$scope.phraseChange(phrase); 
    	}
    	
		phrase.base = $scope.getKeywordBaseArray(phrase.text);
		$scope.buildPhraseList(phrase);
    	$scope.countKeywordUsage();
    }
    
    $scope.phrasesRemoveEmpty = function(){
		$scope.x.phrases = _.filter($scope.x.phrases, function(item){
			
			if (item.text != '') {
				
				return item;
			}
		});
    }
    
    // Deleting a keyword.
    $scope.keywordDelete = function(keyword){
    	
    	var index = $scope.x.keywords.indexOf(keyword);
    	$scope.x.keywords.splice(index, 1);
    	
    	var str = '';
    	_.each($scope.x.keywords, function(keyword){
    		
    		str += keyword.text + "\n";
    	});
    	
    	$scope.x.keywordsText = str;
    	$scope.phraseBuildLists();
    }
    
    // Getting all phrases.
    $scope.phrasesExport = function(){
    	
    	$scope.phrasesRemoveEmpty();
    	
    	var output = [];
    	_.each($scope.x.phrases, function(phrase){
    		
    		output.push(phrase.text);
    	});
    	
    	$scope.modal.text = output.join("\n");
    	$scope.phraseChange();
    }
    
    // Importing phrases.
    $scope.phrasesImport = function(){
    	
    	var arr = $scope.modal.text.split("\n");
    	if (arr.length > 0) {
    		
	    	_.each(arr, function(text){
	    		
	    		if (text.length > 0) {
		    		$scope.x.phrases.unshift({text: text})
	    		}
	    	});
    	}
    	
    	$scope.phrasesRemoveEmpty();
    	$scope.phraseBuildLists();
		$scope.countKeywordUsage();
    	$scope.phraseChange();
    }
    
	// Modal actions SWITCH.
	$scope.modalSetMode = function(action, arg1) {
	
		$scope.modal.mode = action;
		switch(action) {
		    case 'phrasesExport':
		        $scope.modal.actionText = '';
		        $scope.phrasesExport();
		        break;
		        
		        
		    case 'phrasesImport':
		    	$scope.modal.actionText = 'Import';
		        break;
		        		        
		    case 'phraseExportList':
		    	$scope.modal.actionText = '';
				$scope.phraseExportList(arg1);
		        break;
		        
		    default:
		        $scope.modal.actionText = '';
		        break;
		}
	}
	
	// Modal actions.
	$scope.modalActionExe = function(arg1, arg2, arg3) {

		switch($scope.modal.mode) {
		    case 'phrasesExport':
		        break;
		    case 'phrasesImport':
		    	$scope.phrasesImport();
		        break;
		    default:
		        break;
		}
	}
    
});