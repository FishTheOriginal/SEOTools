"use strict";var states=[{name:"base",state:{"abstract":!0,url:"",templateUrl:"views/base.html",data:{text:"Base",visible:!1}}},{name:"dashboard",state:{url:"/dashboard",parent:"base",templateUrl:"views/dashboard.html",controller:"DashboardCtrl",data:{text:"Dashboard",visible:!1}}},{name:"adGroupKeywordsTool",state:{url:"/adGroupKeywordsTool",parent:"dashboard",templateUrl:"pages/adgroup_keywords_tool/adgroup_keywords_tool.html",controller:"AdgroupKeywordsToolCtrl",data:{text:"Ad Group Keywords Tool",visible:!0}}}];angular.module("yapp",["ui.router","snap","ngAnimate"]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.when("/dashboard","/dashboard/adGroupKeywordsTool"),t.otherwise("/dashboard","/dashboard/adGroupKeywordsTool"),angular.forEach(states,function(t){e.state(t.name,t.state)})}]),angular.module("yapp").controller("LoginCtrl",["$scope","$location",function(e,t){e.submit=function(){return t.path("/dashboard"),!1}}]),angular.module("yapp").controller("DashboardCtrl",["$scope","$state",function(e,t){e.$state=t,e.menuItems=[],angular.forEach(t.get(),function(t){t.data&&t.data.visible&&e.menuItems.push({name:t.name,text:t.data.text})})}]),angular.module("yapp").controller("AdgroupKeywordsToolCtrl",["$scope","$location",function(e,t){e.x={},e.x.phrases=[{text:""}],e.settings={prependPlus:!0,prependQuote:!0,singularIsPlural:!0,modalActionText:"",spellingErrors:!0},e.modal={text:"",mode:"",actionText:""},e.$watch("settings",function(t,a){e.keywordChange(),e.phraseBuildLists(),e.countKeywordUsage()},!0),e.$watch("x.keywords",function(t,a){e.phraseBuildLists(),e.countKeywordUsage()}),e.keywordChange=function(){e.x.keywords=[];var t=e.strToArray(e.x.keywordsText);_.each(t,function(t){var a={text:t,base:e.getKeywordBaseArray(t)};0!=a.base.length&&e.x.keywords.push(a)})},e.phraseChange=function(t){e.x.phrases[0]&&e.x.phrases[0].text.length>0?e.x.phrases.unshift({text:"",base:[]}):e.x.phrases.push({text:""})},e.strToArray=function(e,t){if(e){t||(t="\n");var a=e.split(t);return a=a.filter(String),a=_.uniq(a)}},e.getKeywordBaseArray=function(t){if(!t)return!1;var a=e.strToArray(t," ");return a.sort(),a=_.map(a,function(t){return t=t.toLowerCase(),e.settings.singularIsPlural&&(t=pluralize(t,1)),e.settings.spellingErrors&&(t=t.replace(/(\w)\1+/g,function(e,t){return t[0]})),t})},e.buildPhraseList=function(t){return""==t.text?[]:(t.items=[],void _.each(e.x.keywords,function(e){var a=_.intersection(t.base,e.base);_.isEqual(t.base,a)&&t.items.push({keyword:e,checked:!0})}))},e.phraseBuildLists=function(){_.each(e.x.phrases,function(t){t.base=e.getKeywordBaseArray(t.text),e.buildPhraseList(t)})},e.phraseExportList=function(t){var a="";_.each(t.items,function(t){var r=t.keyword.text;t.checked&&(e.settings.prependPlus&&(r="+"+e.strToArray(r," ").join(" +")),e.settings.prependQuote&&(r="'"+r),a+=r+"\n")}),e.modal.text=a},e.countKeywordUsage=function(){var t=[];_.each(e.x.phrases,function(e){_.each(e.items,function(e){e.checked&&t.push(e.keyword)})}),_.each(e.x.keywords,function(e){e.usage=0,_.each(t,function(t){e==t&&(e.usage+=1)})})},e.phraseKeyup=function(t,a){13==a&&e.phraseChange(t),t.base=e.getKeywordBaseArray(t.text),e.buildPhraseList(t),e.countKeywordUsage()},e.phrasesRemoveEmpty=function(){e.x.phrases=_.filter(e.x.phrases,function(e){if(""!=e.text)return e})},e.keywordDelete=function(t){var a=e.x.keywords.indexOf(t);e.x.keywords.splice(a,1);var r="";_.each(e.x.keywords,function(e){r+=e.text+"\n"}),e.x.keywordsText=r,e.phraseBuildLists()},e.phrasesExport=function(){e.phrasesRemoveEmpty();var t=[];_.each(e.x.phrases,function(e){t.push(e.text)}),e.modal.text=t.join("\n"),e.phraseChange()},e.phrasesImport=function(){var t=e.modal.text.split("\n");t.length>0&&_.each(t,function(t){t.length>0&&e.x.phrases.unshift({text:t})}),e.phrasesRemoveEmpty(),e.phraseBuildLists(),e.countKeywordUsage(),e.phraseChange()},e.modalSetMode=function(t,a){switch(e.modal.mode=t,t){case"phrasesExport":e.modal.actionText="",e.phrasesExport();break;case"phrasesImport":e.modal.actionText="Import";break;case"phraseExportList":e.modal.actionText="",e.phraseExportList(a);break;default:e.modal.actionText=""}},e.modalActionExe=function(t,a,r){switch(e.modal.mode){case"phrasesExport":break;case"phrasesImport":e.phrasesImport()}}}]);