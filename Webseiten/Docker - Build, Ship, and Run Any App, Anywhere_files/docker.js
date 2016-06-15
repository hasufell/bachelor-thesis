window.$body = $('body');

window.$window = $(window);

window.WAITING = 0;

window.READY = 1;

window.BEGUN = 2;

window.BREAK_SMALL = 640;

window.BREAK_MEDIUM = 1024;

window.THEME_URL = '';

window.BASE_URL = '/cache.php?request=';

window.NO_CACHE_BASE_URL = '';

var init_root;

init_root = function($scope, $rootScope) {
  var _all_finished_triggered, _all_images_loaded, _all_requests_finished, all_finished, all_requests_finished, execute_lazy_load, outstanding_requests, scheduled_to_load, watch_all_finished, watch_request_finished, watch_requests_finished, watch_window_load, watch_window_resize, watch_window_scroll;
  $rootScope.lazy_load_state = WAITING;
  $rootScope.theme_url = THEME_URL;
  scheduled_to_load = [];
  outstanding_requests = 0;
  watch_request_finished = {};
  watch_requests_finished = [];
  watch_all_finished = [];
  _all_requests_finished = true;
  _all_images_loaded = true;
  _all_finished_triggered = false;
  watch_window_resize = [];
  watch_window_load = [];
  watch_window_scroll = [];
  $rootScope.window_properties = {};
  $rootScope.schedule_lazy_load = function(callback) {
    _all_images_loaded = false;
    scheduled_to_load.push(callback);
    if ($rootScope.lazy_load_state === READY) {
      return execute_lazy_load();
    }
  };
  execute_lazy_load = function() {
    var callback;
    callback = scheduled_to_load.shift();
    if (callback) {
      $rootScope.lazy_load_state = BEGUN;
      return callback(function() {
        return execute_lazy_load();
      });
    } else {
      $rootScope.lazy_load_state = READY;
      _all_images_loaded = true;
      return all_finished();
    }
  };
  $rootScope.clear_lazy_load = function() {
    scheduled_to_load = [];
    return $rootScope.lazy_load_state = READY;
  };
  $rootScope.on_window_load = function(callback) {
    if ($rootScope.loaded) {
      return callback();
    } else {
      return watch_window_load.push(callback);
    }
  };
  $rootScope.on_window_scroll = function(callback, trigger_immediately) {
    watch_window_scroll.push(callback);
    if (trigger_immediately) {
      return callback();
    }
  };
  $rootScope.on_window_resize = function(callback, trigger_immediately) {
    watch_window_resize.push(callback);
    if (trigger_immediately) {
      return callback();
    }
  };
  $rootScope.on_request_finished = function(request_path, callback) {
    return watch_request_finished[request_path] = callback;
  };
  $rootScope.on_requests_finished = function(callback) {
    _all_requests_finished = false;
    return watch_requests_finished.push(callback);
  };
  $rootScope.on_all_finished = function(callback) {
    return watch_all_finished.push(callback);
  };
  all_requests_finished = function() {
    angular.forEach(watch_requests_finished, function(callback) {
      return callback();
    });
    _all_requests_finished = true;
    return all_finished();
  };
  all_finished = function() {
    if (_all_finished_triggered) {
      return;
    }
    if (_all_requests_finished && _all_images_loaded) {
      _all_finished_triggered = true;
      return angular.forEach(watch_all_finished, function(callback) {
        return callback();
      });
    }
  };
  $rootScope.on_window_resize(function() {
    var mobile;
    mobile = $rootScope.window_properties.width < BREAK_SMALL ? true : false;
    if ($rootScope.mobile !== mobile) {
      $rootScope.mobile_state_change = true;
    } else {
      $rootScope.mobile_state_change = false;
    }
    return $rootScope.mobile = mobile;
  });
  $rootScope.on_all_finished(function() {
    return $body.addClass('all_loaded');
  });
  $rootScope.on_window_load(function() {
    $rootScope.loaded = true;
    $rootScope.lazy_load_state = READY;
    if (!$rootScope.$$phase) {
      $rootScope.$digest();
    }
    return execute_lazy_load();
  });
  $(window).scroll(function() {
    return angular.forEach(watch_window_scroll, function(value) {
      return value();
    });
  });
  $(window).load(function() {
    return angular.forEach(watch_window_load, function(value) {
      return value();
    });
  });
  $(window).resize(function() {
    $rootScope.window_properties.height = $(this).height();
    $rootScope.window_properties.width = $(this).width();
    angular.forEach(watch_window_resize, function(value) {
      return value();
    });
    if (!$rootScope.$$phase) {
      return $rootScope.$apply();
    }
  }).trigger('resize');
  $scope.$on('$locationChangeSuccess', function(event) {
    return $rootScope.new_page();
  });
  $rootScope.new_page = function() {
    _all_finished_triggered = false;
    _all_images_loaded = true;
    _all_requests_finished = true;
    return $body.removeClass('all_loaded');
  };
  return $rootScope.request = function(base_url, path, menu_path, callback) {
    outstanding_requests += 1;
    if (!menu_path) {
      menu_path = '';
    }
    return $.get(base_url + path + menu_path, function(response) {
      outstanding_requests -= 1;
      callback(response);
      if (watch_request_finished[path]) {
        watch_request_finished[path]();
        delete watch_request_finished[path];
      }
      if (outstanding_requests === 0) {
        return all_requests_finished();
      }
    });
  };
};

