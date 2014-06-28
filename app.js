var dependencies;angular.module("sc2.services",[]),angular.module("sc2.filters",[]),angular.module("sc2.directives",[]),dependencies=["sc2.services","sc2.filters","sc2.directives","ui.router"],angular.module("sc2",dependencies).config(["$stateProvider","$urlRouterProvider",function(e,r){return e.state("app",{url:"/",templateUrl:"views/app.html",controller:"MainCtrl"}),r.otherwise("/")}]).run(["$rootScope",function(e){return e.$watch("trackTitle",function(r){var t;return t=null!=r?" | "+r:"",e.pageTitle="the list"+t})}]);
angular.module("sc2").controller("MainCtrl",["$scope",function(n){return Mousetrap.bind("space",function(r){return r.preventDefault(),n.$apply(function(){return n.player.togglePause()})}),Mousetrap.bind("shift+right",function(){return n.$apply(function(){return n.player.next()})}),Mousetrap.bind("shift+left",function(){return n.$apply(function(){return n.player.prev()})}),n.$on("dragToReorder.reordered",function(){return n.playlist.save()}),n.$on("$destroy",function(){return Mousetrap.unbind("space"),Mousetrap.unbind("shift+right"),Mousetrap.unbind("shift+left")})}]);
angular.module("sc2.directives").directive("dragToReorder",[function(){return{link:function(e,r,a){var o,n,t,d,s,i;if(null==e[a.dragToReorder])throw"Must specify the list to reorder";return n="dragging",r.attr("draggable",!0),r.on("dragstart",function(a){return r.addClass(n),a.dataTransfer.setData("text/plain",e.$index)}),r.on("dragend",function(){return r.removeClass(n)}),i="dropping",d="dropping-above",s="dropping-below",o=function(e){var a;return e.preventDefault(),a=e.offsetY||e.layerY,a<this.offsetHeight/2?(r.removeClass(s),r.addClass(d)):(r.removeClass(d),r.addClass(s))},t=function(o){var n,l,f,u,g,v,p;if(o.preventDefault(),n=parseInt(o.dataTransfer.getData("text/plain"),10),g=e[a.dragToReorder],u=null,u=r.hasClass(d)?n<e.$index?e.$index-1:e.$index:n<e.$index?e.$index:e.$index+1,console.log("moving item",n,"to",u),f=g[n],u>n)for(l=v=n;u>v;l=v+=1)g[l]=g[l+1];else if(n>u)for(l=p=n;p>u;l=p+=-1)g[l]=g[l-1];return g[u]=f,e.$apply(function(){return e.$emit("dragToReorder.reordered",{array:g,item:f,from:n,to:u})}),r.removeClass(i),r.removeClass(d),r.removeClass(s),r.off("drop",t)},r.on("dragenter",function(){return r.hasClass(n)?void 0:(r.addClass(i),r.on("dragover",o),r.on("drop",t))}),r.on("dragleave",function(){return r.removeClass(i),r.removeClass(d),r.removeClass(s),r.off("dragover",o),r.off("drop",t)})}}}]);
angular.module("sc2.directives").directive("linkToTrack",[function(){return{replace:!0,scope:!0,templateUrl:"views/link-to-track.html",controller:["$scope","$sc",function(r,e){var n;return r.error=null,r.search={url:""},n=function(e){var n,a;return r.error=(null!=e?e.message:void 0)||!0,a=r.search.url,n=r.$watch("search.url",function(e){return e!==a?(r.error=null,n()):void 0})},r.loading=!1,r.addTrackFromLink=function(a){return r.loading=!0,e.resolve(a).then(function(e){return"track"!==(null!=e?e.kind:void 0)?n({message:"Not a track"}):e.streamable?(r.playlist.add(e),r.search.url=""):n({message:"Can't stream track :("})},n)["finally"](function(){return r.loading=!1})}}]}}]);
angular.module("sc2.directives").directive("playlist",["$sc","$interval","$rootScope",function(r,t,n){var e,u,i,o,c,s,a;return s=["uninitialised","loading","error","loaded"],a=window.localStorage,u="the-list-track-ids",c=function(){var r;return r=o.map(function(r){return r.id}),a[u]=JSON.stringify(r)},e=function(){var t;return t=JSON.parse(a[u]),(null!=t?t.length:void 0)?t.forEach(function(t,n){return r.getTrackById(t).then(function(r){return o[n]=r},function(r){return o[n]={error:r}})}):void 0},o=[],o.add=function(r){return r.streamable?(this.push(r),c()):void 0},o.remove=function(r,t){return i.current.index===r?i.stop():i.current.index>r&&(i.current.index-=1),this.splice(r,1),t&&t.stopPropagation(),c()},o.clear=function(){return this.length=0,i.stop(),c()},o.save=c,i={current:{},play:function(){if(null!=this.current.sound){if(this.current.sound.paused)return this.current.sound.play()}else if(o.length)return this.playTrack(0)},togglePause:function(){var r;return null!=(r=this.current.sound)?r.togglePause():void 0},playTrack:function(e){return e===this.current.index?this.seek(0):(this.stop(),this.current={track:o[e],index:e},n.trackTitle=this.current.track.title,r.streamTrack(this.current.track.id).then(function(r){return function(n){return console.log("GOT SOUND",n),r.current.track===o[e]?(n.play(),r.current.sound=n,r.current.interval=t(function(){if(r.current.position=r.current.sound.position,"loading"===s[r.current.sound.readyState]);else{if("error"===s[r.current.sound.readyState])return r.current.track.error=!0,r.next();if(r.current.sound.position===r.current.sound.duration)return r.next()}},1e3)):void 0}}(this),function(r){return o[e].error=r}))},pause:function(){var r;return null!=(r=this.current.sound)?r.pause():void 0},next:function(){var r;return this.playTrack(null!=this.current.sound&&(r=this.current.index+1,r<o.length)?r:0)},prev:function(){var r;return this.playTrack(null!=this.current.sound&&(r=this.current.index-1,r>=0)?r:o.length-1)},seek:function(r){var t;if(null!=this.current.sound)return t=r*this.current.sound.duration,this.current.position=t,this.current.sound.setPosition(t)},stop:function(){var r;return t.cancel(this.current.interval),null!=(r=this.current.sound)&&r.stop(),this.current={},n.trackTitle=null}},{link:function(r){return r.playlist=o,r.player=i,e()}}}]);
angular.module("sc2.directives").directive("seek",[function(){return{link:function(e,n){return n.on("click",function(n){var r,t,i;return t=n.offsetX||n.layerX,r=t/(null!=(i=n.target)?i.offsetWidth:void 0),r?e.$apply(function(){return e.player.seek(r)}):void 0})}}}]);
angular.module("sc2.directives").directive("songFinder",["$sc",function(e){return{replace:!0,scope:!0,templateUrl:"views/song-finder.html",controller:["$scope",function(r){return r.tracks=[],r.search={query:""},r.$watch("search.query",_.debounce(function(){return 0===r.search.query.length?r.$apply(function(){return r.tracks=[]}):(r.$apply(function(){return r.loading=!0}),e.searchTracks(r.search.query,10).then(function(e){return console.log("TRACKS",e),r.tracks=e})["finally"](function(){return r.loading=!1}))},300))}]}}]);
angular.module("sc2.filters").filter("playTime",function(){return function(e){var r,t,l;return r=Math.floor(e/36e5),t=""+Math.floor(e%36e5/6e4),l="0"+Math.floor(e%6e4/1e3),t=t.substr(t.length-2),l=l.substr(l.length-2),isNaN(l)?"0:00":r?""+r+":"+t+":"+l:""+t+":"+l}});
angular.module("sc2.filters").filter("resizeArt",function(){return function(r,e){return r?r.replace("large.jpg","t"+e+"x"+e+".jpg"):""}});
angular.module("sc2.services").service("$sc",["$q",function(e){var r;return SC.initialize({client_id:"7f5d27e4fc4e7c52527da9a5ebda2668"}),r=function(e){return function(r,t){return null!=t?e.reject(t):e.resolve(r)}},{get:function(t,n){var c;return null==n&&(n={}),c=e.defer(),SC.get(t,n,r(c)),c.promise},getTracks:function(e){return this.get("/tracks",e)},getTrackById:function(e){return this.get("/tracks/"+e)},searchTracks:function(e,r){return this.getTracks({q:e,limit:r})},streamTrack:function(t){var n;return n=e.defer(),SC.stream("/tracks/"+t,r(n)),n.promise},resolve:function(t){var n;return n=e.defer(),SC.get("/resolve",{url:t},r(n)),n.promise}}}]);