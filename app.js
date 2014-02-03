var dependencies;

angular.module('sc2.services', []);

angular.module('sc2.filters', []);

angular.module('sc2.directives', []);

dependencies = ['sc2.services', 'sc2.filters', 'sc2.directives', 'ui.router'];

angular.module('sc2', dependencies).config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/',
      templateUrl: 'views/app.html',
      controller: 'MainCtrl'
    });
    return $urlRouterProvider.otherwise('/');
  }
]);

angular.module('sc2').controller('MainCtrl', [
  '$scope', '$sc', function($scope, $sc) {
    $scope.tracks = [];
    $scope.search = {
      query: 'flume'
    };
    $scope.$watch('search.query', _.debounce(function() {
      if ($scope.search.query.length === 0) {
        return $scope.tracks = [];
      }
      return $sc.searchTracks($scope.search.query, 10).then(function(tracks) {
        console.log('TRACKS', tracks);
        return $scope.tracks = tracks;
      });
    }, 300));
    return $scope.getBiggerArt = function(url, size) {
      if (!url) {
        return '';
      }
      return url.replace('large.jpg', "t" + size + "x" + size + ".jpg");
    };
  }
]);

angular.module('sc2.directives').directive('playlist', [
  '$sc', function($sc) {
    return {
      link: function(scope, element, attrs) {
        var playlist;
        scope.playlist = playlist = [];
        return scope.player = {
          current: {},
          play: function() {
            var _ref;
            if ((_ref = this.current.sound) != null ? _ref.paused : void 0) {
              return this.current.sound.play();
            } else if (playlist.length) {
              return this._setTrack(0);
            }
          },
          playTrack: function(index) {
            return this._setTrack(index);
          },
          _setTrack: function(index) {
            var _ref;
            if ((_ref = this.current.sound) != null) {
              _ref.pause();
            }
            this.current = {
              track: playlist[index],
              index: index
            };
            return $sc.streamTrack(this.current.track.id).then((function(_this) {
              return function(sound) {
                console.log('GOT SOUND', sound);
                if (_this.current.track === playlist[index]) {
                  sound.play();
                  return _this.current.sound = sound;
                }
              };
            })(this), function(error) {
              return playlist[index].error = error;
            });
          },
          pause: function() {
            var _ref;
            return (_ref = this.current.sound) != null ? _ref.pause() : void 0;
          },
          skip: function() {
            var next;
            if (this.current.sound != null) {
              next = this.current.index + 1;
              if (next !== playlist.length) {
                return this._setTrack(next);
              }
            }
            return this._setTrack(0);
          },
          prev: function() {
            var prev;
            if (this.current.sound != null) {
              prev = this.current.index - 1;
              if (prev >= 0) {
                return this._setTrack(prev);
              }
            }
            return this._setTrack(playlist.length - 1);
          }
        };
      }
    };
  }
]);

angular.module('sc2.services').service('$sc', [
  '$q', function($q) {
    SC.initialize({
      client_id: '7f5d27e4fc4e7c52527da9a5ebda2668'
    });
    return {
      get: function(path, params) {
        var deferred;
        if (params == null) {
          params = {};
        }
        deferred = $q.defer();
        SC.get(path, params, function(res, err) {
          if (err != null) {
            return deferred.reject(err);
          } else {
            return deferred.resolve(res);
          }
        });
        return deferred.promise;
      },
      getTracks: function(params) {
        return this.get('/tracks', params);
      },
      searchTracks: function(query, limit) {
        return this.getTracks({
          q: query,
          limit: limit
        });
      },
      streamTrack: function(id) {
        var deferred;
        deferred = $q.defer();
        SC.stream("/tracks/" + id, function(res, err) {
          if (err != null) {
            return deferred.reject(err);
          } else {
            return deferred.resolve(res);
          }
        });
        return deferred.promise;
      }
    };
  }
]);