var SimpleHelpers, json_action;

SimpleHelpers = angular.module('SimpleHelpers', []);

SimpleHelpers.directive("lazyBackground", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.schedule_lazy_load(function(done) {
        var image, loaded, timeout, url;
        if ($rootScope.window_properties.width <= BREAK_SMALL) {
          url = attrs.smallLazyBackground;
        } else {
          url = attrs.lazyBackground;
        }
        if (!url) {
          return done();
        }
        image = $('<img class="preloader" />');
        timeout = null;
        loaded = function() {
          clearTimeout(timeout);
          element.css('background-image', 'url("' + url + '")');
          setTimeout(function() {
            element.addClass('loaded');
            return element.trigger('loaded');
          }, parseInt(attrs.lazyDelay) || 0);
          image.unbind('load');
          image.remove();
          return done();
        };
        timeout = setTimeout(loaded, 1000);
        image.load(loaded);
        return image.attr('src', url);
      });
    }
  };
});

SimpleHelpers.directive("lazyImage", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.schedule_lazy_load(function(done) {
        var loaded, timeout, url;
        url = attrs.lazyImage;
        timeout = null;
        loaded = function(e) {
          clearTimeout(timeout);
          element.attr('src', url);
          element.addClass('loaded');
          element.unbind('load');
          element.trigger('loaded');
          return done();
        };
        element.load(loaded);
        return element.attr('src', url);
      });
    }
  };
});

SimpleHelpers.directive("matchWindowHeight", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var match_height, mobile_offset, normal_offset, offsets, only_once, ref;
      only_once = (ref = attrs.matchOnlyOnce !== void 0) != null ? ref : {
        "true": false
      };
      if (attrs.matchWindowHeight.match(/^-?[0-9|-]+$/)) {
        offsets = attrs.matchWindowHeight.split('|');
        normal_offset = parseInt(offsets[0]);
        if (offsets[1]) {
          mobile_offset = parseInt(offsets[1]);
        }
      } else {
        normal_offset = -$(attrs.matchWindowHeight).height();
      }
      match_height = function(window_properties) {
        var offset;
        if ($rootScope.mobile && mobile_offset) {
          offset = mobile_offset;
        } else {
          offset = normal_offset;
        }
        return element.css('height', window_properties.height + offset);
      };
      if (only_once) {
        return match_height($rootScope.window_properties);
      } else {
        return $rootScope.$watch('window_properties', function(new_value, old_value) {
          return match_height(new_value);
        }, true);
      }
    }
  };
});

SimpleHelpers.directive("centerHorizontally", function($rootScope, $timeout) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var set_margin;
      set_margin = function() {
        if (!$rootScope.window_properties.width) {
          return;
        }
        if (element.width() > $rootScope.window_properties.width) {
          return element.css('margin-left', -(element.width() - $rootScope.window_properties.width) / 2);
        } else {
          return element.css('margin-left', -element.width() / 2);
        }
      };
      $rootScope.on_window_resize(set_margin);
      return $timeout(set_margin);
    }
  };
});

SimpleHelpers.directive("centerVertically", function($rootScope, $timeout) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var set_margin;
      set_margin = function() {
        return element.css('marginTop', -element.height() / 2);
      };
      element.addClass('center-vertically');
      $rootScope.on_window_resize(set_margin);
      return $timeout(set_margin);
    }
  };
});

