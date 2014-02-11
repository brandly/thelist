var dependencies;angular.module("sc2.services",[]),angular.module("sc2.filters",[]),angular.module("sc2.directives",[]),dependencies=["sc2.services","sc2.filters","sc2.directives","ui.router"],angular.module("sc2",dependencies).config(["$stateProvider","$urlRouterProvider",function(e,r){return e.state("app",{url:"/",templateUrl:"views/app.html",controller:"MainCtrl"}),r.otherwise("/")}]).run(["$rootScope",function(e){return e.$watch("trackTitle",function(r){var t;return t=null!=r?" | "+r:"",e.pageTitle="the list"+t})}]);
angular.module("sc2").controller("MainCtrl",["$scope",function(t){return Mousetrap.bind("space",function(n){return n.preventDefault(),t.player.togglePause()}),Mousetrap.bind("shift+right",function(){return t.player.next()}),Mousetrap.bind("shift+left",function(){return t.player.prev()}),t.$on("$destroy",function(){return Mousetrap.unbind("space"),Mousetrap.unbind("shift+right"),Mousetrap.unbind("shift+left")})}]);
angular.module("sc2.directives").directive("linkToTrack",[function(){return{replace:!0,scope:!0,templateUrl:"views/link-to-track.html",controller:["$scope","$sc",function(r,n){var e;return r.error=null,r.search={url:""},e=function(n){var e,l;return r.error=(null!=n?n.message:void 0)||!0,l=r.search.url,e=r.$watch("search.url",function(n){return n!==l?(r.error=null,e()):void 0})},r.loading=!1,r.addTrackFromLink=function(l){return r.loading=!0,n.resolve(l).then(function(n){return"track"===(null!=n?n.kind:void 0)?(r.playlist.push(n),r.search.url=""):e({message:"Not a track"})},function(r){return e(r)})["finally"](function(){return r.loading=!1})}}]}}]);
angular.module("sc2.directives").directive("playlist",["$sc","$interval","$rootScope",function(r,t,n){var e;return e=["uninitialised","loading","error","loaded"],{link:function(u){var i;return u.playlist=i=[],u.player={current:{},play:function(){var r;return(null!=(r=this.current.sound)?r.paused:void 0)?this.current.sound.play():i.length?this.playTrack(0):void 0},togglePause:function(){var r;return null!=(r=this.current.sound)?r.togglePause():void 0},playTrack:function(u){return this.stop(),this.current={track:i[u],index:u},n.trackTitle=this.current.track.title,r.streamTrack(this.current.track.id).then(function(r){return function(n){return console.log("GOT SOUND",n),r.current.track===i[u]?(n.play(),r.current.sound=n,r.current.interval=t(function(){if(r.current.position=r.current.sound.position,"loading"===e[r.current.sound.readyState]);else{if("error"===e[r.current.sound.readyState])return r.current.track.error=!0,r.next();if(r.current.sound.position===r.current.sound.duration)return r.next()}},1e3)):void 0}}(this),function(r){return i[u].error=r})},pause:function(){var r;return null!=(r=this.current.sound)?r.pause():void 0},next:function(){var r;return this.playTrack(null!=this.current.sound&&(r=this.current.index+1,r<i.length)?r:0)},prev:function(){var r;return this.playTrack(null!=this.current.sound&&(r=this.current.index-1,r>=0)?r:i.length-1)},seek:function(r){var t,n;return t=r*this.current.sound.duration,this.current.position=t,null!=(n=this.current.sound)?n.setPosition(t):void 0},stop:function(){var r;return t.cancel(this.current.interval),null!=(r=this.current.sound)&&r.stop(),this.current={},n.trackTitle=null}}}}}]);
angular.module("sc2.directives").directive("seek",[function(){return{link:function(e,n){return n.on("click",function(n){var t,i;return t=n.offsetX/(null!=(i=n.target)?i.offsetWidth:void 0),t?e.player.seek(t):void 0})}}}]);
angular.module("sc2.directives").directive("songFinder",["$sc",function(e){return{replace:!0,scope:!0,templateUrl:"views/song-finder.html",controller:["$scope",function(r){return r.tracks=[],r.search={query:""},r.$watch("search.query",_.debounce(function(){return 0===r.search.query.length?r.$apply(function(){return r.tracks=[]}):(r.$apply(function(){return r.loading=!0}),e.searchTracks(r.search.query,10).then(function(e){return console.log("TRACKS",e),r.tracks=e})["finally"](function(){return r.loading=!1}))},300))}]}}]);
angular.module("sc2.filters").filter("resizeArt",function(){return function(r,e){return r?r.replace("large.jpg","t"+e+"x"+e+".jpg"):""}});
angular.module("sc2.services").service("$sc",["$q",function(e){return SC.initialize({client_id:"7f5d27e4fc4e7c52527da9a5ebda2668"}),{get:function(r,t){var n;return null==t&&(t={}),n=e.defer(),SC.get(r,t,function(e,r){return null!=r?n.reject(r):n.resolve(e)}),n.promise},getTracks:function(e){return this.get("/tracks",e)},searchTracks:function(e,r){return this.getTracks({q:e,limit:r})},streamTrack:function(r){var t;return t=e.defer(),SC.stream("/tracks/"+r,function(e,r){return null!=r?t.reject(r):t.resolve(e)}),t.promise},resolve:function(r){var t;return t=e.defer(),SC.get("/resolve",{url:r},function(e,r){return null!=r?t.reject(r):t.resolve(e)}),t.promise}}}]);