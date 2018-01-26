var Memory;

Memory = (function() {
  function Memory(cover, images, options) {
    if (options == null) {
      options = {};
    }
    this.options = {
      game_class: '.game',
      selected_class: '.active',
      find_class: '.find',
      onLoaded: function() {},
      onStart: function() {},
      onClick: function(clicks, min_clicks) {},
      onEnd: function(time, clicks, min_clicks) {}
    };
    this.options = $.extend(this.options, options);
    this.cover = cover;
    this.cards = images;
    this.clicks = 0;
    this.start_time = false;
    this.timeout = false;
    this.elements_selected = this.options.game_class + " ul li" + this.options.selected_class;
    this.elements_find = this.options.game_class + " ul li" + this.options.find_class;
    this.initialize();
  }

  Memory.prototype.initialize = function() {
    var preloadimgs;
    preloadimgs = $('<div />').css('display', 'none');
    $.each(this.cards, (function(_this) {
      return function(i, el) {
        var img;
        img = $('<img >').attr('src', el);
        return preloadimgs.append(img);
      };
    })(this));
    return preloadimgs.imagesLoaded().always((function(_this) {
      return function(instance) {
        _this.generateMemory();
        _this.addEvents();
        return _this.options.onLoaded();
      };
    })(this));
  };

  Memory.prototype.addEvents = function() {
    return $(this.options.game_class + " ul li").on('click', (function(_this) {
      return function(e) {
        var el, img;
        e.preventDefault();
        el = $(e.target);
        if (el.hasClass(_this.name(_this.options.selected_class)) || el.hasClass(_this.name(_this.options.find_class))) {
          return;
        }
        _this.onClick();
        if ($(_this.elements_selected).length > 1) {
          clearTimeout(_this.timeout);
          _this.restartSelectedCards();
        }
        el.addClass(_this.name(_this.options.selected_class));
        img = _this.cards[$(_this.options.game_class + " ul li").index(el)];
        el.css('background-image', "url(" + img + ")");
        if ($(_this.elements_selected).length > 1) {
          return _this.checkPairs();
        }
      };
    })(this));
  };

  Memory.prototype.onClick = function() {
    if (!this.start_time) {
      this.options.onStart();
    }
    if (!this.start_time) {
      this.start_time = new Date().getTime();
    }
    this.clicks++;
    return this.options.onClick(this.clicks, this.cards.length);
  };

  Memory.prototype.checkPairs = function() {
    var img1, img2, time;
    img1 = $(this.elements_selected).eq(0).css('background-image');
    img2 = $(this.elements_selected).eq(1).css('background-image');
    if (img1 === img2) {
      $(this.elements_selected).addClass(this.name(this.options.find_class));
      $(this.elements_selected).removeClass(this.name(this.options.selected_class));
      if (this.cards.length === $(this.elements_find).length) {
        time = new Date().getTime();
        return this.options.onEnd((time - this.start_time) / 1000, this.clicks, this.cards.length);
      }
    } else {
      return this.timeout = setTimeout((function(_this) {
        return function() {
          return _this.restartSelectedCards();
        };
      })(this), 1000);
    }
  };

  Memory.prototype.restartSelectedCards = function() {
    $(this.elements_selected).css('background-image', "url(" + this.cover + ")");
    return $(this.elements_selected).removeClass(this.name(this.options.selected_class));
  };

  Memory.prototype.generateMemory = function() {
    var game;
    this.cards = this.shuffle(this.cards.concat(this.cards));
    game = $('<ul />');
    $.each(this.cards, (function(_this) {
      return function(i, el) {
        var li;
        li = $('<li />');
        li.css('background-image', "url(" + _this.cover + ")");
        return game.append(li);
      };
    })(this));
    return $("" + this.options.game_class).append(game);
  };

  Memory.prototype.shuffle = function(array) {
    var currentIndex, randomIndex, temporaryValue;
    currentIndex = array.length;
    temporaryValue = void 0;
    randomIndex = void 0;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  Memory.prototype.name = function(name) {
    return name.substr(1);
  };

  return Memory;

})();