SimpleHelpers.directive("parallax", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var base, scroll_element, travel, wh;
      if (!$rootScope.mobile) {
        travel = parseInt(attrs.parallax);
        base = parseInt(attrs.parallaxBase);
        scroll_element = element;
        if (attrs.parallaxContainer) {
          scroll_element = $(attrs.parallaxContainer);
        }
        wh = $rootScope.window_properties.height;
        return $rootScope.on_window_scroll(function() {
          var current_travel, option, parallax_end, parallax_percent, parallax_start;
          parallax_start = Math.max(scroll_element.offset().top - wh, 0);
          parallax_end = parallax_start + wh + scroll_element.height();
          parallax_percent = Math.max($window.scrollTop() - parallax_start, 0) / parallax_end;
          current_travel = base + (travel * parallax_percent - travel / 2);
          option = current_travel + 'px';
          return element.css('top', option);
        });
      }
    }
  };
});

SimpleHelpers.directive("onLoaded", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return element.on('loaded', function() {
        return json_action(eval('(' + attrs.onLoaded + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onOtherLoaded", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $(attrs.onOtherLoadedSelector).on('loaded', function() {
        return json_action(eval('(' + attrs.onOtherLoaded + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onWindowLoad", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.on_window_load(function() {
        return json_action(eval('(' + attrs.onWindowLoad + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onRequestFinished", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.on_request_finished(attrs.onRequestFinished, function() {
        return json_action(eval('(' + attrs.onRequestFinishedAction + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onRequestsFinished", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.on_requests_finished(function() {
        return json_action(eval('(' + attrs.onRequestsFinished + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onAllFinished", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $rootScope.on_all_finished(function() {
        return json_action(eval('(' + attrs.onAllFinished + ')'), element);
      });
    }
  };
});

SimpleHelpers.directive("onVisible", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return setTimeout(function() {
        var becomes_visible, offset, on_scroll, wh;
        if (attrs.onVisibleOffset) {
          if (attrs.onVisibleOffset.indexOf('%') > -1) {
            offset = $window.height() * (parseInt(attrs.onVisibleOffset) / 100);
          } else {
            offset = parseInt(attrs.onVisibleOffset);
          }
        }
        offset = offset || 0;
        wh = $rootScope.window_properties.height;
        becomes_visible = element.offset().top - wh + offset;
        on_scroll = function() {
          if ($window.scrollTop() > becomes_visible) {
            json_action(eval('(' + attrs.onVisible + ')'), element);
            return $window.unbind('scroll', on_scroll);
          }
        };
        $window.scroll(on_scroll);
        return $window.trigger('scroll');
      }, 100);
    }
  };
});

SimpleHelpers.directive("loadBlock", function($rootScope, $location) {
  return {
    restrict: "AE",
    link: function(scope, element, attrs) {
      var menu_path;
      menu_path = attrs.menuPath || '';
      if (!menu_path && attrs.includePath) {
        menu_path = $location.path();
      }
      return $rootScope.request(BASE_URL, '/load/blocks/' + attrs.loadBlock, menu_path, function(response) {
        element.html(response);
        return element.trigger('loaded');
      });
    }
  };
});

SimpleHelpers.directive("loadJson", function($rootScope) {
  return {
    restrict: "AE",
    link: function(scope, element, attrs) {
      return $rootScope.request(BASE_URL, attrs.loadJson, '', function(response) {
        scope.data = JSON.parse(response);
        scope.$apply();
        return element.trigger('loaded');
      });
    },
    template: function(tElement, tAttrs) {
      return tElement.html();
    }
  };
});

SimpleHelpers.directive("loadBlockRegion", function($rootScope, $compile, $location) {
  return {
    restrict: "AE",
    link: function(scope, element, attrs) {
      var menu_path;
      menu_path = attrs.menuPath || '';
      if (!menu_path && attrs.includePath) {
        menu_path = $location.path();
      }
      return $rootScope.request(BASE_URL, '/load/block_region/' + attrs.loadBlockRegion, menu_path, function(response) {
        var template;
        template = $(response);
        element.append(template);
        $compile(template)(scope);
        element.trigger('loaded');
        if (attrs.jsScrollbar !== void 0) {
          if (!$rootScope.mobile) {
            return element.parent().nanoScroller({
              preventPageScrolling: true
            });
          }
        }
      });
    }
  };
});

SimpleHelpers.directive("loadHtml", function($rootScope, $compile) {
  return {
    restrict: "AE",
    link: function(scope, element, attrs) {
      return $rootScope.request(BASE_URL, attrs.loadHtml, false, function(response) {
        var template;
        template = $(response);
        element.append(template);
        $compile(template)(scope);
        return element.trigger('loaded');
      });
    }
  };
});

SimpleHelpers.directive("prependTo", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return element.prependTo(attrs.prependTo);
    }
  };
});

SimpleHelpers.filter('classify', function() {
  return function(input) {
    if (input) {
      return input.toLowerCase().replace(/[^a-z]+/g, '_');
    }
    return '';
  };
});

SimpleHelpers.directive("portraitOrLandscape", function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var detect, only_once, ref;
      only_once = (ref = attrs.setOnlyOnce !== void 0) != null ? ref : {
        "true": false
      };
      detect = function() {
        if ($window.height() > $window.width()) {
          element.addClass('portrait');
          return element.removeClass('landscape');
        } else {
          element.addClass('landscape');
          return element.removeClass('portrait');
        }
      };
      if (only_once) {
        detect($rootScope.window_properties);
      } else {
        $rootScope.on_window_resize = function() {
          return detect();
        };
      }
      return detect();
    }
  };
});

SimpleHelpers.directive("activeTrail", function($location) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var links, set_active_trail;
      links = element.find('a');
      set_active_trail = function() {
        return angular.forEach(links, function(link) {
          var uri;
          link = $(link);
          uri = URI();
          if (link.attr('href') === uri.path()) {
            return link.addClass('active');
          } else {
            return link.removeClass('active');
          }
        });
      };
      set_active_trail();
      return scope.$on('$routeChangeSuccess', function(current) {
        return set_active_trail();
      });
    }
  };
});

SimpleHelpers.directive("cycleChildren", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var autoPlay, children, cycleNav, i, navButtons, showSlide, timeout;
      autoPlay = parseInt(attrs.autoPlay);
      children = element.find('> *');
      timeout = null;
      i = 0;
      if (children.length > 1) {
        cycleNav = $('<ul class="cycle_nav"></ul>');
        angular.forEach(children, function() {
          return cycleNav.append('<li></li>');
        });
        cycleNav.appendTo(element);
        cycleNav.on('click', 'li', function() {
          return showSlide($(this).index());
        });
        navButtons = cycleNav.find('li');
      }
      showSlide = function(i) {
        if (i > children.length - 1) {
          i = 0;
        }
        clearTimeout(timeout);
        if (navButtons) {
          navButtons.removeClass('active').eq(i).addClass('active');
        }
        children.removeClass('active').eq(i).addClass('active');
        if (autoPlay && children.length > 1) {
          return timeout = setTimeout(function() {
            return showSlide(i + 1);
          }, autoPlay);
        }
      };
      return children.eq(0).on('loaded', function() {
        showSlide(i);
        return element.addClass('active');
      });
    }
  };
});

SimpleHelpers.directive("tabbedContent", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var links, panels;
      links = element.find('a');
      panels = $(attrs.tabbedContent + ' [panel]');
      links.click(function() {
        links.removeClass('active');
        $(this).addClass('active');
        panels.removeClass('active').filter('[panel=' + $(this).attr('panel') + ']').addClass('active');
        $window.trigger('resize');
        return false;
      });
      return links.eq(0).trigger('click');
    }
  };
});

SimpleHelpers.directive("osSpecificLink", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $window.load(function() {
        var href, os, re;
        os = platform.os.family.toLowerCase();
        re = new RegExp("windows|mac|linux", "g");
        href = element.attr('href');
        if (os.indexOf('windows') > -1) {
          element.attr('href', href.replace(re, 'windows'));
        }
        if (os.indexOf('mac') > -1) {
          return element.attr('href', href.replace(re, 'mac'));
        } else if (os.indexOf('linux centos debian fedora gentoo gnewsense kubuntu mandriva mageia mandriva red hat slackware suse turbolinux ubuntu limo') > -1) {
          return element.attr('href', href.replace(re, 'linux'));
        }
      });
    }
  };
});

json_action = function(actions, element) {
  var delay, speed, transition;
  transition = actions.animate;
  delay = actions.delay || 0;
  if (transition) {
    speed = transition.speed || 700;
    delete transition.speed;
    setTimeout(function() {
      return element.velocity(transition, speed);
    }, delay);
  }
  if (actions["class"]) {
    element.addClass(actions["class"]);
  }
  if (actions.play_video) {
    return element.get(0).play();
  }
};

var Docker;

window.Docker = Docker = angular.module('Docker', ['SimpleHelpers', 'ngSanitize', 'ngAnimate', 'ngTouch']);

Docker.controller('DockerController', function($rootScope, $scope) {
  var getCookie, userName;
  init_root($scope, $rootScope);
  $rootScope.on_window_resize(function() {
    if ($('#content').height() + $('footer').height() + 20 < $window.height()) {
      return $body.addClass('short');
    } else {
      return $body.removeClass('short');
    }
  }, true);
  getCookie = function(cname) {
    var c, ca, cookie, i, len, name;
    name = cname + "=";
    ca = document.cookie.split(';');
    for (i = 0, len = ca.length; i < len; i++) {
      cookie = ca[i];
      c = cookie.trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };
  userName = getCookie('docker_sso_username');
  if (userName) {
    $('a[href="/support"]').attr('href', 'http://support.docker.com');
    $('ul.nav-global a[href="https://hub.docker.com/account/signup/"]').text('Logout').attr('href', 'https://hub.docker.com/account/logout/?next=/');
    return $('ul.nav-global a.button').text('Go to Hub').attr('href', 'https://hub.docker.com/');
  }
});

Docker.controller('EventsController', function($scope, $rootScope, $timeout) {
  $scope.events = $.parseJSON($('#event_data').html());
  $scope.searchType = 'upcoming';
  $scope.searchRegion = 'any';
  $scope.searchMeetupType = 'any';
  $timeout(function() {
    $('.event.static').remove();
    return $('.search-results').addClass('loaded');
  });
  $scope.filterEvents = function() {
    if (!$scope.searchString && !$scope.searchMeetupType && !$scope.searchRegion) {
      $scope.filtered = $scope.events.slice(0, 50);
      return;
    }
    $scope.filtered = [];
    angular.forEach($scope.events, function(ev) {
      var include;
      include = true;
      if (!ev.field_meetup_type) {
        ev.field_meetup_type = '';
      }
      if (!ev.upcoming) {
        include = false;
      }
      if (!ev.field_region) {
        return;
      }
      if ($scope.searchString) {
        if (!ev.searchableText.includes($scope.searchString.toLowerCase())) {
          include = false;
        }
      }
      if ($scope.searchMeetupType !== 'any' && $scope.searchMeetupType.toLowerCase().trim() !== ev.field_meetup_type.toLowerCase().trim()) {
        include = false;
      }
      if ($scope.searchRegion !== 'any' && $scope.searchRegion.toLowerCase() !== ev.field_region.toLowerCase()) {
        include = false;
      }
      if (include) {
        return $scope.filtered.push(ev);
      }
    });
    return $scope.filtered = $scope.filtered.slice(0, 100);
  };
  return $scope.filterEvents();
});

Docker.controller('CustomersController', function($scope, $rootScope, $timeout) {
  $scope.customers = $('.customers .customer');
  $scope.details = $('.customers .customer-details');
  return $scope.showDetails = function(i) {
    var details;
    $scope.details.removeClass('open');
    $scope.customers.eq(i);
    details = $scope.details.eq(i);
    details.insertAfter($scope.customers.eq(i + 3 - i % 4));
    details.addClass('open');
  };
});

Docker.controller('ContributeController', function($scope, $rootScope, $timeout) {
  var connections, fuzzyMatch, i, loadIframe, repos;
  repos = $('ul.repos li');
  connections = 0;
  i = 0;
  loadIframe = function() {
    var iframe;
    iframe = repos.eq(i).find('iframe');
    iframe.attr('src', iframe.attr('_src'));
    connections += 1;
    i += 1;
    if (repos.length > i && connections <= 3) {
      loadIframe();
    }
    return iframe.load(function() {
      connections -= 1;
      if (repos.length > i && connections <= 3) {
        return loadIframe();
      }
    });
  };
  loadIframe();
  fuzzyMatch = function(str, pattern) {
    pattern = pattern.split("").reduce(function(a, b) {
      return a + ".* " + b;
    });
    return (new RegExp(pattern)).test(str);
  };
  return $scope.filterRepos = function() {
    repos.each(function() {
      if ($(this).attr('name').score($scope.searchString) > .2 || !$scope.searchString) {
        return $(this).show();
      } else {
        return $(this).hide();
      }
    });
  };
});

Docker.controller('SelectContentController', function($scope, $rootScope, $element, $timeout) {
  $scope.$watch('selectData', function(newValue, oldValue) {
    if (newValue) {
      $scope.selectOptions = newValue.split(',');
      $scope.displayedContent = $scope.selectOptions[0];
      return $scope.ChangeContent();
    }
  });
  return $scope.ChangeContent = function() {
    var i;
    i = $('option[label="' + this.displayedContent + '"]').index();
	if ($('option[label="' + this.displayedContent + '"]').index() == -1) { i = 0; }
    $element.find('.select-content').hide().eq(i).show();
	//console.log(i);
	//console.log($('option[label="' + this.displayedContent + '"]').index());
  };
  
});

Docker.controller('TeamController', function($scope, $rootScope, $element, $timeout) {
  var links, select;
  links = $element.find('a[href^="#"]');
  select = null;
  $('#grnhse_iframe').load(function() {
    return select = $('#grnhse_iframe').contents().find('#departments-select');
  });
  return links.click(function() {
    var evt, team, val;
    $('html, body').animate({
      scrollTop: $("#grnhse_iframe").offset().top - 100
    }, 750);
    if (select) {
      team = $(this).attr('href').replace('#', '');
      val = select.find('option:contains("' + team + '")').attr('value');
      select.val(val);
      if (document.createEvent != null) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        select.get(0).dispatchEvent(evt);
      } else {
        select.get(0).fireEvent("onchange");
      }
    }
    return false;
  });
});

Docker.controller('ManagementController', function($scope, $rootScope, $element, $timeout) {
  $(window).on('load resize', function() {
    if (Modernizr.mq('only screen and (min-width: 58.8125em)')) {
      return $scope.columns = 4;
    } else if (Modernizr.mq('only screen and (min-width: 40.0625em)')) {
      return $scope.columns = 3;
    } else {
      return $scope.columns = 2;
    }
  });
  return $('a.more').click(function() {
    var columns, details, n, parent_li, parent_ul, row;
    $('.current').remove();
    $('.selected').removeClass('selected');
    parent_ul = $(this).parents('ul');
    parent_li = $(this).parents('li');
    details = parent_li.find('.bio-details').clone();
    n = parent_li.index();
    columns = $scope.columns;
    row = Math.floor(n / $scope.columns) + 1;
    $(this).parents('li').addClass('selected');
    if ((parent_ul.find('li').eq(row * columns - 1)[0])) {
      return details.insertAfter(parent_ul.find('li').eq(row * columns - 1)).addClass('current');
    } else {
      return details.insertAfter(parent_ul.find('li:last-child')).addClass('current');
    }
  });
});

Docker.controller('PartnersController', function($scope, $rootScope, $element, $timeout) {
  var content;
  content = $('.page-content > .row').offset().top - 30;
  return $(window).scroll(function() {
    if (content < $(window).scrollTop() && Modernizr.mq('only screen and (min-width: 58.8125em)')) {
      return $('.page-content .large-3 ul').addClass('fixed-bar');
    } else {
      return $('.page-content .large-3 ul').removeClass('fixed-bar');
    }
  });
});

Docker.controller('NewsController', function($scope, $rootScope, $timeout) {
  var newsPage;
  $scope.moreNews = true;
  newsPage = 1;
  $scope.news = [];
  return $scope.loadMore = function(type) {
    return $.get('/api/news-and-press?type=' + type + '&page=' + newsPage, function(response) {
      if (response) {
        newsPage += 1;
        response = $.parseJSON(response);
        $scope.moreNews = response.more;
        $scope.news = $scope.news.concat(response.news);
        return $scope.$apply();
      }
    });
  };
});

Docker.controller('SocialCountController', function($scope, $rootScope, $timeout) {
  return $(window).load(function() {
    return $('.social a').click(function(e) {
      window.social = $(this).attr('class');
      window.project = $(this).parents('.hack_idea').attr('id');
      return $.ajax({
        type: "POST",
        url: '/count/' + window.project + '/' + window.social,
        async: true,
        cache: false,
        success: function(response) {
          return window.project = window.social = '';
        }
      });
    });
  });
});
