(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

var _easing = _interopRequireDefault(require("../utility/easing"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Simple linear interpolation helper.
function lerp(a, b, t) {
  t = Math.min(1, Math.max(0, t));
  return a + (b - a) * t;
}

var AlbumScroll = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(AlbumScroll, _Component);

  var _super = _createSuper(AlbumScroll);

  function AlbumScroll(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, AlbumScroll);
    _this = _super.call(this, "albumScroll");
    site.components.attachToPages(["audio"], (0, _assertThisInitialized2["default"])(_this));
    _this.browser = site.browser;
    _this.navigation = site.navigation;
    _this.swup = site.navigation.swup;
    _this.nav = site.components.getComponent("menu");
    _this.ready = false;

    _this.browser.addToRenderLoop(_this.animate.bind((0, _assertThisInitialized2["default"])(_this)));

    return _this;
  }

  (0, _createClass2["default"])(AlbumScroll, [{
    key: "mount",
    value: function mount(site) {
      var _this2 = this;

      this.container = document.getElementById("audio-albums");
      if (!this.container) return;
      this.cardEls = this.container.querySelectorAll(".audioHeader");
      if (this.cardEls.length == 0) return;
      this.cards = [];
      this.cardEls.forEach(function (el, i) {
        var card = {
          el: el,
          cover: el.querySelector(".audioHeader__cover"),
          cat: el.getAttribute("data-category"),
          hidden: false
        };

        _this2.cards.push(card);

        el.addEventListener("click", _this2.enterCard.bind(_this2, card));
      });
      this.filterContainer = document.getElementById("audio-filter");
      this.filterOptions = Array.from(this.filterContainer.querySelectorAll(".filter__option"));
      this.filterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
          // Update active state on filter options.
          _this2.filterOptions.forEach(function (opt) {
            return opt.classList.remove("active");
          });

          option.classList.add("active"); // Get filter value from data attribute (fallback to text content if empty).

          var filterValue = option.getAttribute("data-filter");

          if (!filterValue) {
            filterValue = option.textContent.trim().toLowerCase();

            if (filterValue === "all") {
              filterValue = "";
            }
          }

          _this2.applyFilter(filterValue);
        });
      });
      this.entry = 1;
      this.ready = true;
    }
  }, {
    key: "applyFilter",
    value: function applyFilter(filterValue) {
      var _this3 = this;

      this.entryTarget = 1;
      this.container.classList.add("out");
      this.browser.state.lenis.scrollTo(0);
      this.entry = 1;
      setTimeout(function () {
        _this3.cards.forEach(function (c) {
          if (filterValue == "" || c.cat == filterValue) {
            c.el.classList.remove("hide");
            c.hidden = false;
          } else {
            c.el.classList.add("hide");
            c.hidden = true;
          }
        });

        setTimeout(function () {
          _this3.container.classList.remove("out");
        }, 10);
      }, 500);
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.ready = false;
      this.entering = false;
    }
  }, {
    key: "createElementFromHTML",
    value: function createElementFromHTML(htmlString) {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim(); // Change this to div.childNodes to support multiple top-level nodes.

      return div.firstChild;
    }
  }, {
    key: "enterCard",
    value: function enterCard(card, e) {
      var _this4 = this;

      e.preventDefault();
      this.entering = true;
      this.container.classList.add("entering");
      this.browser.state.lenis.stop();
      document.documentElement.classList.add("in-transition");
      document.documentElement.classList.add("album-transition");
      card.el.classList.add("active");
      var bounds = card.el.getBoundingClientRect();
      var top = bounds.top / this.browser.state.rem - 5;
      this.container.style.transform = "translateY(" + top * -1 + "rem)";
      card.cover.style.transform = "translateY(0rem) rotate(0deg)";
      this.nav.setMenuColor(card.el.style.backgroundColor, !card.el.classList.contains("dark")); // here lets load the content

      var url = card.el.querySelector(".audioHeader__link").href; // await this.swup.preload('/path/to/page');

      var data = null;
      var animComplete = false;

      var replacePage = function replacePage() {
        _this4.browser.state.lenis.start();

        _this4.browser.state.lenis.scrollTo(0, {
          immediate: true,
          force: true
        });

        document.documentElement.classList.remove("in-transition");
        document.documentElement.classList.remove("album-transition");

        _this4.navigation.exit();

        document.getElementById("main").replaceWith(_this4.createElementFromHTML(data.blocks[0]));
        var state = {
          url: url,
          source: 'swup',
          random: Math.random()
        };
        window.history.pushState(state, "", url);

        _this4.navigation.enter(true);

        _this4.navigation.removeCopy();
      };

      this.swup.preloadPage(url).then(function (e) {
        data = e;
        if (animComplete) replacePage();
      });
      setTimeout(function () {
        // this.swup.loadPage({url: url,  customTransition: '' });
        animComplete = true;
        if (data != null) replacePage();
      }, 700);
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this5 = this;

      if (this == undefined || !this.ready || this.entering) return;
      var rem = this.browser.state.rem;
      var bounds = this.container.getBoundingClientRect();
      var cardHeight = rem * (this.browser.state.isMobile ? 25 : 40);
      var move = this.browser.state.isMobile ? 20 : 30;
      this.entry = lerp(this.entry, 0, 0.06);
      var i = 0;
      this.cards.forEach(function (card) {
        if (!card.hidden) {
          var top = i * cardHeight + bounds.top;
          var p = (window.innerHeight - top) / window.innerHeight - _this5.entry * 2;

          var pb = _easing["default"].easeInOutQuad(Math.min(1, Math.max(0, p)));

          var pos = pb * -move;
          var pc = _easing["default"].easeInOutQuad(p / 1.5) * 1.5;
          pc = lerp(p, pc, 0.5);
          var coverAmt = pc;

          if (_this5.browser.state.isMobile) {
            var coverMove = coverAmt * -20 + 17;
            var coverRot = (coverAmt - 0.5) * 20 * (i % 2 ? -1 : 1);
          } else {
            var coverMove = coverAmt * -30 + 28;
            var coverRot = (coverAmt - 0.5) * 20 * (i % 2 ? -1 : 1);
          }

          if (p > 0 && p < 1.5) {
            card.el.style.transform = "translateY(".concat(pos, "rem)");
            card.cover.style.transform = "translateY(".concat(coverMove, "rem) rotate(").concat(coverRot, "deg)");
          }

          i++;
        }
      });
    }
  }]);
  return AlbumScroll;
}(_component["default"]);

exports["default"] = AlbumScroll;

},{"../utility/easing":26,"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

var _inView = _interopRequireDefault(require("in-view"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Anima = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Anima, _Component);

  var _super = _createSuper(Anima);

  function Anima(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Anima);
    _this = _super.call(this, "anima");
    site.components.mount((0, _assertThisInitialized2["default"])(_this));
    _this.counter = site.components.getComponent("counter");
    site.navigation.registerNavigationCallback(_this.enterPageWithDelay.bind((0, _assertThisInitialized2["default"])(_this), 200));
    _this.t = 50;
    _this.base = 100;
    _this.benter = _this.enter.bind((0, _assertThisInitialized2["default"])(_this));
    _this.bexit = _this.exit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.bclear = _this.clear.bind((0, _assertThisInitialized2["default"])(_this));
    _this.browser = site.browser;

    if (site.browser.state.isMobile) {
      _inView["default"].threshold(0);

      _inView["default"].offset(window.innerHeight * 0.05);
    } else {
      _inView["default"].threshold(0);

      _inView["default"].offset(site.browser.state.rem * 8);
    }

    if (site.edit) document.documentElement.classList.add("no-anima"); // this.spanima();

    return _this;
  }

  (0, _createClass2["default"])(Anima, [{
    key: "mount",
    value: function mount(site) {}
  }, {
    key: "enterPageWithDelay",
    value: function enterPageWithDelay(delay) {
      // do spans first
      // this.spanima();
      if (!delay || delay == 0) this.enterPage();else setTimeout(this.enterPage.bind(this), delay);
    }
  }, {
    key: "enterPage",
    value: function enterPage() {
      // console.log("anima enter page now");
      document.querySelectorAll(".entry").forEach(this.run.bind(this));
      (0, _inView["default"])('.scroll').on('enter', this.run.bind(this));
      (0, _inView["default"])('.scroll').check();
    }
  }, {
    key: "run",
    value: function run(el) {
      if (el.classList.contains("anima")) this.enter(el);
      el.querySelectorAll(".anima").forEach(this.benter);
      el.classList.remove("scroll");
    }
  }, {
    key: "enter",
    value: function enter(el) {
      var _this2 = this;

      if (el.classList.contains("in")) return;
      el.classList.remove("out");
      var delay = Number(el.getAttribute("data-anima-delay")) || (this.browser.state.isMobile ? 1 : 0);
      if (this.browser.state.isMobile && el.classList.contains("smd")) delay = 1;
      setTimeout(function () {
        el.classList.add("in");
        if (el.getAttribute("data-count-to")) _this2.counter.count(el);

        if (el.classList.contains("lottima")) {
          el.querySelector("lottie-player").play();
        }
      }, delay * this.t + this.base);
    }
  }, {
    key: "exit",
    value: function exit(el) {
      el.classList.add("out");
    }
  }, {
    key: "clear",
    value: function clear(el) {
      el.classList.remove("out");
      el.classList.remove("in");
    }
  }, {
    key: "inChildren",
    value: function inChildren(el) {
      if (!el) return;
      var c = el.querySelectorAll(".anima");
      if (!c) return;
      c.forEach(this.benter);
    }
  }, {
    key: "outChildren",
    value: function outChildren(el) {
      if (!el) return;
      var c = el.querySelectorAll(".anima");
      if (!c) return;
      c.forEach(this.bexit);
    }
  }, {
    key: "clearChildren",
    value: function clearChildren(el) {
      if (!el) return;
      var c = el.querySelectorAll(".anima");
      if (!c) return;
      c.forEach(this.bclear);
    }
  }]);
  return Anima;
}(_component["default"]);

exports["default"] = Anima;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35,"in-view":47}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ArticleProcessor = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ArticleProcessor, _Component);

  var _super = _createSuper(ArticleProcessor);

  function ArticleProcessor(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, ArticleProcessor);
    _this = _super.call(this, "articleProcessor"); // Attach this component to the "article" page.

    site.components.attachToPages(["article"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ArticleProcessor, [{
    key: "mount",
    value: function mount(site) {
      this.processArticle();
    }
  }, {
    key: "processArticle",
    value: function processArticle() {
      var body = document.getElementById("article-body");
      if (!body) return; // Get all child nodes of #article-body.

      var nodes = Array.from(body.childNodes);
      var fragment = document.createDocumentFragment();
      var inRow = false;
      var currentRow = null;
      var currentCol = null; // Helper: starts a new row and begins a new column.

      var startRow = function startRow() {
        currentRow = document.createElement("div");
        currentRow.className = "article__row";
        currentCol = document.createElement("div");
        currentCol.className = "article__col";
        inRow = true;
      }; // Helper: finishes the current row by appending the current column.


      var finishRow = function finishRow() {
        if (currentCol) {
          currentRow.appendChild(currentCol);
          currentCol = null;
        }

        fragment.appendChild(currentRow);
        currentRow = null;
        inRow = false;
      }; // Helper: starts a new column within the current row.


      var startNewCol = function startNewCol() {
        if (currentCol) {
          currentRow.appendChild(currentCol);
        }

        currentCol = document.createElement("div");
        currentCol.className = "article__col";
      };

      nodes.forEach(function (node) {
        // Skip any <p>&nbsp;</p> elements.
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toUpperCase() === "P" && node.innerHTML.trim() === "&nbsp;") {
          return;
        } // Check if the node is an element with the .page-break class.


        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("page-break")) {
          // Toggle the row: if not in a row, start one; if already in a row, finish it.
          if (!inRow) {
            startRow();
          } else {
            finishRow();
          } // Skip the .page-break element.


          return;
        } // If we are inside a row, wrap content accordingly.


        if (inRow) {
          // An hr element indicates a column break.
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toUpperCase() === "HR") {
            startNewCol();
            return;
          } // Otherwise, add the node to the current column.


          currentCol.appendChild(node);
        } else {
          // If not inside a row, leave the node in place.
          fragment.appendChild(node);
        }
      }); // If we end while a row is still open, finish it.

      if (inRow) {
        finishRow();
      } // Replace the original content with the new structured content.


      body.innerHTML = "";
      body.appendChild(fragment);
    }
  }]);
  return ArticleProcessor;
}(_component["default"]);

exports["default"] = ArticleProcessor;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AudioCover = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(AudioCover, _Component);

  var _super = _createSuper(AudioCover);

  function AudioCover(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, AudioCover);
    _this = _super.call(this, "audioCover"); // Attach to the appropriate page (change page key as needed)

    site.components.attachToPages(["album"], (0, _assertThisInitialized2["default"])(_this));
    _this.browser = site.browser; // Update on resize in case positions change.

    _this.browser.addToRenderLoop(_this.updateCoverPosition.bind((0, _assertThisInitialized2["default"])(_this)));

    return _this;
  }

  (0, _createClass2["default"])(AudioCover, [{
    key: "mount",
    value: function mount(site) {
      if (this.browser.state.isMobile) return;
      this.cover = document.querySelector("#container .audioHeader__cover");
      this.coverP = 0;
    }
  }, {
    key: "updateCoverPosition",
    value: function updateCoverPosition() {
      if (!this.cover) return;
      var targetP = this.browser.state.scrollTop / (this.browser.state.rem * 90);
      this.coverP += (targetP - this.coverP) * 0.2 * this.browser.state.rate;
      var down = this.coverP * -20;
      var angle = this.coverP * 18;
      this.cover.style.transform = "translate3d(0, " + down + "rem, 0) rotate(" + angle + "deg)";
    }
  }]);
  return AudioCover;
}(_component["default"]);

exports["default"] = AudioCover;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],5:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

var _canAudioPlay = require("../utility/can-audio-play");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AudioSlider = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(AudioSlider, _Component);

  var _super = _createSuper(AudioSlider);

  function AudioSlider(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, AudioSlider);
    _this = _super.call(this, "audioSlider");
    site.components.attachToPages(["home"], (0, _assertThisInitialized2["default"])(_this));
    _this.browser = site.browser;

    _this.browser.addToRenderLoop(_this.render.bind((0, _assertThisInitialized2["default"])(_this)));

    _this.browser.addToResizeLoop(_this.updateDimensions.bind((0, _assertThisInitialized2["default"])(_this)));

    _this.menu = site.components.getComponent("menu"); // Audio setup

    _this.activeBlock = null;
    _this.currentAlbum = null;
    _this.previewAudio = new Audio();
    _this.previewAudio.volume = 0;
    _this.previewAudio.loop = true;
    _this.staticAudio = new Audio(document.getElementById("static").getAttribute("data-static"));
    _this.staticAudio.volume = 0;
    _this.staticAudio.loop = true;
    _this.transitioning = false;
    _this.audioBlocked = false;
    _this.muted = false; // Callback placeholders

    _this.OnMute = function () {};

    _this.OnUnmute = function () {};

    return _this;
  }

  (0, _createClass2["default"])(AudioSlider, [{
    key: "mount",
    value: function () {
      var _mount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(site) {
        var _this2 = this;

        var allowed, unlock;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.el = document.querySelector(".audioSlider");

                if (this.el) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                this.rail = this.el.querySelector(".audioSlider__rail");
                this.blocks = Array.from(this.rail.querySelectorAll(".audioSlider__block"));
                this.blockData = this.blocks.map(function (block) {
                  return {
                    angle: 0,
                    speed: 0,
                    block: block,
                    image: block.querySelector(".audioSlider__imageInner")
                  };
                }); // Register to respond to mute changes

                this.menu.registerMuteCallback(function (isMuted) {
                  _this2.setMuted(isMuted);
                }); // Sync initial mute state

                this.setMuted(this.menu.isMuted());
                this.updateDimensions();
                setTimeout(this.updateDimensions, 100);
                setTimeout(this.updateDimensions, 500);
                setTimeout(this.updateDimensions, 1000); // Detect autoplay restrictions

                _context.next = 14;
                return (0, _canAudioPlay.canAudioPlay)();

              case 14:
                allowed = _context.sent;

                if (!allowed) {
                  this.audioBlocked = true;
                  document.documentElement.classList.add("audio-blocked");
                }

                if (this.audioBlocked) {
                  unlock = function unlock() {
                    _this2.setAudioUnlocked();

                    window.removeEventListener("pointerdown", unlock);
                    window.removeEventListener("keydown", unlock);
                  };

                  window.addEventListener("pointerdown", unlock, {
                    once: true
                  });
                  window.addEventListener("keydown", unlock, {
                    once: true
                  });
                }

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function mount(_x) {
        return _mount.apply(this, arguments);
      }

      return mount;
    }()
  }, {
    key: "updateDimensions",
    value: function updateDimensions() {
      if (!this.el) return;
      this.railWidth = this.rail.scrollWidth + window.innerWidth * (this.browser.state.isMobile ? 1.5 : 0.66);
      this.containerWidth = this.el.offsetWidth;
      var multiplierAttr = this.el.getAttribute("data-scroll-multiplier");
      this.multiplier = multiplierAttr ? parseFloat(multiplierAttr) : 1;
      this.el.style.height = this.railWidth * this.multiplier + "px";
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (!this.el || !this.rail || !this.blocks) return;
      var rect = this.el.getBoundingClientRect();
      var railRect = this.rail.getBoundingClientRect();
      var progress = (window.innerHeight / 2 - (rect.top + railRect.height / 2)) / this.el.offsetHeight;
      var translateX = (this.containerWidth - this.railWidth) * progress;
      this.rail.style.transform = "translate3d(".concat(translateX, "px, 0, 0)");
      var viewportCenter = window.innerWidth / 2;
      var newActiveBlock = null;
      var minDistance = window.innerWidth / 3.5;
      this.blocks.forEach(function (block) {
        var blockRect = block.getBoundingClientRect();
        var blockCenter = blockRect.left + blockRect.width / 2;
        var distance = Math.abs(blockCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveBlock = block;
        }
      });
      var threshold = window.innerWidth * 0.33;
      if (minDistance > threshold) newActiveBlock = null;

      if (newActiveBlock !== this.activeBlock) {
        this.transitionTo(newActiveBlock);
      }

      this.blockData.forEach(function (data) {
        var isActive = data.block === _this3.activeBlock;
        data.block.classList[isActive ? "add" : "remove"]("active");
        data.speed += ((isActive ? 1 : 0) - data.speed) * 0.1 * _this3.browser.state.rate;

        if (data.speed > 0.001) {
          data.angle += data.speed * _this3.browser.state.rate;
          data.image.style.transform = "rotate(".concat(data.angle, "deg)");
        }
      });
      var bg = this.el.querySelector(".audioSlider__bg");

      if (bg) {
        var spans = Array.from(bg.querySelectorAll("span"));
        var bgp = (window.innerWidth - (rect.top + railRect.height / 2)) / this.el.offsetHeight;
        if (this.browser.state.isMobile) bgp *= 0.55;
        var count = spans.length;
        var activeIndex = Math.floor(bgp * count);
        spans.forEach(function (span, i) {
          span.classList.remove("active", "before", "after");
          if (bgp < 0 || bgp > 1) return;
          if (i === activeIndex - 1) span.classList.add("before");else if (i === activeIndex + 1) span.classList.add("after");else if (i === activeIndex) span.classList.add("active");
        });
      }
    }
  }, {
    key: "IsMuted",
    value: function IsMuted() {
      return this.audioBlocked || this.muted;
    }
  }, {
    key: "setMuted",
    value: function setMuted(muteState) {
      var _this4 = this;

      var wasMuted = this.IsMuted();
      this.muted = muteState;

      if (muteState) {
        // Mute just turned on: fade everything out and stop playback
        this.OnMute();
        this.fadeAudio(this.previewAudio, 0, 200).then(function () {
          _this4.previewAudio.pause();

          _this4.previewAudio.src = "";
        });
        this.fadeAudio(this.staticAudio, 0, 200).then(function () {
          _this4.staticAudio.pause();
        });
      } else {
        // Mute just turned off
        this.OnUnmute(); // If something was playing before, reenter it

        if (wasMuted && this.currentAlbum !== null) {
          this.transitionTo(this.currentAlbum);
        }
      }
    }
  }, {
    key: "setAudioUnlocked",
    value: function setAudioUnlocked() {
      if (this.audioBlocked) {
        this.audioBlocked = false;
        document.documentElement.classList.remove("audio-blocked");

        if (!this.muted && this.currentAlbum !== null) {
          this.transitionTo(this.currentAlbum);
        }
      }
    }
  }, {
    key: "transitionTo",
    value: function () {
      var _transitionTo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(newBlock) {
        var audioURL, hasAudio, fadeOutDuration, staticOnlyDuration, fadeInDuration, fadeOutPreview, fadeInStatic;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.transitioning) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                this.transitioning = true;
                audioURL = newBlock ? newBlock.getAttribute("data-audio") : null;
                hasAudio = audioURL && audioURL.length > 0;
                this.activeBlock = newBlock;
                this.currentAlbum = newBlock;
                fadeOutDuration = 300;
                staticOnlyDuration = 250;
                fadeInDuration = 300; // Skip audio transition entirely if muted

                if (!this.IsMuted()) {
                  _context2.next = 15;
                  break;
                }

                this.previewAudio.pause();
                this.staticAudio.pause();
                this.transitioning = false;
                return _context2.abrupt("return");

              case 15:
                fadeOutPreview = this.fadeAudio(this.previewAudio, 0, fadeOutDuration);
                this.staticAudio.play();
                fadeInStatic = this.fadeAudio(this.staticAudio, 1, fadeOutDuration);
                _context2.next = 20;
                return Promise.all([fadeOutPreview, fadeInStatic]);

              case 20:
                if (!hasAudio) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 23;
                return new Promise(function (r) {
                  return setTimeout(r, staticOnlyDuration);
                });

              case 23:
                this.previewAudio.src = audioURL;
                this.previewAudio.currentTime = 0;
                this.previewAudio.play();

              case 26:
                _context2.next = 28;
                return Promise.all([this.fadeAudio(this.previewAudio, hasAudio ? 1 : 0, fadeInDuration), this.fadeAudio(this.staticAudio, 0, fadeInDuration * 1.25)]);

              case 28:
                if (!hasAudio && this.previewAudio) {
                  this.previewAudio.pause();
                  this.previewAudio.src = "";
                }

                this.transitioning = false;

              case 30:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function transitionTo(_x2) {
        return _transitionTo.apply(this, arguments);
      }

      return transitionTo;
    }()
  }, {
    key: "fadeAudio",
    value: function fadeAudio(audio, targetVolume, duration) {
      return new Promise(function (resolve) {
        var start = audio.volume;
        var delta = targetVolume - start;
        var startTime = performance.now();

        var step = function step(now) {
          var elapsed = now - startTime;
          var t = Math.min(1, elapsed / duration);
          audio.volume = Math.min(1, Math.max(0, start + delta * t));
          if (t < 1) requestAnimationFrame(step);else {
            if (targetVolume === 0) audio.pause();
            resolve();
          }
        };

        requestAnimationFrame(step);
      });
    }
  }]);
  return AudioSlider;
}(_component["default"]);

exports["default"] = AudioSlider;

},{"../utility/can-audio-play":25,"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/asyncToGenerator":29,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35,"@babel/runtime/regenerator":39}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Component = /*#__PURE__*/function () {
  function Component() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    (0, _classCallCheck2["default"])(this, Component);
    this.name = name;
  }

  (0, _createClass2["default"])(Component, [{
    key: "mount",
    value: function mount() {}
  }, {
    key: "unmount",
    value: function unmount() {}
  }]);
  return Component;
}();

exports["default"] = Component;

},{"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/interopRequireDefault":34}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Cursors = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Cursors, _Component);

  var _super = _createSuper(Cursors);

  function Cursors(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Cursors);
    _this = _super.call(this, "cursors");
    _this.showing = false;
    _this.browser = site.browser;
    _this.cursor = document.getElementById("cursor");

    _this.browser.addToRenderLoop(_this.render.bind((0, _assertThisInitialized2["default"])(_this)));

    document.addEventListener('swup:animationOutStart', _this.showLoading.bind((0, _assertThisInitialized2["default"])(_this)));
    document.addEventListener('swup:animationInStart', _this.hideLoading.bind((0, _assertThisInitialized2["default"])(_this)));
    return _this;
  }

  (0, _createClass2["default"])(Cursors, [{
    key: "showLoading",
    value: function showLoading() {
      this.show("load");
    }
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      this.hide("load");
    }
  }, {
    key: "show",
    value: function show(cursor) {
      if (cursor) document.documentElement.classList.add("show-cursor-" + cursor);
      this.showing = cursor;
    }
  }, {
    key: "hide",
    value: function hide(cursor) {
      if (cursor) document.documentElement.classList.remove("show-cursor-" + cursor);
      this.showing = false;
    }
  }, {
    key: "render",
    value: function render(rate) {
      if (!this.browser.isMobile && this.showing) {
        this.cursor.style.transform = "translate3d(" + this.browser.state.mouse.xLag + "px, " + this.browser.state.mouse.yLag + "px, 0)";
      }
    }
  }]);
  return Cursors;
}(_component["default"]);

exports["default"] = Cursors;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Simple linear interpolation function.
function lerp(a, b, t) {
  return a + (b - a) * t;
}

var GallerySlider = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(GallerySlider, _Component);

  var _super = _createSuper(GallerySlider);

  function GallerySlider(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, GallerySlider);
    _this = _super.call(this, "gallerySlider"); // Attach this component to the home page.

    site.components.attachToPages(["home"], (0, _assertThisInitialized2["default"])(_this));
    _this.browser = site.browser; // Start with the first item active.

    _this.activeIndex = 0; // Set the initial translate multiplier to 2.

    _this.currentMultiplier = 2; // Update on resize and continuously on the render loop.

    _this.browser.addToResizeLoop(_this.updatePositions.bind((0, _assertThisInitialized2["default"])(_this)));

    _this.browser.addToRenderLoop(_this.updatePositions.bind((0, _assertThisInitialized2["default"])(_this)));

    return _this;
  }

  (0, _createClass2["default"])(GallerySlider, [{
    key: "unmount",
    value: function unmount() {
      this.inTriggered = false;
      this.currentMultiplier = 2;
      this.activeIndex = 0;
      this.el = null;
    }
  }, {
    key: "mount",
    value: function mount(site) {
      var _this2 = this;

      // Get the main slider element.
      this.el = document.querySelector(".gallerySlider");
      if (!this.el) return; // Get all slider items.

      this.items = Array.from(this.el.querySelectorAll(".gallerySlider__item"));
      this.activeIndex = 0;
      this.updatePositions(); // When a card is clicked, set it active.

      this.items.forEach(function (item, index) {
        item.addEventListener("click", function () {
          if (index !== _this2.activeIndex) {
            _this2.activeIndex = index;

            _this2.updatePositions();
          }
        });
      }); // Prev/Next button functionality.

      var prevBtn = this.el.querySelector(".gallerySlider__prev");
      var nextBtn = this.el.querySelector(".gallerySlider__next");

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          _this2.activeIndex = (_this2.activeIndex - 1 + _this2.items.length) % _this2.items.length;

          _this2.updatePositions();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          _this2.activeIndex = (_this2.activeIndex + 1) % _this2.items.length;

          _this2.updatePositions();
        });
      }
    }
  }, {
    key: "updatePositions",
    value: function updatePositions() {
      var _this3 = this;

      if (!this.el || !this.items || this.items.length === 0) return;
      var count = this.items.length;
      var buffer = 5; // Only show items within ±5 positions of the active card.
      // 1. Entry animation trigger.
      // Compute the section center and compare it to the viewport center.

      if (!this.inTriggered) {
        var rect = this.el.getBoundingClientRect();
        var sectionCenter = rect.top + rect.height * 0.5;
        var viewportCenter = window.innerHeight * 0.75;
        this.inTriggered = sectionCenter < viewportCenter;

        if (this.inTriggered) {
          this.el.classList.add("in");
        }
      } // } else {
      //   this.el.classList.remove("in");
      // }
      // 2. Lerp the translate multiplier: target is 1 if the entry is triggered, else 2.


      var targetMultiplier = this.inTriggered ? 1 : 20;
      this.currentMultiplier = lerp(this.currentMultiplier, targetMultiplier, 0.2);
      var b = this.browser.state.isMobile ? 6.5 : 10;
      var r = this.browser.state.isMobile ? 14 : 22; // Update each card's position.

      this.items.forEach(function (item, index) {
        // Calculate the minimal circular difference between the card's index and the active index.
        var diff = index - _this3.activeIndex;

        if (diff > count / 2) {
          diff -= count;
        }

        if (diff < -count / 2) {
          diff += count;
        } // Apply the translation with the current multiplier (50rem per unit difference).
        // item.style.transform = `translateX(${diff * 50 * this.currentMultiplier}rem)`;
        // Each unit of difference translates to 50rem.


        if (index == _this3.activeIndex) {
          item.style.transform = "translate3d(0rem, -50%, 0)";
        } else {
          item.style.transform = "translate3d(".concat((diff / Math.abs(diff) * b + diff * r) * Math.min(_this3.currentMultiplier, 2), "rem, -50%, 0)");
        }

        if (_this3.activeIndex != 0) {
          item.classList.remove("start");
        } // Hide items outside the buffer zone.


        if (Math.abs(diff) > buffer) {
          item.classList.add("hide");
        } else {
          item.classList.remove("hide");
        } // Set the active class on the current active card.


        if (index === _this3.activeIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  }]);
  return GallerySlider;
}(_component["default"]);

exports["default"] = GallerySlider;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Gallery = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Gallery, _Component);

  var _super = _createSuper(Gallery);

  function Gallery(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Gallery);
    _this = _super.call(this, "gallery"); // Attach this component to the "visual" page.

    site.components.attachToPages(["visual"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Gallery, [{
    key: "mount",
    value: function mount(site) {
      var _this2 = this;

      // Main gallery container.
      this.gallery = document.querySelector(".gallery__list");
      if (!this.gallery) return; // Get overlay and its child elements.

      this.overlay = document.getElementById("overlay");
      this.overlayImage = document.getElementById("overlay-image");
      this.overlayBg = document.getElementById("overlay-bg"); // Next and Prev buttons inside the overlay.

      this.overlayPrev = this.overlay.querySelector(".gallery__overlayPrev");
      this.overlayNext = this.overlay.querySelector(".gallery__overlayNext"); // Bind click on overlay background to hide the overlay.

      if (this.overlayBg) {
        this.overlayBg.addEventListener("click", function () {
          _this2.hideOverlay();
        });
      } // Bind click on overlay image to toggle flip (show back content).


      if (this.overlayImage) {
        this.overlayImage.addEventListener("click", function () {
          _this2.flipOverlay();
        });
      } // Bind click on next/prev buttons.


      if (this.overlayPrev) {
        this.overlayPrev.addEventListener("click", function (e) {
          e.stopPropagation();

          _this2.showPrev();
        });
      }

      if (this.overlayNext) {
        this.overlayNext.addEventListener("click", function (e) {
          e.stopPropagation();

          _this2.showNext();
        });
      } // Bind click on each gallery image.
      // Each image is represented by an element with class "gallery__image".


      this.images = Array.from(this.gallery.querySelectorAll(".gallery__image"));
      this.images.forEach(function (image) {
        image.addEventListener("click", function () {
          var series = image.closest(".gallery__series");

          var visibleImages = _this2.getVisibleImages(series);

          _this2.activeImages = visibleImages;
          _this2.activeIndex = visibleImages.indexOf(image);

          _this2.showOverlay();
        });
      }); // --- Filter functionality ---
      // Select filter options from the template (inside .filter__option).

      this.filterOptions = Array.from(document.querySelectorAll(".filter__option")); // Default filter is "all" (represented by an empty string).

      this.activeFilter = "";
      this.filterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
          // Remove active class from all filter options.
          _this2.filterOptions.forEach(function (opt) {
            return opt.classList.remove("active");
          });

          option.classList.add("active"); // Determine filter value.

          var filterValue = option.getAttribute("data-filter");

          if (!filterValue) {
            filterValue = option.textContent.trim().toLowerCase();

            if (filterValue === "all") {
              filterValue = "";
            }
          }

          _this2.activeFilter = filterValue;
          var main = option.closest(".gallery__series").querySelector(".gallery__main");
          main.classList.remove("in");
          main.classList.remove("filtered");
          setTimeout(function () {
            _this2.updateFilter();

            main.classList[filterValue == "" ? "remove" : "add"]("filtered");
            setTimeout(function () {
              main.classList.add("in");
            }, 100);
          }, 200);
        });
      });
    } // Helper: returns only visible images within a series (or entire gallery if series is null).

  }, {
    key: "getVisibleImages",
    value: function getVisibleImages(series) {
      var list;

      if (series) {
        list = Array.from(series.querySelectorAll(".gallery__image"));
      } else {
        list = this.images;
      }

      return list.filter(function (img) {
        return !img.classList.contains("hide");
      });
    }
  }, {
    key: "updateFilter",
    value: function updateFilter() {
      var _this3 = this;

      if (!this.images || this.images.length === 0) return; // If no filter is active, show all images.

      if (this.activeFilter === "") {
        this.images.forEach(function (image) {
          return image.classList.remove("hide");
        });
      } else {
        this.images.forEach(function (image) {
          if (!image.classList.contains(_this3.activeFilter)) {
            image.classList.add("hide");
          } else {
            image.classList.remove("hide");
          }
        });
      }
    }
  }, {
    key: "showOverlay",
    value: function showOverlay() {
      // When showing overlay, update activeImages based on visible images.
      if (!this.activeImages || this.activeImages.length === 0) return;
      var current = this.activeImages[this.activeIndex];
      var large = current.querySelector(".gallery__large");

      if (large) {
        // Clone the large image element.
        var clone = large.cloneNode(true); // Replace the overlay content.

        this.overlayImage.innerHTML = "";
        this.overlayImage.appendChild(clone);
      } // Show the overlay.


      this.overlay.classList.add("show");
      this.overlayImage.classList.remove("flip");
    }
  }, {
    key: "hideOverlay",
    value: function hideOverlay() {
      this.overlay.classList.remove("show");
      this.overlayImage.classList.remove("flip");
    }
  }, {
    key: "flipOverlay",
    value: function flipOverlay() {
      this.overlayImage.classList.toggle("flip");
    }
  }, {
    key: "showNext",
    value: function showNext() {
      if (!this.activeImages || this.activeImages.length === 0) return; // Update activeImages based on current filter (visible images in the same series).

      var series = this.activeImages[0].closest(".gallery__series");
      this.activeImages = this.getVisibleImages(series);
      if (this.activeImages.length === 0) return;
      this.activeIndex = (this.activeIndex + 1) % this.activeImages.length;
      this.showOverlay();
    }
  }, {
    key: "showPrev",
    value: function showPrev() {
      if (!this.activeImages || this.activeImages.length === 0) return;
      var series = this.activeImages[0].closest(".gallery__series");
      this.activeImages = this.getVisibleImages(series);
      if (this.activeImages.length === 0) return;
      this.activeIndex = (this.activeIndex - 1 + this.activeImages.length) % this.activeImages.length;
      this.showOverlay();
    }
  }]);
  return Gallery;
}(_component["default"]);

exports["default"] = Gallery;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],10:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var HomeStickyNav = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(HomeStickyNav, _Component);

  var _super = _createSuper(HomeStickyNav);

  function HomeStickyNav(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, HomeStickyNav);
    _this = _super.call(this, "homeStickyNav"); // Attach to the "home" page

    site.components.attachToPages(["home"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(HomeStickyNav, [{
    key: "mount",
    value: function mount(site) {
      // Select the sticky header elements
      this.headings = Array.from(document.querySelectorAll(".homeFeatures__stickyHeading"));
      this.snippets = Array.from(document.querySelectorAll(".homeFeatures__stickySnippet"));
      this.links = Array.from(document.querySelectorAll(".homeFeatures__stickyLink"));
      this.unmute = document.getElementById("unmute"); // Select the feature sections by their IDs

      this.sections = [document.getElementById("home-audio"), document.getElementById("home-written"), document.getElementById("home-visual")]; // Do an initial update in case the page isn't at the top

      this.updateActiveSection(); // Register updateActiveSection on every render loop tick so that it updates as the user scrolls

      site.browser.addToRenderLoop(this.updateActiveSection.bind(this));
    }
  }, {
    key: "updateActiveSection",
    value: function updateActiveSection() {
      // Ensure sections are available
      if (!this.sections || this.sections.length === 0) return; // Use the midpoint of the viewport as a reference

      var viewportMid = window.innerHeight / 2;
      var activeIndex = -1; // Determine which section currently contains the viewport midpoint

      this.sections.forEach(function (section, index) {
        if (section) {
          var rect = section.getBoundingClientRect();

          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            activeIndex = index;
          }
        }
      }); // If no section contains the midpoint, check if we've scrolled past the last section

      if (activeIndex === -1) {
        var lastSection = this.sections[this.sections.length - 1];

        if (lastSection && lastSection.getBoundingClientRect().bottom < viewportMid) {
          activeIndex = this.sections.length - 1;
        } else {
          activeIndex = 0;
        }
      } // Update active classes on headings, snippets, and links


      this.headings.forEach(function (el, index) {
        if (index === activeIndex) el.classList.add("active");else el.classList.remove("active");
      });
      this.snippets.forEach(function (el, index) {
        if (index === activeIndex) el.classList.add("active");else el.classList.remove("active");
      });
      this.links.forEach(function (el, index) {
        if (index === activeIndex) el.classList.add("active");else el.classList.remove("active");
      });

      if (activeIndex == 0) {
        this.unmute.classList.remove("hide");
      } else {
        this.unmute.classList.add("hide");
      }
    }
  }]);
  return HomeStickyNav;
}(_component["default"]);

exports["default"] = HomeStickyNav;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],11:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var LinkCopy = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(LinkCopy, _Component);

  var _super = _createSuper(LinkCopy);

  function LinkCopy(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, LinkCopy);
    _this = _super.call(this, "linkCopy"); // Attach this component to all pages.

    site.components.attachToPages(["all"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(LinkCopy, [{
    key: "mount",
    value: function mount(site) {
      // Find all elements with the attribute data-copy-link.
      this.copyLinks = Array.from(document.querySelectorAll('[data-copy-link]'));
      this.copyLinks.forEach(function (link) {
        // Check if the link has a child with class "linkLabel".
        var labelEl = link.querySelector(".linkLabel");

        if (labelEl) {
          // Save original text from the child element.
          labelEl.dataset.originalText = labelEl.textContent;
        } else {
          // Otherwise, save the link's text.
          link.dataset.originalText = link.textContent;
        } // If the link has the maintainWidth class, fix its width.


        if (link.classList.contains("maintainWidth")) {
          var computedStyle = window.getComputedStyle(link);
          link.style.width = computedStyle.width;
        }

        link.addEventListener("click", function (e) {
          e.preventDefault(); // Determine the text to copy: if the data-copy-link attribute is empty, use the current page URL.

          var textToCopy = link.getAttribute("data-copy-link");

          if (!textToCopy || textToCopy.trim() === "") {
            textToCopy = window.location.href;
          }

          navigator.clipboard.writeText(textToCopy).then(function () {
            // If a child with .linkLabel exists, update its text.
            if (labelEl) {
              labelEl.textContent = "copied";
              link.classList.add("copied");
              setTimeout(function () {
                labelEl.textContent = labelEl.dataset.originalText;
                link.classList.remove("copied");
              }, 3000);
            } else {
              // Otherwise, update the link's own text.
              var originalText = link.dataset.originalText;
              link.textContent = "copied";
              link.classList.add("copied");
              setTimeout(function () {
                link.textContent = originalText;
                link.classList.remove("copied");
              }, 3000);
            }
          })["catch"](function (err) {
            console.error("Failed to copy text: ", err);
          });
        });
      });
    }
  }]);
  return LinkCopy;
}(_component["default"]);

exports["default"] = LinkCopy;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],12:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Lyrics = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Lyrics, _Component);

  var _super = _createSuper(Lyrics);

  function Lyrics(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Lyrics);
    _this = _super.call(this, "lyrics");
    _this.browser = site.browser;
    site.components.attachToPages(["album"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Lyrics, [{
    key: "mount",
    value: function mount(site) {
      var lyricsButtons = document.querySelectorAll(".lyricsButton");

      for (var i = 0; i < lyricsButtons.length; i++) {
        lyricsButtons[i].addEventListener("click", this.showLyrics.bind(this, lyricsButtons[i]));
      }

      var lyricsBgs = document.querySelectorAll(".lyricsBg");

      for (var _i = 0; _i < lyricsBgs.length; _i++) {
        lyricsBgs[_i].addEventListener("click", this.hideLyrics.bind(this, lyricsBgs[_i]));
      }

      var lyricsCloses = document.querySelectorAll(".lyricsClose");

      for (var _i2 = 0; _i2 < lyricsCloses.length; _i2++) {
        lyricsCloses[_i2].addEventListener("click", this.hideLyrics.bind(this, lyricsCloses[_i2]));
      }
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.browser.state.lenis.start();
    }
  }, {
    key: "showLyrics",
    value: function showLyrics(el) {
      if (!el) return;
      var popout = el.parentNode.querySelector(".linerNotes__lyricsPopout");

      if (popout) {
        popout.classList.add("show");
      }

      this.browser.state.lenis.stop();
    }
  }, {
    key: "hideLyrics",
    value: function hideLyrics(el) {
      if (!el) return;
      el.closest(".linerNotes__lyricsPopout").classList.remove("show");
      this.browser.state.lenis.start();
    }
  }]);
  return Lyrics;
}(_component["default"]);

exports["default"] = Lyrics;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],13:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

var _access = require("../utility/access");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Menu = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Menu, _Component);

  var _super = _createSuper(Menu);

  function Menu(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Menu);
    _this = _super.call(this, "menu");

    if (site.navigation.swup) {
      site.navigation.swup.on('clickLink', function (event) {
        var target = event.target.closest("a");
        if (!target) return;
        var url = target.pathname;
        if (url) _this.highlightActivePage(url);
      });
    }

    document.addEventListener('swup:animationOutDone', _this.closeMenu.bind((0, _assertThisInitialized2["default"])(_this)));
    document.addEventListener('swup:samePage', _this.closeMenu.bind((0, _assertThisInitialized2["default"])(_this)));
    site.navigation.registerNavigationCallback(_this.highlightActivePage.bind((0, _assertThisInitialized2["default"])(_this)));
    site.navigation.registerNavigationCallback(_this.clearMenuColor.bind((0, _assertThisInitialized2["default"])(_this)));
    _this.navigation = site.navigation;
    site.components.mount((0, _assertThisInitialized2["default"])(_this));
    document.documentElement.style.setProperty('--app-height', "".concat(window.innerHeight, "px"));
    window.addEventListener('resize', function () {
      document.documentElement.style.setProperty('--app-height', "".concat(window.innerHeight, "px"));
    });
    _this.scrolled = false;
    _this.downscrolled = false;
    _this.browser = site.browser;
    _this.animatingTime = 0;
    _this.muted = false;
    _this.muteCallbacks = [];
    return _this;
  }

  (0, _createClass2["default"])(Menu, [{
    key: "mount",
    value: function mount(site) {
      this.initEls();
      this.initMenuToggle();
      this.initMenuLinks();
      site.browser.addToRenderLoop(this.render.bind(this));
      this.initAudioToggle(); // this.openMenu();
    }
  }, {
    key: "initEls",
    value: function initEls() {
      this.nav = document.getElementById("nav");
      this.bar = document.getElementById("nav-bar");
      this.menu = document.getElementById("nav-menu"); // this.overlay = document.getElementById("nav-overlay");

      this.navLinks = document.querySelectorAll(".nav__link");
      this.toggles = document.querySelectorAll(".nav-toggle");
    }
  }, {
    key: "setMenuColor",
    value: function setMenuColor(col, light) {
      if (light) {
        this.nav.classList.add("nav--light");
      } else {
        this.nav.classList.remove("nav--light");
      }

      this.bar.style.backgroundColor = col; // this.bar.classList.remove("db--over");
      // this.bar.classList.add("dbl--over");
    }
  }, {
    key: "clearMenuColor",
    value: function clearMenuColor() {
      var navColor = document.getElementById("main").querySelector(".navColor");

      if (navColor) {
        this.setMenuColor(navColor.style.backgroundColor, !navColor.classList.contains("dark"));
      } else {
        this.nav.classList.remove("nav--light");
        this.bar.style.backgroundColor = ""; //   this.bar.classList.remove("dbl--over");
        //   this.bar.classList.add("db--over");
      }
    }
  }, {
    key: "initMenuToggle",
    value: function initMenuToggle() {
      for (var i = 0; i < this.toggles.length; i++) {
        (0, _access.addConfirmListeners)(this.toggles[i], this.toggleMenu.bind(this));
      }

      if (this.overlay) this.overlay.addEventListener("click", this.closeMenu.bind(this));
      var menuLinks = document.querySelectorAll(".nav__menu a");

      for (var _i = 0; _i < menuLinks.length; _i++) {
        (0, _access.addConfirmListeners)(menuLinks[_i], this.trackMenuLinkClick.bind(this));
      }
    }
  }, {
    key: "trackMenuLinkClick",
    value: function trackMenuLinkClick(e) {
      this.navigation.menuLinkClicked = e.currentTarget;
    }
  }, {
    key: "toggleMenu",
    value: function toggleMenu() {
      if (!document.documentElement.classList.contains("menu-open")) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    }
  }, {
    key: "openMenu",
    value: function openMenu() {
      document.documentElement.classList.add("menu-open");
      this.nav.classList.add("is-open");
    }
  }, {
    key: "closeMenu",
    value: function closeMenu() {
      document.documentElement.classList.remove("menu-open");
      this.nav.classList.remove("is-open"); // this.clearSubmenu();
    }
  }, {
    key: "initMenuLinks",
    value: function initMenuLinks() {
      var _this2 = this;

      document.addEventListener("click", function (e) {
        var menuLink = e.target.closest("#nav a:not(.ignore-nav-close)");

        if (menuLink) {
          _this2.closeMenu();
        }
      });
    }
  }, {
    key: "highlightActivePage",
    value: function highlightActivePage() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var active = this.findActivePages(url);
      this.navLinks.forEach(function (item, i) {
        item.classList.remove("wasActive");

        if (active.indexOf(item) >= 0) {
          item.classList.add("active");
        } else {
          if (item.classList.contains("active")) {
            item.classList.add("wasActive");
          }

          item.classList.remove("active");
        }
      });
    }
  }, {
    key: "urlToRelative",
    value: function urlToRelative(abs) {
      var url = new URL(abs);
      var rel = url.toString().substring(url.origin.length);
      return rel;
    }
  }, {
    key: "findActivePages",
    value: function findActivePages() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var path = url == "" ? window.location.pathname : url;
      var output = [];
      if (path == "/") return output;

      for (var i = 0; i < this.navLinks.length; i++) {
        var item = this.navLinks[i];
        if (path.includes(this.urlToRelative(item.href))) output.push(item);
      }

      ;
      return output;
    }
  }, {
    key: "initAudioToggle",
    value: function initAudioToggle() {
      var _this3 = this;

      var toggle = document.getElementById("nav-audio");
      if (!toggle) return;
      this.lottie = toggle.querySelector("lottie-player"); // Initial state

      this.updateAudioToggle();
      toggle.addEventListener("click", function () {
        _this3.muted = !_this3.muted;

        _this3.updateAudioToggle();

        _this3.muteCallbacks.forEach(function (cb) {
          return cb(_this3.muted);
        });
      });
    }
  }, {
    key: "updateAudioToggle",
    value: function updateAudioToggle() {
      if (!this.lottie) return;

      if (this.muted) {
        this.lottie.stop();
      } else {
        this.lottie.play();
      }

      var toggle = document.getElementById("nav-audio");
      toggle.classList.toggle("off", this.muted);
    }
  }, {
    key: "isMuted",
    value: function isMuted() {
      return this.muted;
    }
  }, {
    key: "registerMuteCallback",
    value: function registerMuteCallback(callback) {
      if (typeof callback === "function") {
        this.muteCallbacks.push(callback);
      }
    }
  }, {
    key: "setMuted",
    value: function setMuted(val) {
      var _this4 = this;

      if (val === this.muted) return;
      this.muted = val;
      this.updateAudioToggle();
      this.muteCallbacks.forEach(function (cb) {
        return cb(_this4.muted);
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.handleScroll();
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      if (document.documentElement.classList.contains("in-transition")) {
        this.animatingTime += this.browser.state.delta;
      } else {
        this.animatingTime = 0;
      }

      if (this.animatingTime > 200) {
        document.documentElement.classList.remove("down");
        document.documentElement.classList.remove("scrolled");
        this.downscrolled = false;
        this.scrolled = false;
        return;
      }

      if (!this.downscrolled && this.browser.state.scrollDiff > 0) {
        document.documentElement.classList.add("down");
        this.downscrolled = true;
      }

      if (this.downscrolled && this.browser.state.scrollDiff < 0) {
        document.documentElement.classList.remove("down");
        this.downscrolled = false;
      }

      if (!this.scrolled && this.browser.state.scrollTop > this.browser.state.rem * 5) {
        document.documentElement.classList.add("scrolled");
        this.scrolled = true;
      }

      if (this.scrolled && this.browser.state.scrollTop < this.browser.state.rem * 5) {
        document.documentElement.classList.remove("scrolled");
        this.scrolled = false;
      }
    }
  }]);
  return Menu;
}(_component["default"]);

exports["default"] = Menu;

},{"../utility/access":23,"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Spanner = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Spanner, _Component);

  var _super = _createSuper(Spanner);

  function Spanner(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Spanner);
    _this = _super.call(this, "spanner");
    _this.parser = new DOMParser();
    site.components.attachToPages(["all"], (0, _assertThisInitialized2["default"])(_this));
    _this.emWords = ["is", "a", "an", "in", "the", "and", "of"];
    return _this;
  }

  (0, _createClass2["default"])(Spanner, [{
    key: "mount",
    value: function mount(site) {
      var spanners = document.querySelectorAll("[data-spanner]");

      for (var i = 0; i < spanners.length; i++) {
        this.initSpanner(spanners[i]);
      }
    }
  }, {
    key: "initSpanner",
    value: function initSpanner(el) {
      // console.log(el);
      if (el.classList.contains("spanned")) return;
      var className = el.getAttribute("data-spanner"); // console.log(el.innerHTML);
      // this.dig(el, classes, 1);

      this.split(el, className);
    }
  }, {
    key: "split",
    value: function split(el, className) {
      var content = el.innerHTML;
      content = content.replaceAll("<p>", " ¥¥¥ ");
      content = content.replaceAll("</p>", " ### ");
      var words = content.split(" ");
      var em = el.classList.contains("spanner-em");
      var output = "";
      var index = 1;
      var inSkip = false;
      var skipContent = "";

      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word == "") continue;
        if (word == "\n") continue;

        if (!inSkip) {
          if (word == "¥¥¥") output += "<p>";else if (word == "###") output += "</p>";else if (word.includes("<span")) {
            inSkip = true;
          } else {
            output += "<span class=\"" + (className + (em ? this.emify(word) : "")) + "\" data-i=\"" + index + "\">" + word + " </span>";
            index++;
          }
        }

        if (inSkip) {
          skipContent += word + " ";

          if (word.includes("</span>")) {
            inSkip = false;

            if (el.classList.contains("spanSkip")) {
              output += "<span class=\"" + className + " skip \" data-i=\"" + index + "\">" + skipContent + " </span>";
              ;
              index++;
            } else {
              output += skipContent;
            }

            skipContent = "";
          }
        }
      }

      el.innerHTML = output;
      el.classList.add("spanned");
    }
  }, {
    key: "emify",
    value: function emify(word) {
      if (this.emWords.indexOf(word) >= 0) return " em";
      return "";
    }
  }]);
  return Spanner;
}(_component["default"]);

exports["default"] = Spanner;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],15:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Subscribe = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Subscribe, _Component);

  var _super = _createSuper(Subscribe);

  function Subscribe(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, Subscribe);
    _this = _super.call(this, "subscribe");
    site.components.attachToPages(["all"], (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Subscribe, [{
    key: "mount",
    value: function mount(site) {
      setTimeout(this.initSubscribeForms, 500);
    }
  }, {
    key: "initSubscribeForms",
    value: function initSubscribeForms() {
      var form = document.querySelector("#container .subscribeForm");
      if (!form) return;
      console.log(form);

      form.onsubmit = function (e) {
        e.preventDefault();
        form.classList.add("loading");
        fetch('/mailchimp/send', {
          method: 'post',
          body: new FormData(form)
        }).then(function (r) {
          return r.json();
        }).then(function (r) {
          if (r.success) {
            form.classList.add("success");
          } else {
            alert(r.msg);
            form.classList.remove("loading");
          }
        })["catch"](function (e) {
          console.error(e);
          form.classList.remove("loading");
        });
      };
    }
  }]);
  return Subscribe;
}(_component["default"]);

exports["default"] = Subscribe;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],16:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var WritingFilter = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(WritingFilter, _Component);

  var _super = _createSuper(WritingFilter);

  function WritingFilter(site) {
    var _this;

    (0, _classCallCheck2["default"])(this, WritingFilter);
    _this = _super.call(this, "writingFilter"); // Attach this component to the "writing" page.

    site.components.attachToPages(["written"], (0, _assertThisInitialized2["default"])(_this));
    _this.anima = site.components.getComponent("anima");
    return _this;
  }

  (0, _createClass2["default"])(WritingFilter, [{
    key: "mount",
    value: function mount(site) {
      var _this2 = this;

      // The container with filter options.
      this.filterContainer = document.getElementById("writing-filter"); // The container where filtered results will be copied.

      this.resultsContainer = document.getElementById("writing-results"); // The overall writing section.

      this.writingSection = document.getElementById("writing");
      this.writingTitle = document.getElementById("writing-title");
      if (!this.filterContainer || !this.resultsContainer || !this.writingSection) return; // Get all filter options.

      this.filterOptions = Array.from(this.filterContainer.querySelectorAll(".filter__option")); // Bind click events to filter options.

      this.filterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
          // Update active state on filter options.
          _this2.filterOptions.forEach(function (opt) {
            return opt.classList.remove("active");
          });

          option.classList.add("active"); // Get filter value from data attribute (fallback to text content if empty).

          var filterValue = option.getAttribute("data-filter");

          if (!filterValue) {
            filterValue = option.textContent.trim().toLowerCase();

            if (filterValue === "all") {
              filterValue = "";
            }
          }

          _this2.applyFilter(filterValue);
        });
      });
    }
  }, {
    key: "applyFilter",
    value: function applyFilter(filterValue) {
      var _this3 = this;

      // If filter is empty, clear filtered results and remove "filtered" class.
      if (filterValue === "") {
        this.writingSection.classList.remove("filtered");
        this.writingSection.classList.add("changing-filter");
        setTimeout(function () {
          _this3.writingSection.classList.remove("changing-filter");

          _this3.resultsContainer.innerHTML = "";
          setTimeout(function () {
            _this3.writingSection.classList.remove("entering-filter");
          }, 100);
        }, 200);
        this.setHeading(this.writingTitle.getAttribute("data-val"));
        return;
      }

      this.writingSection.classList.remove("filtered");

      if (this.writingSection.classList.contains("entering-filter")) {
        this.writingSection.classList.add("changing-filter");
      } else {
        this.writingSection.classList.add("entering-filter");
      }

      this.setHeading(filterValue);
      setTimeout(function () {
        // Find all .wCard elements inside the writing section.
        var allWCards = Array.from(_this3.writingSection.querySelectorAll(".wCard")); // Filter to those whose data-category matches the filter value.

        var filteredWCards = allWCards.filter(function (card) {
          var category = card.getAttribute("data-category") || "";
          return category === filterValue;
        }); // Clear any previous results.

        _this3.resultsContainer.innerHTML = ""; // Clone and append each matching card.

        filteredWCards.forEach(function (card) {
          var clone = card.cloneNode(true);
          clone.className = "wCard anima";

          _this3.resultsContainer.appendChild(clone);
        }); // Add the "filtered" class to the writing section.

        setTimeout(function () {
          _this3.writingSection.classList.remove("changing-filter");

          _this3.writingSection.classList.add("filtered");

          _this3.anima.inChildren(_this3.resultsContainer);
        }, 100);
      }, 200);
    }
  }, {
    key: "setHeading",
    value: function setHeading(value) {
      var _this4 = this;

      var spanned = "";

      for (var i = 0; i < value.length; i++) {
        spanned += "<span>" + value[i] + "</span>";
      }

      this.writingTitle.classList.add("out");
      setTimeout(function () {
        _this4.writingTitle.classList.remove("in");

        _this4.writingTitle.classList.remove("out");

        _this4.writingTitle.innerHTML = spanned;
        setTimeout(function () {
          _this4.writingTitle.classList.add("in");
        }, 100);
      }, 300);
    }
  }]);
  return WritingFilter;
}(_component["default"]);

exports["default"] = WritingFilter;

},{"./component":6,"@babel/runtime/helpers/assertThisInitialized":28,"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/getPrototypeOf":32,"@babel/runtime/helpers/inherits":33,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/possibleConstructorReturn":35}],17:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _vanillaLazyload = _interopRequireDefault(require("vanilla-lazyload"));

var BrowserController = /*#__PURE__*/function () {
  function BrowserController(site) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, BrowserController);
    this.state = {
      scrollTop: this.getScroll(),
      scrollLag: this.getScroll(),
      scrollDiff: 0,
      lag: 5,
      toRender: [],
      toResize: [],
      resizeTimeout: null,
      mouse: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        xLag: window.innerWidth / 2,
        yLag: window.innerHeight / 2,
        xSlowLag: window.innerWidth / 2,
        ySlowLag: window.innerHeight / 2,
        lag: 4,
        down: false
      },
      dpi: Math.min(2, window.devicePixelRatio || 1),
      t: 0,
      d: Date.now(),
      delta: 0,
      rate: 0,
      rem: 0,
      isTablet: false,
      isMobile: false
    };
    this.site = site;
    this.lazy = new _vanillaLazyload["default"]({
      "thresholds": "75% 50%"
    });
    this.state.lenis = new Lenis({
      duration: 0.6,
      easing: function easing(t) {
        return Math.min(1, 1.02 - Math.pow(1.5, -10 * t));
      },
      // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      // vertical, horizontal
      gestureDirection: 'vertical',
      // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 0.9,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false
    });
    window.lenis = this.state.lenis;
    this.state.lenis.stop();

    if (site.edit) {
      setInterval(function () {
        _this.lazy.update();
      }, 2000);
    }

    this.init();
  }

  (0, _createClass2["default"])(BrowserController, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.resizeBaseWork(); //window.addEventListener("scroll", this.onScroll.bind(this));

      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('mousedown', this.onMouseDown.bind(this));
      window.addEventListener('mouseup', this.onMouseUp.bind(this));
      window.addEventListener("mouseout", function (e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;

        if (!from || from.nodeName == "HTML") {
          _this2.onMouseUp();
        }
      });
      window.addEventListener('resize', this.onResize.bind(this));
      this.boundRender = this.renderLoop.bind(this);
      this.renderLoop(0);
    }
  }, {
    key: "onScroll",
    value: function onScroll(e) {
      var s = this.getScroll();
      this.state.scrollDiff = s - this.state.scrollTop;
      this.state.scrollTop = s;
    }
  }, {
    key: "getScroll",
    value: function getScroll() {
      return document.documentElement.scrollTop;
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      this.state.mouse.x = e.clientX;
      this.state.mouse.y = e.clientY;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      this.state.mouse.down = true;
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      this.state.mouse.down = false;
    }
  }, {
    key: "addToRenderLoop",
    value: function addToRenderLoop(callback) {
      this.state.toRender.push(callback);
    }
  }, {
    key: "renderBaseWork",
    value: function renderBaseWork(time) {
      this.state.lenis.raf(time);
      this.onScroll();
      this.state.delta = Date.now() - this.state.d;
      this.state.t += this.state.delta;
      this.state.d = Date.now();
      this.state.rate = this.state.delta / 16;
      this.state.mouse.xLag += (this.state.mouse.x - this.state.mouse.xLag) / this.state.mouse.lag;
      this.state.mouse.yLag += (this.state.mouse.y - this.state.mouse.yLag) / this.state.mouse.lag;
      this.state.mouse.xSlowLag += (this.state.mouse.x - this.state.mouse.xSlowLag) / this.state.mouse.lag / 2;
      this.state.mouse.ySlowLag += (this.state.mouse.y - this.state.mouse.ySlowLag) / this.state.mouse.lag / 2;
      this.state.scrollLag += (this.state.scrollTop - this.state.scrollLag) / this.state.lag;
    }
  }, {
    key: "renderLoop",
    value: function renderLoop(time) {
      var _this3 = this;

      this.renderBaseWork(time);
      this.state.toRender.forEach(function (callback) {
        callback(_this3.state.rate);
      });
      requestAnimationFrame(this.boundRender);
    }
  }, {
    key: "addToResizeLoop",
    value: function addToResizeLoop(callback) {
      this.state.toResize.push(callback);
      callback();
    }
  }, {
    key: "resizeBaseWork",
    value: function resizeBaseWork() {
      this.state.rem = window.innerWidth / 100 * (1000 / 1440); // this.state.isTablet = (window.innerWidth <= 1000);
      // if(this.state.isTablet) this.state.rem = window.innerWidth/100 * (1000/834);

      this.state.isMobile = window.innerWidth <= 800;
      if (this.state.isMobile) this.state.rem = window.innerWidth / 100 * (1000 / 375);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      clearTimeout(this.state.resizeTimeout);
      this.state.resizeTimeout = setTimeout(this.resizeLoop.bind(this), 100);
    }
  }, {
    key: "resizeLoop",
    value: function resizeLoop(e) {
      this.resizeBaseWork();
      this.state.toResize.forEach(function (callback) {
        callback();
      });
    }
  }]);
  return BrowserController;
}();

exports["default"] = BrowserController;

},{"@babel/runtime/helpers/classCallCheck":30,"@babel/runtime/helpers/createClass":31,"@babel/runtime/helpers/interopRequireDefault":34,"vanilla-lazyload":72}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initComponents;

var _componentRegister = _interopRequireDefault(require("./componentRegister"));

function initComponents(site) {
  site.components = {
    site: site,
    debug: site.debug,
    all: [],
    mounted: [],
    attachedToPages: []
  };
  window.components = site.components;
  site.components.getComponent = getComponent.bind(site.components);
  site.components.mount = mount.bind(site.components);
  site.components.unmount = unmount.bind(site.components);
  site.components.attachToPages = attachToPages.bind(site.components);
  site.components.mountPage = mountPage.bind(site.components);
  site.components.unmountPage = unmountPage.bind(site.components);
  (0, _componentRegister["default"])(site);
}

function getComponent(name) {
  return this.all.find(function (c) {
    return c.name == name;
  });
}

function mount(component) {
  this.mounted.push({
    component: component
  });
  component.mount(this.site);
}

function unmount(component) {//loop through and remove
}

function attachToPages(pages, component) {
  var _this = this;

  pages.forEach(function (path) {
    _this.attachedToPages.push({
      component: component,
      path: path
    });
  });
}

function mountPage(path) {
  var _this2 = this;

  this.attachedToPages.forEach(function (attach) {
    if (attach.path == path || attach.path == "all") {
      _this2.mounted.push({
        component: attach.component,
        trigger: {
          path: attach.path
        }
      });

      attach.component.mount(_this2.site);
    }
  });
}

function unmountPage(path) {
  var mount;

  for (var i = this.mounted.length - 1; i >= 0; i--) {
    mount = this.mounted[i];

    if (mount.trigger && (mount.trigger.path == path || mount.trigger.path == "all")) {
      mount.component.unmount(this.site);
      this.mounted.splice(i, 1);
    }
  }
}

},{"./componentRegister":19,"@babel/runtime/helpers/interopRequireDefault":34}],19:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = registerComponents;

var _menu = _interopRequireDefault(require("../components/menu"));

var _anima = _interopRequireDefault(require("../components/anima"));

var _homeStickyNav = _interopRequireDefault(require("../components/home-sticky-nav"));

var _audioSlider = _interopRequireDefault(require("../components/audio-slider"));

var _gallerySlider = _interopRequireDefault(require("../components/gallery-slider"));

var _gallery = _interopRequireDefault(require("../components/gallery"));

var _writingFilter = _interopRequireDefault(require("../components/writing-filter"));

var _articleProcessor = _interopRequireDefault(require("../components/article-processor"));

var _albumScroll = _interopRequireDefault(require("../components/album-scroll"));

var _lyrics = _interopRequireDefault(require("../components/lyrics"));

var _spanner = _interopRequireDefault(require("../components/spanner"));

var _linkCopy = _interopRequireDefault(require("../components/link-copy"));

var _cursors = _interopRequireDefault(require("../components/cursors"));

var _subscribe = _interopRequireDefault(require("../components/subscribe"));

var _audioCover = _interopRequireDefault(require("../components/audio-cover"));

// import Accordion from "../components/accordion";
// import Counter from "../components/counter";
// import HTMLClass from "../components/html-class";
// import SliderCards from "../components/scrollpal";
// import ScrollPal from "../components/sliderCards";
// import Looper from "../components/looper";
// import MouseFollow from "../components/mouse-follow";
// import Car from "../components/car";
function registerComponents(site) {
  site.components.all.push(new _menu["default"](site));
  site.components.all.push(new _anima["default"](site));
  site.components.all.push(new _homeStickyNav["default"](site));
  site.components.all.push(new _audioSlider["default"](site));
  site.components.all.push(new _gallerySlider["default"](site));
  site.components.all.push(new _gallery["default"](site));
  site.components.all.push(new _writingFilter["default"](site));
  site.components.all.push(new _articleProcessor["default"](site));
  site.components.all.push(new _albumScroll["default"](site));
  site.components.all.push(new _lyrics["default"](site));
  site.components.all.push(new _spanner["default"](site));
  site.components.all.push(new _linkCopy["default"](site));
  site.components.all.push(new _cursors["default"](site));
  site.components.all.push(new _subscribe["default"](site));
  site.components.all.push(new _audioCover["default"](site));
}

},{"../components/album-scroll":1,"../components/anima":2,"../components/article-processor":3,"../components/audio-cover":4,"../components/audio-slider":5,"../components/cursors":7,"../components/gallery":9,"../components/gallery-slider":8,"../components/home-sticky-nav":10,"../components/link-copy":11,"../components/lyrics":12,"../components/menu":13,"../components/spanner":14,"../components/subscribe":15,"../components/writing-filter":16,"@babel/runtime/helpers/interopRequireDefault":34}],20:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initNavigation;

var _swupPage = _interopRequireDefault(require("../utility/swup-page"));

function initNavigation(site) {
  site.navigation = {
    site: site,
    debug: site.debug,
    callbacks: [],
    menuLinkClicked: null
  };
  site.navigation.enter = enter.bind(site.navigation);
  site.navigation.exit = exit.bind(site.navigation);
  site.navigation.removeCopy = removeCopy.bind(site.navigation);
  site.navigation.runCallbacks = runCallbacks.bind(site.navigation);
  site.navigation.showPreloader = showPreloader.bind(site.navigation);
  site.navigation.navigateTo = navigateTo.bind(site.navigation);
  site.navigation.registerNavigationCallback = registerNavigationCallback.bind(site.navigation);

  if (!site.edit) {
    site.navigation.swup = (0, _swupPage["default"])(site.navigation);
    site.navigation.swup.on('clickLink', handleMenuLinks.bind(site.navigation));
    site.navigation.swup.on('transitionStart', copyPage.bind(site.navigation));
    site.navigation.swup.on("animationInDone", removeCopy.bind(site.navigation));
  }
}

function handleMenuLinks() {
  if (this.menuLinkClicked != null) {
    if (this.menuLinkClicked.href != location.href) {
      var content = document.getElementById("content");
      content.innerHTML = "";
    }
  }
}

function exit() {
  //console.log("exit", this.path);
  this.site.components.unmountPage(this.path);
}

function runCallbacks() {
  this.callbacks.forEach(function (callback, i) {
    if (callback) callback();
  });

  if (this.callback) {
    this.callback();
    this.callback = null;
  }
}

function enter(runCallbacks) {
  if (runCallbacks) this.runCallbacks();
  window.scrollTo(0, 0);
  this.site.browser.state.scrollTop = 0;
  this.site.browser.state.scrollLag = 0;
  this.path = parseLocation();
  this.site.browser.lazy.update();
  this.site.components.mountPage(this.path);
}

function parseLocation(path) {
  if (!path) path = window.location.pathname;
  if (path == "/") return "home";
  if (path == "/audio") return "audio";
  if (path == "/visual") return "visual";
  if (path == "/written") return "written";
  if (path.indexOf("/written/") >= 0) return "article";
  if (path.indexOf("/audio/") >= 0) return "album";
  return "default";
}

function navigateTo(url) {
  var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  if (callback) this.callback = callback;
  this.swup.loadPage({
    url: url,
    method: 'GET',
    customTransition: transition
  });
}

function registerNavigationCallback(callback) {
  this.callbacks.push(callback);
}

function copyPage() {
  // TODO: To fix issues with sticky elements I need to make content fixed and copy take up the page until transition is finished..
  var content = document.getElementById("content");
  var top = content.getBoundingClientRect().top;
  var transition = content.querySelector(".transition-slide");
  if (transition) transition.classList.remove("transition-slide");
  var copy = document.getElementById("copy");
  copy.appendChild(content);
  content.style.transform = "translateY(" + top + "px)";
  document.documentElement.classList.remove("clear");
}

function removeCopy() {
  var copy = document.getElementById("copy");
  copy.innerHTML = "";
  var transition = document.querySelectorAll(".transition-slide");

  for (var i = 0; i < transition.length; i++) {
    transition[i].classList.remove("transition-slide");
  }

  document.documentElement.classList.remove("flipped");
  this.menuLinkClicked = null;
  document.documentElement.classList.add("clear");
} // function showPreloader(site){
//   // let preload = document.getElementById("preload");
//   // let message = document.getElementById("preload-message");
//   // setTimeout(()=> {
//   //   message.classList.add("out");
//   // }, 1200);
//   setTimeout(()=> {
//     site.navigation.enter(false);
//     document.documentElement.classList.remove("is-animating");
//     site.navigation.runCallbacks();
//     setTimeout(removeCopy, 1000);
//   }, 100);
//   // setTimeout(() => {
//   //   preload.remove();
//   // }, 10000);
// }


function showPreloader(site) {
  site.navigation.enter(false);
  var loading = document.getElementById("loading");

  if (site.debug || site.edit) {
    // go straight to page
    document.documentElement.classList.remove("loading");
    document.documentElement.classList.remove("is-animating");
    document.documentElement.classList.remove("scrolled");
    document.documentElement.classList.remove("down");
    loading.remove();
    lenis.start();
    site.navigation.runCallbacks();
  }

  var loadingFinished = function loadingFinished() {
    finishedLoading = true;
    setTimeout(function () {
      document.documentElement.classList.remove("scrolled");
      document.documentElement.classList.remove("down");
    }, 550);
    document.documentElement.classList.remove("is-animating");
    document.documentElement.classList.remove("loading");
    site.navigation.runCallbacks();
    lenis.start();
    setTimeout(function () {
      loading.remove();
      document.documentElement.classList.add("clear");
    }, 1000);
  };

  setTimeout(loadingFinished, 2200);
}

},{"../utility/swup-page":27,"@babel/runtime/helpers/interopRequireDefault":34}],21:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initSite;

var _browserController = _interopRequireDefault(require("./browserController"));

var _navigationController = _interopRequireDefault(require("./navigationController"));

var _componentController = _interopRequireDefault(require("./componentController"));

function initSite() {
  var site = {
    debug: false,
    edit: window.location !== window.parent.location
  };
  site.browser = new _browserController["default"](site);
  (0, _navigationController["default"])(site);
  (0, _componentController["default"])(site);
  site.navigation.showPreloader(site);
}

},{"./browserController":17,"./componentController":18,"./navigationController":20,"@babel/runtime/helpers/interopRequireDefault":34}],22:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _siteController = _interopRequireDefault(require("./core/siteController"));

window.addEventListener('DOMContentLoaded', _siteController["default"]);

},{"./core/siteController":21,"@babel/runtime/helpers/interopRequireDefault":34}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConfirmListeners = addConfirmListeners;

function addConfirmListeners(el, callback, newFocus) {
  if (!el) return;
  el.addEventListener("click", callback);
  el.addEventListener("keydown", function (e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
      callback();

      if (newFocus) {
        e.preventDefault();
        newFocus.focus();
      }
    }
  });
}

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = bezier;

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
var float32ArraySupported = typeof Float32Array === 'function';

function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

function C(aA1) {
  return 3.0 * aA1;
} // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.


function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
} // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.


function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX,
      currentT,
      i = 0;

  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;

    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

  return currentT;
}

function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);

    if (currentSlope === 0.0) {
      return aGuessT;
    }

    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }

  return aGuessT;
}

function LinearEasing(x) {
  return x;
}

function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  } // Precompute samples table


  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }

    --currentSample; // Interpolate to provide an initial guess for t

    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;
    var initialSlope = getSlope(guessForT, mX1, mX2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing(x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }

    if (x === 1) {
      return 1;
    }

    return calcBezier(getTForX(x), mY1, mY2);
  };
}

;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canAudioPlay = canAudioPlay;

function canAudioPlay() {
  return new Promise(function (resolve) {
    var audio = new Audio();
    audio.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAA=="; // short silent mp3

    audio.volume = 0;
    audio.play().then(function () {
      audio.pause();
      resolve(true); // Audio playback allowed
    })["catch"](function (err) {
      resolve(false); // Autoplay blocked
    });
  });
}

},{}],26:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bezier = _interopRequireDefault(require("./bezier"));

var _default = {
  // no easing, no acceleration
  linear: function linear(t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function easeInQuad(t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function easeOutQuad(t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function easeInCubic(t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function easeOutCubic(t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function easeInQuart(t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function easeInOutQuart(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function easeInQuint(t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function easeInOutQuint(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },
  count: new _bezier["default"](0.545, 0.005, 0.175, 0.975),
  customEaseInOut: new _bezier["default"](0.255, 0.000, 0.675, 1.000),
  customEaseIn: new _bezier["default"](0.640, 0.000, 0.685, 0.255),
  customEaseOut: new _bezier["default"](0.040, 0.510, 0.365, 1.005),
  adjust: new _bezier["default"](0.050, 0.385, 0.280, 0.285),
  smooth: new _bezier["default"](.19, 1, .22, 1)
};
exports["default"] = _default;

},{"./bezier":24,"@babel/runtime/helpers/interopRequireDefault":34}],27:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initSwup;

var _swup = _interopRequireDefault(require("swup"));

var _preloadPlugin = _interopRequireDefault(require("@swup/preload-plugin"));

var _scriptsPlugin = _interopRequireDefault(require("@swup/scripts-plugin"));

var _scrollPlugin = _interopRequireDefault(require("@swup/scroll-plugin"));

var _gaPlugin = _interopRequireDefault(require("@swup/ga-plugin"));

function initSwup(navigation) {
  var swup = null;
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  var isEdge = /Edge/.test(navigator.userAgent);

  if (!isIE11 && !isEdge) {
    swup = new _swup["default"]({
      linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]):not([data-popup-url]), a[href^="/"]:not([data-no-swup]):not([data-popup-url]), a[href^="#"]:not([data-no-swup]):not([data-popup-url])',
      containers: ['#main'],
      plugins: [new _preloadPlugin["default"](), new _scriptsPlugin["default"]({
        optin: true
      }), new _gaPlugin["default"](), new _scrollPlugin["default"]({
        doScrollingRightAway: false,
        animateScroll: true,
        scrollFriction: 0.1,
        scrollAcceleration: 0.1
      })]
    });
    document.addEventListener('swup:willReplaceContent', navigation.exit.bind(navigation));
    document.addEventListener('swup:contentReplaced', navigation.enter.bind(navigation));
  } else {
    document.querySelectorAll("a").forEach(function (el) {
      var href = el.getAttribute("href");

      if (href && href != "#" && href != "" && !/mailto/.test(href) && !/tel/.test(href) && el.getAttribute("target") != "_blank") {
        el.addEventListener("click", function () {
          document.documentElement.classList.add("is-animating");
        });
      }
    });
  }

  return swup;
}

},{"@babel/runtime/helpers/interopRequireDefault":34,"@swup/ga-plugin":40,"@swup/preload-plugin":42,"@swup/scripts-plugin":43,"@swup/scroll-plugin":44,"swup":58}],28:[function(require,module,exports){
"use strict";

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],29:[function(require,module,exports){
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],30:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],31:[function(require,module,exports){
"use strict";

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],32:[function(require,module,exports){
"use strict";

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],33:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("./setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{"./setPrototypeOf.js":36}],34:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],35:[function(require,module,exports){
"use strict";

var _typeof = require("./typeof.js")["default"];

var assertThisInitialized = require("./assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{"./assertThisInitialized.js":28,"./typeof.js":37}],36:[function(require,module,exports){
"use strict";

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],37:[function(require,module,exports){
"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}

module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],38:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && (0, _typeof2["default"])(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
(typeof module === "undefined" ? "undefined" : (0, _typeof2["default"])(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : (0, _typeof2["default"])(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37}],39:[function(require,module,exports){
"use strict";

module.exports = require("regenerator-runtime");

},{"regenerator-runtime":38}],40:[function(require,module,exports){
'use strict';

var _interopRequireDefault2 = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault2(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((0, _typeof2["default"])(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (0, _typeof2["default"])(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var GaPlugin = function (_Plugin) {
  _inherits(GaPlugin, _Plugin);

  function GaPlugin(options) {
    _classCallCheck(this, GaPlugin);

    var _this = _possibleConstructorReturn(this, (GaPlugin.__proto__ || Object.getPrototypeOf(GaPlugin)).call(this));

    _this.name = 'GaPlugin';
    var defaultOptions = {
      gaMeasurementId: null
    };
    _this.options = _extends({}, defaultOptions, options);
    return _this;
  }

  _createClass(GaPlugin, [{
    key: 'mount',
    value: function mount() {
      var _this2 = this;

      this.swup.on('contentReplaced', function (event) {
        if (typeof gtag === 'function') {
          var title = document.title;
          var url = window.location.pathname + window.location.search;
          var gaId = _this2.options.gaMeasurementId;

          if (!gaId) {
            throw new Error('gaMeasurementId option is required for gtag.');
          }

          window.gtag('config', gaId, {
            page_title: title,
            page_path: url
          });

          _this2.swup.log('GTAG pageview (url \'' + url + '\').');
        } else if (typeof window.ga === 'function') {
          var _title = document.title;

          var _url = window.location.pathname + window.location.search;

          window.ga('set', 'title', _title);
          window.ga('set', 'page', _url);
          window.ga('send', 'pageview');

          _this2.swup.log('GA pageview (url \'' + _url + '\').');
        } else {
          console.warn("window.gtag and window.ga don't exists.");
        }
      });
    }
  }]);

  return GaPlugin;
}(_plugin2["default"]);

exports["default"] = GaPlugin;

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37,"@swup/plugin":41}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Plugin = function () {
  function Plugin() {
    _classCallCheck(this, Plugin);

    this.isSwupPlugin = true;
  }

  _createClass(Plugin, [{
    key: "mount",
    value: function mount() {// this is mount method rewritten by class extending
      // and is executed when swup is enabled with plugin
    }
  }, {
    key: "unmount",
    value: function unmount() {// this is unmount method rewritten by class extending
      // and is executed when swup with plugin is disabled
    }
  }, {
    key: "_beforeMount",
    value: function _beforeMount() {// here for any future hidden auto init
    }
  }, {
    key: "_afterUnmount",
    value: function _afterUnmount() {} // here for any future hidden auto-cleanup
    // this is here so we can tell if plugin was created by extending this class

  }]);

  return Plugin;
}();

exports["default"] = Plugin;

},{}],42:[function(require,module,exports){
'use strict';

var _interopRequireDefault2 = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault2(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _utils = require('swup/lib/utils');

var _helpers = require('swup/lib/helpers');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((0, _typeof2["default"])(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (0, _typeof2["default"])(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var PreloadPlugin = function (_Plugin) {
  _inherits(PreloadPlugin, _Plugin);

  function PreloadPlugin() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PreloadPlugin);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PreloadPlugin.__proto__ || Object.getPrototypeOf(PreloadPlugin)).call.apply(_ref, [this].concat(args))), _this), _this.name = "PreloadPlugin", _this.onContentReplaced = function () {
      _this.swup.preloadPages();
    }, _this.onMouseover = function (event) {
      var swup = _this.swup;
      swup.triggerEvent('hoverLink', event);
      var link = new _helpers.Link(event.delegateTarget);

      if (link.getAddress() !== (0, _helpers.getCurrentUrl)() && !swup.cache.exists(link.getAddress()) && swup.preloadPromise == null) {
        swup.preloadPromise = swup.preloadPage(link.getAddress());
        swup.preloadPromise.route = link.getAddress();
        swup.preloadPromise["finally"](function () {
          swup.preloadPromise = null;
        });
      }
    }, _this.preloadPage = function (pathname) {
      var swup = _this.swup;
      var link = new _helpers.Link(pathname);
      return new Promise(function (resolve, reject) {
        if (link.getAddress() != (0, _helpers.getCurrentUrl)() && !swup.cache.exists(link.getAddress())) {
          (0, _helpers.fetch)({
            url: link.getAddress(),
            headers: swup.options.requestHeaders
          }, function (response) {
            if (response.status === 500) {
              swup.triggerEvent('serverError');
              reject();
            } else {
              // get json data
              var page = swup.getPageData(response);

              if (page != null) {
                page.url = link.getAddress();
                swup.cache.cacheUrl(page, swup.options.debugMode);
                swup.triggerEvent('pagePreloaded');
              } else {
                reject(link.getAddress());
                return;
              }

              resolve(swup.cache.getPage(link.getAddress()));
            }
          });
        } else {
          resolve(swup.cache.getPage(link.getAddress()));
        }
      });
    }, _this.preloadPages = function () {
      (0, _utils.queryAll)('[data-swup-preload]').forEach(function (element) {
        _this.swup.preloadPage(element.href);
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PreloadPlugin, [{
    key: 'mount',
    value: function mount() {
      var swup = this.swup;
      swup._handlers.pagePreloaded = [];
      swup._handlers.hoverLink = [];
      swup.preloadPage = this.preloadPage;
      swup.preloadPages = this.preloadPages; // register mouseover handler

      swup.delegatedListeners.mouseover = (0, _delegate2["default"])(document.body, swup.options.linkSelector, 'mouseover', this.onMouseover.bind(this)); // initial preload of page form links with [data-swup-preload]

      swup.preloadPages(); // do the same on every content replace

      swup.on('contentReplaced', this.onContentReplaced);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      var swup = this.swup;
      swup._handlers.pagePreloaded = null;
      swup._handlers.hoverLink = null;
      swup.preloadPage = null;
      swup.preloadPages = null;
      swup.delegatedListeners.mouseover.destroy();
      swup.off('contentReplaced', this.onContentReplaced);
    }
  }]);

  return PreloadPlugin;
}(_plugin2["default"]);

exports["default"] = PreloadPlugin;

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37,"@swup/plugin":41,"delegate":46,"swup/lib/helpers":55,"swup/lib/utils":69}],43:[function(require,module,exports){
'use strict';

var _interopRequireDefault2 = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault2(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((0, _typeof2["default"])(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (0, _typeof2["default"])(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var arrayify = function arrayify(list) {
  return Array.prototype.slice.call(list);
};

var ScriptsPlugin = function (_Plugin) {
  _inherits(ScriptsPlugin, _Plugin);

  function ScriptsPlugin(options) {
    _classCallCheck(this, ScriptsPlugin);

    var _this = _possibleConstructorReturn(this, (ScriptsPlugin.__proto__ || Object.getPrototypeOf(ScriptsPlugin)).call(this));

    _this.name = 'ScriptsPlugin';

    _this.runScripts = function () {
      var scope = _this.options.head && _this.options.body ? document : _this.options.head ? document.head : document.body;
      var selector = _this.options.optin ? 'script[data-swup-reload-script]' : 'script:not([data-swup-ignore-script])';
      var scripts = arrayify(scope.querySelectorAll(selector));
      scripts.forEach(function (script) {
        return _this.runScript(script);
      });

      _this.swup.log('Executed ' + scripts.length + ' scripts.');
    };

    _this.runScript = function (originalElement) {
      var element = document.createElement('script');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = arrayify(originalElement.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref2 = _step.value;
          var name = _ref2.name,
              value = _ref2.value;
          element.setAttribute(name, value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      element.textContent = originalElement.textContent;
      element.setAttribute('async', 'false');
      originalElement.replaceWith(element);
      return element;
    };

    var defaultOptions = {
      head: true,
      body: true,
      optin: false
    };
    _this.options = _extends({}, defaultOptions, options);
    return _this;
  }

  _createClass(ScriptsPlugin, [{
    key: 'mount',
    value: function mount() {
      this.swup.on('contentReplaced', this.runScripts);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this.swup.off('contentReplaced', this.runScripts);
    }
  }]);

  return ScriptsPlugin;
}(_plugin2["default"]);

exports["default"] = ScriptsPlugin;

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37,"@swup/plugin":41}],44:[function(require,module,exports){
'use strict';

var _interopRequireDefault2 = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = _interopRequireDefault2(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _typeof = typeof Symbol === "function" && (0, _typeof3["default"])(Symbol.iterator) === "symbol" ? function (obj) {
  return (0, _typeof3["default"])(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : (0, _typeof3["default"])(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _scrl = require('scrl');

var _scrl2 = _interopRequireDefault(_scrl);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((0, _typeof3["default"])(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (0, _typeof3["default"])(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ScrollPlugin = function (_Plugin) {
  _inherits(ScrollPlugin, _Plugin);

  function ScrollPlugin(options) {
    _classCallCheck(this, ScrollPlugin);

    var _this = _possibleConstructorReturn(this, (ScrollPlugin.__proto__ || Object.getPrototypeOf(ScrollPlugin)).call(this));

    _this.name = "ScrollPlugin";

    _this.getOffset = function () {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      switch (_typeof(_this.options.offset)) {
        case 'number':
          return _this.options.offset;

        case 'function':
          return parseInt(_this.options.offset(element), 10);

        default:
          return parseInt(_this.options.offset, 10);
      }
    };

    _this.onSamePage = function () {
      _this.swup.scrollTo(0);
    };

    _this.onSamePageWithHash = function (event) {
      var link = event.delegateTarget;
      var element = document.querySelector(link.hash);

      var top = element.getBoundingClientRect().top + window.pageYOffset - _this.getOffset(element);

      _this.swup.scrollTo(top);
    };

    _this.onTransitionStart = function (popstate) {
      if (_this.options.doScrollingRightAway && !_this.swup.scrollToElement) {
        _this.doScrolling(popstate);
      }
    };

    _this.onContentReplaced = function (popstate) {
      if (!_this.options.doScrollingRightAway || _this.swup.scrollToElement) {
        _this.doScrolling(popstate);
      }
    };

    _this.doScrolling = function (popstate) {
      var swup = _this.swup;

      if (!popstate || swup.options.animateHistoryBrowsing) {
        if (swup.scrollToElement != null) {
          var element = document.querySelector(swup.scrollToElement);

          if (element != null) {
            var top = element.getBoundingClientRect().top + window.pageYOffset - _this.getOffset(element);

            swup.scrollTo(top);
          } else {
            console.warn('Element ' + swup.scrollToElement + ' not found');
          }

          swup.scrollToElement = null;
        } else {
          swup.scrollTo(0);
        }
      }
    };

    var defaultOptions = {
      doScrollingRightAway: false,
      animateScroll: true,
      scrollFriction: 0.3,
      scrollAcceleration: 0.04,
      offset: 0
    };
    _this.options = _extends({}, defaultOptions, options);
    return _this;
  }

  _createClass(ScrollPlugin, [{
    key: 'mount',
    value: function mount() {
      var _this2 = this;

      var swup = this.swup; // add empty handlers array for submitForm event

      swup._handlers.scrollDone = [];
      swup._handlers.scrollStart = [];
      this.scrl = new _scrl2["default"]({
        onStart: function onStart() {
          return swup.triggerEvent('scrollStart');
        },
        onEnd: function onEnd() {
          return swup.triggerEvent('scrollDone');
        },
        onCancel: function onCancel() {
          return swup.triggerEvent('scrollDone');
        },
        friction: this.options.scrollFriction,
        acceleration: this.options.scrollAcceleration
      }); // set scrollTo method of swup and animate based on current animateScroll option

      swup.scrollTo = function (offset) {
        if (_this2.options.animateScroll) {
          _this2.scrl.scrollTo(offset);
        } else {
          swup.triggerEvent('scrollStart');
          window.scrollTo(0, offset);
          swup.triggerEvent('scrollDone');
        }
      }; // disable browser scroll control on popstates when
      // animateHistoryBrowsing option is enabled in swup


      if (swup.options.animateHistoryBrowsing) {
        window.history.scrollRestoration = 'manual';
      } // scroll to the top of the page


      swup.on('samePage', this.onSamePage); // scroll to referenced element on the same page

      swup.on('samePageWithHash', this.onSamePageWithHash); // scroll to the referenced element

      swup.on('transitionStart', this.onTransitionStart); // scroll to the referenced element when it's in the page (after render)

      swup.on('contentReplaced', this.onContentReplaced);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this.swup.scrollTo = null;
      delete this.scrl;
      this.scrl = null;
      this.swup.off('samePage', this.onSamePage);
      this.swup.off('samePageWithHash', this.onSamePageWithHash);
      this.swup.off('transitionStart', this.onTransitionStart);
      this.swup.off('contentReplaced', this.onContentReplaced);
      this.swup._handlers.scrollDone = null;
      this.swup._handlers.scrollStart = null;
      window.history.scrollRestoration = 'auto';
    }
  }]);

  return ScrollPlugin;
}(_plugin2["default"]);

exports["default"] = ScrollPlugin;

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37,"@swup/plugin":41,"scrl":48}],45:[function(require,module,exports){
"use strict";

var DOCUMENT_NODE_TYPE = 9;
/**
 * A polyfill for Element.matches()
 */

if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  var proto = Element.prototype;
  proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
}
/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */


function closest(element, selector) {
  while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
    if (typeof element.matches === 'function' && element.matches(selector)) {
      return element;
    }

    element = element.parentNode;
  }
}

module.exports = closest;

},{}],46:[function(require,module,exports){
"use strict";

var closest = require('./closest');
/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */


function _delegate(element, selector, type, callback, useCapture) {
  var listenerFn = listener.apply(this, arguments);
  element.addEventListener(type, listenerFn, useCapture);
  return {
    destroy: function destroy() {
      element.removeEventListener(type, listenerFn, useCapture);
    }
  };
}
/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */


function delegate(elements, selector, type, callback, useCapture) {
  // Handle the regular Element usage
  if (typeof elements.addEventListener === 'function') {
    return _delegate.apply(null, arguments);
  } // Handle Element-less usage, it defaults to global delegation


  if (typeof type === 'function') {
    // Use `document` as the first parameter, then apply arguments
    // This is a short way to .unshift `arguments` without running into deoptimizations
    return _delegate.bind(null, document).apply(null, arguments);
  } // Handle Selector-based usage


  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  } // Handle Array-like based usage


  return Array.prototype.map.call(elements, function (element) {
    return _delegate(element, selector, type, callback, useCapture);
  });
}
/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */


function listener(element, selector, type, callback) {
  return function (e) {
    e.delegateTarget = closest(e.target, selector);

    if (e.delegateTarget) {
      callback.call(element, e);
    }
  };
}

module.exports = delegate;

},{"./closest":45}],47:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/*!
 * in-view 0.6.1 - Get notified when a DOM element enters or exits the viewport.
 * Copyright (c) 2016 Cam Wiegert <cam@camwiegert.com> - https://camwiegert.github.io/in-view
 * License: MIT
 */
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : (0, _typeof2["default"])(exports)) && "object" == (typeof module === "undefined" ? "undefined" : (0, _typeof2["default"])(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : (0, _typeof2["default"])(exports)) ? exports.inView = e() : t.inView = e();
}(void 0, function () {
  return function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;
      var i = n[r] = {
        exports: {},
        id: r,
        loaded: !1
      };
      return t[r].call(i.exports, i, i.exports, e), i.loaded = !0, i.exports;
    }

    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0);
  }([function (t, e, n) {
    "use strict";

    function r(t) {
      return t && t.__esModule ? t : {
        "default": t
      };
    }

    var i = n(2),
        o = r(i);
    t.exports = o["default"];
  }, function (t, e) {
    function n(t) {
      var e = (0, _typeof2["default"])(t);
      return null != t && ("object" == e || "function" == e);
    }

    t.exports = n;
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return t && t.__esModule ? t : {
        "default": t
      };
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var i = n(9),
        o = r(i),
        u = n(3),
        f = r(u),
        s = n(4),
        c = function c() {
      if ("undefined" != typeof window) {
        var t = 100,
            e = ["scroll", "resize", "load"],
            n = {
          history: []
        },
            r = {
          offset: {},
          threshold: 0,
          test: s.inViewport
        },
            i = (0, o["default"])(function () {
          n.history.forEach(function (t) {
            n[t].check();
          });
        }, t);
        e.forEach(function (t) {
          return addEventListener(t, i);
        }), window.MutationObserver && addEventListener("DOMContentLoaded", function () {
          new MutationObserver(i).observe(document.body, {
            attributes: !0,
            childList: !0,
            subtree: !0
          });
        });

        var u = function u(t) {
          if ("string" == typeof t) {
            var e = [].slice.call(document.querySelectorAll(t));
            return n.history.indexOf(t) > -1 ? n[t].elements = e : (n[t] = (0, f["default"])(e, r), n.history.push(t)), n[t];
          }
        };

        return u.offset = function (t) {
          if (void 0 === t) return r.offset;

          var e = function e(t) {
            return "number" == typeof t;
          };

          return ["top", "right", "bottom", "left"].forEach(e(t) ? function (e) {
            return r.offset[e] = t;
          } : function (n) {
            return e(t[n]) ? r.offset[n] = t[n] : null;
          }), r.offset;
        }, u.threshold = function (t) {
          return "number" == typeof t && t >= 0 && t <= 1 ? r.threshold = t : r.threshold;
        }, u.test = function (t) {
          return "function" == typeof t ? r.test = t : r.test;
        }, u.is = function (t) {
          return r.test(t, r);
        }, u.offset(0), u;
      }
    };

    e["default"] = c();
  }, function (t, e) {
    "use strict";

    function n(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var r = function () {
      function t(t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
        }
      }

      return function (e, n, r) {
        return n && t(e.prototype, n), r && t(e, r), e;
      };
    }(),
        i = function () {
      function t(e, r) {
        n(this, t), this.options = r, this.elements = e, this.current = [], this.handlers = {
          enter: [],
          exit: []
        }, this.singles = {
          enter: [],
          exit: []
        };
      }

      return r(t, [{
        key: "check",
        value: function value() {
          var t = this;
          return this.elements.forEach(function (e) {
            var n = t.options.test(e, t.options),
                r = t.current.indexOf(e),
                i = r > -1,
                o = n && !i,
                u = !n && i;
            o && (t.current.push(e), t.emit("enter", e)), u && (t.current.splice(r, 1), t.emit("exit", e));
          }), this;
        }
      }, {
        key: "on",
        value: function value(t, e) {
          return this.handlers[t].push(e), this;
        }
      }, {
        key: "once",
        value: function value(t, e) {
          return this.singles[t].unshift(e), this;
        }
      }, {
        key: "emit",
        value: function value(t, e) {
          for (; this.singles[t].length;) {
            this.singles[t].pop()(e);
          }

          for (var n = this.handlers[t].length; --n > -1;) {
            this.handlers[t][n](e);
          }

          return this;
        }
      }]), t;
    }();

    e["default"] = function (t, e) {
      return new i(t, e);
    };
  }, function (t, e) {
    "use strict";

    function n(t, e) {
      var n = t.getBoundingClientRect(),
          r = n.top,
          i = n.right,
          o = n.bottom,
          u = n.left,
          f = n.width,
          s = n.height,
          c = {
        t: o,
        r: window.innerWidth - u,
        b: window.innerHeight - r,
        l: i
      },
          a = {
        x: e.threshold * f,
        y: e.threshold * s
      };
      return c.t > e.offset.top + a.y && c.r > e.offset.right + a.x && c.b > e.offset.bottom + a.y && c.l > e.offset.left + a.x;
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.inViewport = n;
  }, function (t, e) {
    (function (e) {
      var n = "object" == (0, _typeof2["default"])(e) && e && e.Object === Object && e;
      t.exports = n;
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, n) {
    var r = n(5),
        i = "object" == (typeof self === "undefined" ? "undefined" : (0, _typeof2["default"])(self)) && self && self.Object === Object && self,
        o = r || i || Function("return this")();
    t.exports = o;
  }, function (t, e, n) {
    function r(t, e, n) {
      function r(e) {
        var n = x,
            r = m;
        return x = m = void 0, E = e, w = t.apply(r, n);
      }

      function a(t) {
        return E = t, j = setTimeout(h, e), M ? r(t) : w;
      }

      function l(t) {
        var n = t - O,
            r = t - E,
            i = e - n;
        return _ ? c(i, g - r) : i;
      }

      function d(t) {
        var n = t - O,
            r = t - E;
        return void 0 === O || n >= e || n < 0 || _ && r >= g;
      }

      function h() {
        var t = o();
        return d(t) ? p(t) : void (j = setTimeout(h, l(t)));
      }

      function p(t) {
        return j = void 0, T && x ? r(t) : (x = m = void 0, w);
      }

      function v() {
        void 0 !== j && clearTimeout(j), E = 0, x = O = m = j = void 0;
      }

      function y() {
        return void 0 === j ? w : p(o());
      }

      function b() {
        var t = o(),
            n = d(t);

        if (x = arguments, m = this, O = t, n) {
          if (void 0 === j) return a(O);
          if (_) return j = setTimeout(h, e), r(O);
        }

        return void 0 === j && (j = setTimeout(h, e)), w;
      }

      var x,
          m,
          g,
          w,
          j,
          O,
          E = 0,
          M = !1,
          _ = !1,
          T = !0;

      if ("function" != typeof t) throw new TypeError(f);
      return e = u(e) || 0, i(n) && (M = !!n.leading, _ = "maxWait" in n, g = _ ? s(u(n.maxWait) || 0, e) : g, T = "trailing" in n ? !!n.trailing : T), b.cancel = v, b.flush = y, b;
    }

    var i = n(1),
        o = n(8),
        u = n(10),
        f = "Expected a function",
        s = Math.max,
        c = Math.min;
    t.exports = r;
  }, function (t, e, n) {
    var r = n(6),
        i = function i() {
      return r.Date.now();
    };

    t.exports = i;
  }, function (t, e, n) {
    function r(t, e, n) {
      var r = !0,
          f = !0;
      if ("function" != typeof t) throw new TypeError(u);
      return o(n) && (r = "leading" in n ? !!n.leading : r, f = "trailing" in n ? !!n.trailing : f), i(t, e, {
        leading: r,
        maxWait: e,
        trailing: f
      });
    }

    var i = n(7),
        o = n(1),
        u = "Expected a function";
    t.exports = r;
  }, function (t, e) {
    function n(t) {
      return t;
    }

    t.exports = n;
  }]);
});

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Scrl = function Scrl(options) {
  var _this = this;

  _classCallCheck(this, Scrl);

  this._raf = null;
  this._positionY = 0;
  this._velocityY = 0;
  this._targetPositionY = 0;
  this._targetPositionYWithOffset = 0;
  this._direction = 0;

  this.scrollTo = function (offset) {
    if (offset && offset.nodeType) {
      // the offset is element
      _this._targetPositionY = Math.round(offset.getBoundingClientRect().top + window.pageYOffset);
    } else if (parseInt(_this._targetPositionY) === _this._targetPositionY) {
      // the offset is a number
      _this._targetPositionY = Math.round(offset);
    } else {
      console.error('Argument must be a number or an element.');
      return;
    } // don't animate beyond the document height


    if (_this._targetPositionY > document.documentElement.scrollHeight - window.innerHeight) {
      _this._targetPositionY = document.documentElement.scrollHeight - window.innerHeight;
    } // calculated required values


    _this._positionY = document.body.scrollTop || document.documentElement.scrollTop;
    _this._direction = _this._positionY > _this._targetPositionY ? -1 : 1;
    _this._targetPositionYWithOffset = _this._targetPositionY + _this._direction;
    _this._velocityY = 0;

    if (_this._positionY !== _this._targetPositionY) {
      // start animation
      _this.options.onStart();

      _this._animate();
    } else {
      // page is already at the position
      _this.options.onAlreadyAtPositions();
    }
  };

  this._animate = function () {
    var distance = _this._update();

    _this._render();

    if (_this._direction === 1 && _this._targetPositionY > _this._positionY || _this._direction === -1 && _this._targetPositionY < _this._positionY) {
      // calculate next position
      _this._raf = requestAnimationFrame(_this._animate);

      _this.options.onTick();
    } else {
      // finish and set position to the final position
      _this._positionY = _this._targetPositionY;

      _this._render();

      _this._raf = null;

      _this.options.onTick();

      _this.options.onEnd(); // this.triggerEvent('scrollDone')

    }
  };

  this._update = function () {
    var distance = _this._targetPositionYWithOffset - _this._positionY;
    var attraction = distance * _this.options.acceleration;
    _this._velocityY += attraction;
    _this._velocityY *= _this.options.friction;
    _this._positionY += _this._velocityY;
    return Math.abs(distance);
  };

  this._render = function () {
    window.scrollTo(0, _this._positionY);
  }; // default options


  var defaults = {
    onAlreadyAtPositions: function onAlreadyAtPositions() {},
    onCancel: function onCancel() {},
    onEnd: function onEnd() {},
    onStart: function onStart() {},
    onTick: function onTick() {},
    friction: .7,
    // 1 - .3
    acceleration: .04 // merge options

  };
  this.options = _extends({}, defaults, options); // set reverse friction

  if (options && options.friction) {
    this.options.friction = 1 - options.friction;
  } // register listener for cancel on wheel event


  window.addEventListener('mousewheel', function (event) {
    if (_this._raf) {
      _this.options.onCancel();

      cancelAnimationFrame(_this._raf);
      _this._raf = null;
    }
  }, {
    passive: true
  });
};

exports["default"] = Scrl;

},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Link = function () {
  function Link(elementOrUrl) {
    _classCallCheck(this, Link);

    if (elementOrUrl instanceof Element || elementOrUrl instanceof SVGElement) {
      this.link = elementOrUrl;
    } else {
      this.link = document.createElement('a');
      this.link.href = elementOrUrl;
    }
  }

  _createClass(Link, [{
    key: 'getPath',
    value: function getPath() {
      var path = this.link.pathname;

      if (path[0] !== '/') {
        path = '/' + path;
      }

      return path;
    }
  }, {
    key: 'getAddress',
    value: function getAddress() {
      var path = this.link.pathname + this.link.search;

      if (this.link.getAttribute('xlink:href')) {
        path = this.link.getAttribute('xlink:href');
      }

      if (path[0] !== '/') {
        path = '/' + path;
      }

      return path;
    }
  }, {
    key: 'getHash',
    value: function getHash() {
      return this.link.hash;
    }
  }]);

  return Link;
}();

exports["default"] = Link;

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var classify = function classify(text) {
  var output = text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
  .replace(/\//g, '-') // Replace / with -
  .replace(/[^\w\-]+/g, '') // Remove all non-word chars
  .replace(/\-\-+/g, '-') // Replace multiple - with single -
  .replace(/^-+/, '') // Trim - from start of text
  .replace(/-+$/, ''); // Trim - from end of text

  if (output[0] === '/') output = output.splice(1);
  if (output === '') output = 'homepage';
  return output;
};

exports["default"] = classify;

},{}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createHistoryRecord = function createHistoryRecord(url) {
  window.history.pushState({
    url: url || window.location.href.split(window.location.hostname)[1],
    random: Math.random(),
    source: 'swup'
  }, document.getElementsByTagName('title')[0].innerText, url || window.location.href.split(window.location.hostname)[1]);
};

exports["default"] = createHistoryRecord;

},{}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var fetch = function fetch(setOptions) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var defaults = {
    url: window.location.pathname + window.location.search,
    method: 'GET',
    data: null,
    headers: {}
  };

  var options = _extends({}, defaults, setOptions);

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status !== 500) {
        callback(request);
      } else {
        callback(request);
      }
    }
  };

  request.open(options.method, options.url, true);
  Object.keys(options.headers).forEach(function (key) {
    request.setRequestHeader(key, options.headers[key]);
  });
  request.send(options.data);
  return request;
};

exports["default"] = fetch;

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getCurrentUrl = function getCurrentUrl() {
  return window.location.pathname + window.location.search;
};

exports["default"] = getCurrentUrl;

},{}],54:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && (0, _typeof3["default"])(Symbol.iterator) === "symbol" ? function (obj) {
  return (0, _typeof3["default"])(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : (0, _typeof3["default"])(obj);
};

var _utils = require('../utils');

var getDataFromHtml = function getDataFromHtml(html, containers) {
  var fakeDom = document.createElement('html');
  fakeDom.innerHTML = html;
  var blocks = [];

  var _loop = function _loop(i) {
    if (fakeDom.querySelector(containers[i]) == null) {
      // page in invalid
      return {
        v: null
      };
    } else {
      (0, _utils.queryAll)(containers[i]).forEach(function (item, index) {
        (0, _utils.queryAll)(containers[i], fakeDom)[index].setAttribute('data-swup', blocks.length); // marks element with data-swup

        blocks.push((0, _utils.queryAll)(containers[i], fakeDom)[index].outerHTML);
      });
    }
  };

  for (var i = 0; i < containers.length; i++) {
    var _ret = _loop(i);

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  var json = {
    title: fakeDom.querySelector('title').innerText,
    pageClass: fakeDom.querySelector('body').className,
    originalContent: html,
    blocks: blocks
  }; // to prevent memory leaks

  fakeDom.innerHTML = '';
  fakeDom = null;
  return json;
};

exports["default"] = getDataFromHtml;

},{"../utils":69,"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.markSwupElements = exports.getCurrentUrl = exports.transitionEnd = exports.fetch = exports.getDataFromHtml = exports.createHistoryRecord = exports.classify = undefined;

var _classify = require('./classify');

var _classify2 = _interopRequireDefault(_classify);

var _createHistoryRecord = require('./createHistoryRecord');

var _createHistoryRecord2 = _interopRequireDefault(_createHistoryRecord);

var _getDataFromHtml = require('./getDataFromHtml');

var _getDataFromHtml2 = _interopRequireDefault(_getDataFromHtml);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _transitionEnd = require('./transitionEnd');

var _transitionEnd2 = _interopRequireDefault(_transitionEnd);

var _getCurrentUrl = require('./getCurrentUrl');

var _getCurrentUrl2 = _interopRequireDefault(_getCurrentUrl);

var _markSwupElements = require('./markSwupElements');

var _markSwupElements2 = _interopRequireDefault(_markSwupElements);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var classify = exports.classify = _classify2["default"];
var createHistoryRecord = exports.createHistoryRecord = _createHistoryRecord2["default"];
var getDataFromHtml = exports.getDataFromHtml = _getDataFromHtml2["default"];
var fetch = exports.fetch = _fetch2["default"];
var transitionEnd = exports.transitionEnd = _transitionEnd2["default"];
var getCurrentUrl = exports.getCurrentUrl = _getCurrentUrl2["default"];
var markSwupElements = exports.markSwupElements = _markSwupElements2["default"];
var Link = exports.Link = _Link2["default"];

},{"./Link":49,"./classify":50,"./createHistoryRecord":51,"./fetch":52,"./getCurrentUrl":53,"./getDataFromHtml":54,"./markSwupElements":56,"./transitionEnd":57}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var markSwupElements = function markSwupElements(element, containers) {
  var blocks = 0;

  var _loop = function _loop(i) {
    if (element.querySelector(containers[i]) == null) {
      console.warn('Element ' + containers[i] + ' is not in current page.');
    } else {
      (0, _utils.queryAll)(containers[i]).forEach(function (item, index) {
        (0, _utils.queryAll)(containers[i], element)[index].setAttribute('data-swup', blocks);
        blocks++;
      });
    }
  };

  for (var i = 0; i < containers.length; i++) {
    _loop(i);
  }
};

exports["default"] = markSwupElements;

},{"../utils":69}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var transitionEnd = function transitionEnd() {
  var el = document.createElement('div');
  var transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };

  for (var name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      return transEndEventNames[name];
    }
  }

  return false;
};

exports["default"] = transitionEnd;

},{}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}(); // modules


var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _Cache = require('./modules/Cache');

var _Cache2 = _interopRequireDefault(_Cache);

var _loadPage = require('./modules/loadPage');

var _loadPage2 = _interopRequireDefault(_loadPage);

var _renderPage = require('./modules/renderPage');

var _renderPage2 = _interopRequireDefault(_renderPage);

var _triggerEvent = require('./modules/triggerEvent');

var _triggerEvent2 = _interopRequireDefault(_triggerEvent);

var _on = require('./modules/on');

var _on2 = _interopRequireDefault(_on);

var _off = require('./modules/off');

var _off2 = _interopRequireDefault(_off);

var _updateTransition = require('./modules/updateTransition');

var _updateTransition2 = _interopRequireDefault(_updateTransition);

var _getAnimationPromises = require('./modules/getAnimationPromises');

var _getAnimationPromises2 = _interopRequireDefault(_getAnimationPromises);

var _getPageData = require('./modules/getPageData');

var _getPageData2 = _interopRequireDefault(_getPageData);

var _plugins = require('./modules/plugins');

var _utils = require('./utils');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Swup = function () {
  function Swup(setOptions) {
    _classCallCheck(this, Swup); // default options


    var defaults = {
      animateHistoryBrowsing: false,
      animationSelector: '[class*="transition-"]',
      linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
      cache: true,
      containers: ['#swup'],
      requestHeaders: {
        'X-Requested-With': 'swup',
        Accept: 'text/html, application/xhtml+xml'
      },
      plugins: [],
      skipPopStateHandling: function skipPopStateHandling(event) {
        return !(event.state && event.state.source === 'swup');
      }
    }; // merge options

    var options = _extends({}, defaults, setOptions); // handler arrays


    this._handlers = {
      animationInDone: [],
      animationInStart: [],
      animationOutDone: [],
      animationOutStart: [],
      animationSkipped: [],
      clickLink: [],
      contentReplaced: [],
      disabled: [],
      enabled: [],
      openPageInNewTab: [],
      pageLoaded: [],
      pageRetrievedFromCache: [],
      pageView: [],
      popState: [],
      samePage: [],
      samePageWithHash: [],
      serverError: [],
      transitionStart: [],
      transitionEnd: [],
      willReplaceContent: []
    }; // variable for id of element to scroll to after render

    this.scrollToElement = null; // variable for promise used for preload, so no new loading of the same page starts while page is loading

    this.preloadPromise = null; // variable for save options

    this.options = options; // variable for plugins array

    this.plugins = []; // variable for current transition object

    this.transition = {}; // variable for keeping event listeners from "delegate"

    this.delegatedListeners = {}; // so we are able to remove the listener

    this.boundPopStateHandler = this.popStateHandler.bind(this); // make modules accessible in instance

    this.cache = new _Cache2["default"]();
    this.cache.swup = this;
    this.loadPage = _loadPage2["default"];
    this.renderPage = _renderPage2["default"];
    this.triggerEvent = _triggerEvent2["default"];
    this.on = _on2["default"];
    this.off = _off2["default"];
    this.updateTransition = _updateTransition2["default"];
    this.getAnimationPromises = _getAnimationPromises2["default"];
    this.getPageData = _getPageData2["default"];

    this.log = function () {}; // here so it can be used by plugins


    this.use = _plugins.use;
    this.unuse = _plugins.unuse;
    this.findPlugin = _plugins.findPlugin; // enable swup

    this.enable();
  }

  _createClass(Swup, [{
    key: 'enable',
    value: function enable() {
      var _this = this; // check for Promise support


      if (typeof Promise === 'undefined') {
        console.warn('Promise is not supported');
        return;
      } // add event listeners


      this.delegatedListeners.click = (0, _delegate2["default"])(document, this.options.linkSelector, 'click', this.linkClickHandler.bind(this));
      window.addEventListener('popstate', this.boundPopStateHandler); // initial save to cache

      var page = (0, _helpers.getDataFromHtml)(document.documentElement.outerHTML, this.options.containers);
      page.url = page.responseURL = (0, _helpers.getCurrentUrl)();

      if (this.options.cache) {
        this.cache.cacheUrl(page);
      } // mark swup blocks in html


      (0, _helpers.markSwupElements)(document.documentElement, this.options.containers); // mount plugins

      this.options.plugins.forEach(function (plugin) {
        _this.use(plugin);
      }); // modify initial history record

      window.history.replaceState(Object.assign({}, window.history.state, {
        url: window.location.href,
        random: Math.random(),
        source: 'swup'
      }), document.title, window.location.href); // trigger enabled event

      this.triggerEvent('enabled'); // add swup-enabled class to html tag

      document.documentElement.classList.add('swup-enabled'); // trigger page view event

      this.triggerEvent('pageView');
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this; // remove delegated listeners


      this.delegatedListeners.click.destroy(); // remove popstate listener

      window.removeEventListener('popstate', this.boundPopStateHandler); // empty cache

      this.cache.empty(); // unmount plugins

      this.options.plugins.forEach(function (plugin) {
        _this2.unuse(plugin);
      }); // remove swup data atributes from blocks

      (0, _utils.queryAll)('[data-swup]').forEach(function (element) {
        element.removeAttribute('data-swup');
      }); // remove handlers

      this.off(); // trigger disable event

      this.triggerEvent('disabled'); // remove swup-enabled class from html tag

      document.documentElement.classList.remove('swup-enabled');
    }
  }, {
    key: 'linkClickHandler',
    value: function linkClickHandler(event) {
      // no control key pressed
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        // index of pressed button needs to be checked because Firefox triggers click on all mouse buttons
        if (event.button === 0) {
          this.triggerEvent('clickLink', event);
          event.preventDefault();
          var link = new _helpers.Link(event.delegateTarget);

          if (link.getAddress() == (0, _helpers.getCurrentUrl)() || link.getAddress() == '') {
            // link to the same URL
            if (link.getHash() != '') {
              // link to the same URL with hash
              this.triggerEvent('samePageWithHash', event);
              var element = document.querySelector(link.getHash());

              if (element != null) {
                history.replaceState({
                  url: link.getAddress() + link.getHash(),
                  random: Math.random(),
                  source: 'swup'
                }, document.title, link.getAddress() + link.getHash());
              } else {
                // referenced element not found
                console.warn('Element for offset not found (' + link.getHash() + ')');
              }
            } else {
              // link to the same URL without hash
              this.triggerEvent('samePage', event);
            }
          } else {
            // link to different url
            if (link.getHash() != '') {
              this.scrollToElement = link.getHash();
            } // get custom transition from data


            var customTransition = event.delegateTarget.getAttribute('data-swup-transition'); // load page

            this.loadPage({
              url: link.getAddress(),
              customTransition: customTransition
            }, false);
          }
        }
      } else {
        // open in new tab (do nothing)
        this.triggerEvent('openPageInNewTab', event);
      }
    }
  }, {
    key: 'popStateHandler',
    value: function popStateHandler(event) {
      if (this.options.skipPopStateHandling(event)) return;
      var link = new _helpers.Link(event.state ? event.state.url : window.location.pathname);

      if (link.getHash() !== '') {
        this.scrollToElement = link.getHash();
      } else {
        event.preventDefault();
      }

      this.triggerEvent('popState', event);
      this.loadPage({
        url: link.getAddress()
      }, event);
    }
  }]);

  return Swup;
}();

exports["default"] = Swup;

},{"./helpers":55,"./modules/Cache":59,"./modules/getAnimationPromises":60,"./modules/getPageData":61,"./modules/loadPage":62,"./modules/off":63,"./modules/on":64,"./modules/plugins":65,"./modules/renderPage":66,"./modules/triggerEvent":67,"./modules/updateTransition":68,"./utils":69,"delegate":71}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Cache = exports.Cache = function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.pages = {};
    this.last = null;
  }

  _createClass(Cache, [{
    key: 'cacheUrl',
    value: function cacheUrl(page) {
      if (page.url in this.pages === false) {
        this.pages[page.url] = page;
      }

      this.last = this.pages[page.url];
      this.swup.log('Cache (' + Object.keys(this.pages).length + ')', this.pages);
    }
  }, {
    key: 'getPage',
    value: function getPage(url) {
      return this.pages[url];
    }
  }, {
    key: 'getCurrentPage',
    value: function getCurrentPage() {
      return this.getPage(window.location.pathname + window.location.search);
    }
  }, {
    key: 'exists',
    value: function exists(url) {
      return url in this.pages;
    }
  }, {
    key: 'empty',
    value: function empty() {
      this.pages = {};
      this.last = null;
      this.swup.log('Cache cleared');
    }
  }, {
    key: 'remove',
    value: function remove(url) {
      delete this.pages[url];
    }
  }]);

  return Cache;
}();

exports["default"] = Cache;

},{}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _helpers = require('../helpers');

var getAnimationPromises = function getAnimationPromises() {
  var promises = [];
  var animatedElements = (0, _utils.queryAll)(this.options.animationSelector);
  animatedElements.forEach(function (element) {
    var promise = new Promise(function (resolve) {
      element.addEventListener((0, _helpers.transitionEnd)(), function (event) {
        if (element == event.target) {
          resolve();
        }
      });
    });
    promises.push(promise);
  });
  return promises;
};

exports["default"] = getAnimationPromises;

},{"../helpers":55,"../utils":69}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../helpers');

var getPageData = function getPageData(request) {
  // this method can be replaced in case other content than html is expected to be received from server
  // this function should always return {title, pageClass, originalContent, blocks, responseURL}
  // in case page has invalid structure - return null
  var html = request.responseText;
  var pageObject = (0, _helpers.getDataFromHtml)(html, this.options.containers);

  if (pageObject) {
    pageObject.responseURL = request.responseURL ? request.responseURL : window.location.href;
  } else {
    console.warn('Received page is invalid.');
    return null;
  }

  return pageObject;
};

exports["default"] = getPageData;

},{"../helpers":55}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _helpers = require('../helpers');

var loadPage = function loadPage(data, popstate) {
  var _this = this; // create array for storing animation promises


  var animationPromises = [],
      xhrPromise = void 0;

  var animateOut = function animateOut() {
    _this.triggerEvent('animationOutStart'); // handle classes


    document.documentElement.classList.add('is-changing');
    document.documentElement.classList.add('is-leaving');
    document.documentElement.classList.add('is-animating');

    if (popstate) {
      document.documentElement.classList.add('is-popstate');
    }

    document.documentElement.classList.add('to-' + (0, _helpers.classify)(data.url)); // animation promise stuff

    animationPromises = _this.getAnimationPromises('out');
    Promise.all(animationPromises).then(function () {
      _this.triggerEvent('animationOutDone');
    }); // create history record if this is not a popstate call

    if (!popstate) {
      // create pop element with or without anchor
      var state = void 0;

      if (_this.scrollToElement != null) {
        state = data.url + _this.scrollToElement;
      } else {
        state = data.url;
      }

      (0, _helpers.createHistoryRecord)(state);
    }
  };

  this.triggerEvent('transitionStart', popstate); // set transition object

  if (data.customTransition != null) {
    this.updateTransition(window.location.pathname, data.url, data.customTransition);
    document.documentElement.classList.add('to-' + (0, _helpers.classify)(data.customTransition));
  } else {
    this.updateTransition(window.location.pathname, data.url);
  } // start/skip animation


  if (!popstate || this.options.animateHistoryBrowsing) {
    animateOut();
  } else {
    this.triggerEvent('animationSkipped');
  } // start/skip loading of page


  if (this.cache.exists(data.url)) {
    xhrPromise = new Promise(function (resolve) {
      resolve();
    });
    this.triggerEvent('pageRetrievedFromCache');
  } else {
    if (!this.preloadPromise || this.preloadPromise.route != data.url) {
      xhrPromise = new Promise(function (resolve, reject) {
        (0, _helpers.fetch)(_extends({}, data, {
          headers: _this.options.requestHeaders
        }), function (response) {
          if (response.status === 500) {
            _this.triggerEvent('serverError');

            reject(data.url);
            return;
          } else {
            // get json data
            var page = _this.getPageData(response);

            if (page != null) {
              page.url = data.url;
            } else {
              reject(data.url);
              return;
            } // render page


            _this.cache.cacheUrl(page);

            _this.triggerEvent('pageLoaded');
          }

          resolve();
        });
      });
    } else {
      xhrPromise = this.preloadPromise;
    }
  } // when everything is ready, handle the outcome


  Promise.all(animationPromises.concat([xhrPromise])).then(function () {
    // render page
    _this.renderPage(_this.cache.getPage(data.url), popstate);

    _this.preloadPromise = null;
  })["catch"](function (errorUrl) {
    // rewrite the skipPopStateHandling function to redirect manually when the history.go is processed
    _this.options.skipPopStateHandling = function () {
      window.location = errorUrl;
      return true;
    }; // go back to the actual page were still at


    window.history.go(-1);
  });
};

exports["default"] = loadPage;

},{"../helpers":55}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var off = function off(event, handler) {
  var _this = this;

  if (event != null) {
    if (handler != null) {
      if (this._handlers[event] && this._handlers[event].filter(function (savedHandler) {
        return savedHandler === handler;
      }).length) {
        var toRemove = this._handlers[event].filter(function (savedHandler) {
          return savedHandler === handler;
        })[0];

        var index = this._handlers[event].indexOf(toRemove);

        if (index > -1) {
          this._handlers[event].splice(index, 1);
        }
      } else {
        console.warn("Handler for event '" + event + "' no found.");
      }
    } else {
      this._handlers[event] = [];
    }
  } else {
    Object.keys(this._handlers).forEach(function (keys) {
      _this._handlers[keys] = [];
    });
  }
};

exports["default"] = off;

},{}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var on = function on(event, handler) {
  if (this._handlers[event]) {
    this._handlers[event].push(handler);
  } else {
    console.warn("Unsupported event " + event + ".");
  }
};

exports["default"] = on;

},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var use = exports.use = function use(plugin) {
  if (!plugin.isSwupPlugin) {
    console.warn('Not swup plugin instance ' + plugin + '.');
    return;
  }

  this.plugins.push(plugin);
  plugin.swup = this;

  if (typeof plugin._beforeMount === 'function') {
    plugin._beforeMount();
  }

  plugin.mount();
  return this.plugins;
};

var unuse = exports.unuse = function unuse(plugin) {
  var pluginReference = void 0;

  if (typeof plugin === 'string') {
    pluginReference = this.plugins.find(function (p) {
      return plugin === p.name;
    });
  } else {
    pluginReference = plugin;
  }

  if (!pluginReference) {
    console.warn('No such plugin.');
    return;
  }

  pluginReference.unmount();

  if (typeof pluginReference._afterUnmount === 'function') {
    pluginReference._afterUnmount();
  }

  var index = this.plugins.indexOf(pluginReference);
  this.plugins.splice(index, 1);
  return this.plugins;
};

var findPlugin = exports.findPlugin = function findPlugin(pluginName) {
  return this.plugins.find(function (p) {
    return pluginName === p.name;
  });
};

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _utils = require('../utils');

var _helpers = require('../helpers');

var renderPage = function renderPage(page, popstate) {
  var _this = this;

  document.documentElement.classList.remove('is-leaving'); // replace state in case the url was redirected

  var link = new _helpers.Link(page.responseURL);

  if (window.location.pathname !== link.getPath()) {
    window.history.replaceState({
      url: link.getPath(),
      random: Math.random(),
      source: 'swup'
    }, document.title, link.getPath()); // save new record for redirected url

    this.cache.cacheUrl(_extends({}, page, {
      url: link.getPath()
    }));
  } // only add for non-popstate transitions


  if (!popstate || this.options.animateHistoryBrowsing) {
    document.documentElement.classList.add('is-rendering');
  }

  this.triggerEvent('willReplaceContent', popstate); // replace blocks

  for (var i = 0; i < page.blocks.length; i++) {
    document.body.querySelector('[data-swup="' + i + '"]').outerHTML = page.blocks[i];
  } // set title


  document.title = page.title;
  this.triggerEvent('contentReplaced', popstate);
  this.triggerEvent('pageView', popstate); // empty cache if it's disabled (because pages could be preloaded and stuff)

  if (!this.options.cache) {
    this.cache.empty();
  } // start animation IN


  setTimeout(function () {
    if (!popstate || _this.options.animateHistoryBrowsing) {
      _this.triggerEvent('animationInStart');

      document.documentElement.classList.remove('is-animating');
    }
  }, 10); // handle end of animation

  if (!popstate || this.options.animateHistoryBrowsing) {
    var animationPromises = this.getAnimationPromises('in');
    Promise.all(animationPromises).then(function () {
      _this.triggerEvent('animationInDone');

      _this.triggerEvent('transitionEnd', popstate); // remove "to-{page}" classes


      document.documentElement.className.split(' ').forEach(function (classItem) {
        if (new RegExp('^to-').test(classItem) || classItem === 'is-changing' || classItem === 'is-rendering' || classItem === 'is-popstate') {
          document.documentElement.classList.remove(classItem);
        }
      });
    });
  } else {
    this.triggerEvent('transitionEnd', popstate);
  } // reset scroll-to element


  this.scrollToElement = null;
};

exports["default"] = renderPage;

},{"../helpers":55,"../utils":69}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var triggerEvent = function triggerEvent(eventName, originalEvent) {
  // call saved handlers with "on" method and pass originalEvent object if available
  this._handlers[eventName].forEach(function (handler) {
    try {
      handler(originalEvent);
    } catch (error) {
      console.error(error);
    }
  }); // trigger event on document with prefix "swup:"


  var event = new CustomEvent('swup:' + eventName, {
    detail: eventName
  });
  document.dispatchEvent(event);
};

exports["default"] = triggerEvent;

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var updateTransition = function updateTransition(from, to, custom) {
  // transition routes
  this.transition = {
    from: from,
    to: to,
    custom: custom
  };
};

exports["default"] = updateTransition;

},{}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var query = exports.query = function query(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  if (typeof selector !== 'string') {
    return selector;
  }

  return context.querySelector(selector);
};

var queryAll = exports.queryAll = function queryAll(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  if (typeof selector !== 'string') {
    return selector;
  }

  return Array.prototype.slice.call(context.querySelectorAll(selector));
};

},{}],70:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],71:[function(require,module,exports){
"use strict";

var closest = require('./closest');
/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */


function delegate(element, selector, type, callback, useCapture) {
  var listenerFn = listener.apply(this, arguments);
  element.addEventListener(type, listenerFn, useCapture);
  return {
    destroy: function destroy() {
      element.removeEventListener(type, listenerFn, useCapture);
    }
  };
}
/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */


function listener(element, selector, type, callback) {
  return function (e) {
    e.delegateTarget = closest(e.target, selector);

    if (e.delegateTarget) {
      callback.call(element, e);
    }
  };
}

module.exports = delegate;

},{"./closest":70}],72:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

!function (n, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : (0, _typeof2["default"])(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (n = "undefined" != typeof globalThis ? globalThis : n || self).LazyLoad = t();
}(void 0, function () {
  "use strict";

  function n() {
    return n = Object.assign || function (n) {
      for (var t = 1; t < arguments.length; t++) {
        var e = arguments[t];

        for (var i in e) {
          Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
        }
      }

      return n;
    }, n.apply(this, arguments);
  }

  var t = "undefined" != typeof window,
      e = t && !("onscroll" in window) || "undefined" != typeof navigator && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),
      i = t && "IntersectionObserver" in window,
      o = t && "classList" in document.createElement("p"),
      a = t && window.devicePixelRatio > 1,
      r = {
    elements_selector: ".lazy",
    container: e || t ? document : null,
    threshold: 300,
    thresholds: null,
    data_src: "src",
    data_srcset: "srcset",
    data_sizes: "sizes",
    data_bg: "bg",
    data_bg_hidpi: "bg-hidpi",
    data_bg_multi: "bg-multi",
    data_bg_multi_hidpi: "bg-multi-hidpi",
    data_poster: "poster",
    class_applied: "applied",
    class_loading: "loading",
    class_loaded: "loaded",
    class_error: "error",
    class_entered: "entered",
    class_exited: "exited",
    unobserve_completed: !0,
    unobserve_entered: !1,
    cancel_on_exit: !0,
    callback_enter: null,
    callback_exit: null,
    callback_applied: null,
    callback_loading: null,
    callback_loaded: null,
    callback_error: null,
    callback_finish: null,
    callback_cancel: null,
    use_native: !1
  },
      c = function c(t) {
    return n({}, r, t);
  },
      u = function u(n, t) {
    var e,
        i = "LazyLoad::Initialized",
        o = new n(t);

    try {
      e = new CustomEvent(i, {
        detail: {
          instance: o
        }
      });
    } catch (n) {
      (e = document.createEvent("CustomEvent")).initCustomEvent(i, !1, !1, {
        instance: o
      });
    }

    window.dispatchEvent(e);
  },
      l = "src",
      s = "srcset",
      f = "sizes",
      d = "poster",
      _ = "llOriginalAttrs",
      g = "loading",
      v = "loaded",
      b = "applied",
      p = "error",
      h = "native",
      m = "data-",
      E = "ll-status",
      I = function I(n, t) {
    return n.getAttribute(m + t);
  },
      y = function y(n) {
    return I(n, E);
  },
      A = function A(n, t) {
    return function (n, t, e) {
      var i = "data-ll-status";
      null !== e ? n.setAttribute(i, e) : n.removeAttribute(i);
    }(n, 0, t);
  },
      k = function k(n) {
    return A(n, null);
  },
      L = function L(n) {
    return null === y(n);
  },
      w = function w(n) {
    return y(n) === h;
  },
      x = [g, v, b, p],
      O = function O(n, t, e, i) {
    n && (void 0 === i ? void 0 === e ? n(t) : n(t, e) : n(t, e, i));
  },
      N = function N(n, t) {
    o ? n.classList.add(t) : n.className += (n.className ? " " : "") + t;
  },
      C = function C(n, t) {
    o ? n.classList.remove(t) : n.className = n.className.replace(new RegExp("(^|\\s+)" + t + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
  },
      M = function M(n) {
    return n.llTempImage;
  },
      z = function z(n, t) {
    if (t) {
      var e = t._observer;
      e && e.unobserve(n);
    }
  },
      R = function R(n, t) {
    n && (n.loadingCount += t);
  },
      T = function T(n, t) {
    n && (n.toLoadCount = t);
  },
      G = function G(n) {
    for (var t, e = [], i = 0; t = n.children[i]; i += 1) {
      "SOURCE" === t.tagName && e.push(t);
    }

    return e;
  },
      D = function D(n, t) {
    var e = n.parentNode;
    e && "PICTURE" === e.tagName && G(e).forEach(t);
  },
      V = function V(n, t) {
    G(n).forEach(t);
  },
      F = [l],
      j = [l, d],
      P = [l, s, f],
      S = function S(n) {
    return !!n[_];
  },
      U = function U(n) {
    return n[_];
  },
      $ = function $(n) {
    return delete n[_];
  },
      q = function q(n, t) {
    if (!S(n)) {
      var e = {};
      t.forEach(function (t) {
        e[t] = n.getAttribute(t);
      }), n[_] = e;
    }
  },
      H = function H(n, t) {
    if (S(n)) {
      var e = U(n);
      t.forEach(function (t) {
        !function (n, t, e) {
          e ? n.setAttribute(t, e) : n.removeAttribute(t);
        }(n, t, e[t]);
      });
    }
  },
      B = function B(n, t, e) {
    N(n, t.class_loading), A(n, g), e && (R(e, 1), O(t.callback_loading, n, e));
  },
      J = function J(n, t, e) {
    e && n.setAttribute(t, e);
  },
      K = function K(n, t) {
    J(n, f, I(n, t.data_sizes)), J(n, s, I(n, t.data_srcset)), J(n, l, I(n, t.data_src));
  },
      Q = {
    IMG: function IMG(n, t) {
      D(n, function (n) {
        q(n, P), K(n, t);
      }), q(n, P), K(n, t);
    },
    IFRAME: function IFRAME(n, t) {
      q(n, F), J(n, l, I(n, t.data_src));
    },
    VIDEO: function VIDEO(n, t) {
      V(n, function (n) {
        q(n, F), J(n, l, I(n, t.data_src));
      }), q(n, j), J(n, d, I(n, t.data_poster)), J(n, l, I(n, t.data_src)), n.load();
    }
  },
      W = ["IMG", "IFRAME", "VIDEO"],
      X = function X(n, t) {
    !t || function (n) {
      return n.loadingCount > 0;
    }(t) || function (n) {
      return n.toLoadCount > 0;
    }(t) || O(n.callback_finish, t);
  },
      Y = function Y(n, t, e) {
    n.addEventListener(t, e), n.llEvLisnrs[t] = e;
  },
      Z = function Z(n, t, e) {
    n.removeEventListener(t, e);
  },
      nn = function nn(n) {
    return !!n.llEvLisnrs;
  },
      tn = function tn(n) {
    if (nn(n)) {
      var t = n.llEvLisnrs;

      for (var e in t) {
        var i = t[e];
        Z(n, e, i);
      }

      delete n.llEvLisnrs;
    }
  },
      en = function en(n, t, e) {
    !function (n) {
      delete n.llTempImage;
    }(n), R(e, -1), function (n) {
      n && (n.toLoadCount -= 1);
    }(e), C(n, t.class_loading), t.unobserve_completed && z(n, e);
  },
      on = function on(n, t, e) {
    var i = M(n) || n;
    nn(i) || function (n, t, e) {
      nn(n) || (n.llEvLisnrs = {});
      var i = "VIDEO" === n.tagName ? "loadeddata" : "load";
      Y(n, i, t), Y(n, "error", e);
    }(i, function (o) {
      !function (n, t, e, i) {
        var o = w(t);
        en(t, e, i), N(t, e.class_loaded), A(t, v), O(e.callback_loaded, t, i), o || X(e, i);
      }(0, n, t, e), tn(i);
    }, function (o) {
      !function (n, t, e, i) {
        var o = w(t);
        en(t, e, i), N(t, e.class_error), A(t, p), O(e.callback_error, t, i), o || X(e, i);
      }(0, n, t, e), tn(i);
    });
  },
      an = function an(n, t, e) {
    !function (n) {
      n.llTempImage = document.createElement("IMG");
    }(n), on(n, t, e), function (n) {
      S(n) || (n[_] = {
        backgroundImage: n.style.backgroundImage
      });
    }(n), function (n, t, e) {
      var i = I(n, t.data_bg),
          o = I(n, t.data_bg_hidpi),
          r = a && o ? o : i;
      r && (n.style.backgroundImage = 'url("'.concat(r, '")'), M(n).setAttribute(l, r), B(n, t, e));
    }(n, t, e), function (n, t, e) {
      var i = I(n, t.data_bg_multi),
          o = I(n, t.data_bg_multi_hidpi),
          r = a && o ? o : i;
      r && (n.style.backgroundImage = r, function (n, t, e) {
        N(n, t.class_applied), A(n, b), e && (t.unobserve_completed && z(n, t), O(t.callback_applied, n, e));
      }(n, t, e));
    }(n, t, e);
  },
      rn = function rn(n, t, e) {
    !function (n) {
      return W.indexOf(n.tagName) > -1;
    }(n) ? an(n, t, e) : function (n, t, e) {
      on(n, t, e), function (n, t, e) {
        var i = Q[n.tagName];
        i && (i(n, t), B(n, t, e));
      }(n, t, e);
    }(n, t, e);
  },
      cn = function cn(n) {
    n.removeAttribute(l), n.removeAttribute(s), n.removeAttribute(f);
  },
      un = function un(n) {
    D(n, function (n) {
      H(n, P);
    }), H(n, P);
  },
      ln = {
    IMG: un,
    IFRAME: function IFRAME(n) {
      H(n, F);
    },
    VIDEO: function VIDEO(n) {
      V(n, function (n) {
        H(n, F);
      }), H(n, j), n.load();
    }
  },
      sn = function sn(n, t) {
    (function (n) {
      var t = ln[n.tagName];
      t ? t(n) : function (n) {
        if (S(n)) {
          var t = U(n);
          n.style.backgroundImage = t.backgroundImage;
        }
      }(n);
    })(n), function (n, t) {
      L(n) || w(n) || (C(n, t.class_entered), C(n, t.class_exited), C(n, t.class_applied), C(n, t.class_loading), C(n, t.class_loaded), C(n, t.class_error));
    }(n, t), k(n), $(n);
  },
      fn = ["IMG", "IFRAME", "VIDEO"],
      dn = function dn(n) {
    return n.use_native && "loading" in HTMLImageElement.prototype;
  },
      _n = function _n(n, t, e) {
    n.forEach(function (n) {
      return function (n) {
        return n.isIntersecting || n.intersectionRatio > 0;
      }(n) ? function (n, t, e, i) {
        var o = function (n) {
          return x.indexOf(y(n)) >= 0;
        }(n);

        A(n, "entered"), N(n, e.class_entered), C(n, e.class_exited), function (n, t, e) {
          t.unobserve_entered && z(n, e);
        }(n, e, i), O(e.callback_enter, n, t, i), o || rn(n, e, i);
      }(n.target, n, t, e) : function (n, t, e, i) {
        L(n) || (N(n, e.class_exited), function (n, t, e, i) {
          e.cancel_on_exit && function (n) {
            return y(n) === g;
          }(n) && "IMG" === n.tagName && (tn(n), function (n) {
            D(n, function (n) {
              cn(n);
            }), cn(n);
          }(n), un(n), C(n, e.class_loading), R(i, -1), k(n), O(e.callback_cancel, n, t, i));
        }(n, t, e, i), O(e.callback_exit, n, t, i));
      }(n.target, n, t, e);
    });
  },
      gn = function gn(n) {
    return Array.prototype.slice.call(n);
  },
      vn = function vn(n) {
    return n.container.querySelectorAll(n.elements_selector);
  },
      bn = function bn(n) {
    return function (n) {
      return y(n) === p;
    }(n);
  },
      pn = function pn(n, t) {
    return function (n) {
      return gn(n).filter(L);
    }(n || vn(t));
  },
      hn = function hn(n, e) {
    var o = c(n);
    this._settings = o, this.loadingCount = 0, function (n, t) {
      i && !dn(n) && (t._observer = new IntersectionObserver(function (e) {
        _n(e, n, t);
      }, function (n) {
        return {
          root: n.container === document ? null : n.container,
          rootMargin: n.thresholds || n.threshold + "px"
        };
      }(n)));
    }(o, this), function (n, e) {
      t && window.addEventListener("online", function () {
        !function (n, t) {
          var e;
          (e = vn(n), gn(e).filter(bn)).forEach(function (t) {
            C(t, n.class_error), k(t);
          }), t.update();
        }(n, e);
      });
    }(o, this), this.update(e);
  };

  return hn.prototype = {
    update: function update(n) {
      var t,
          o,
          a = this._settings,
          r = pn(n, a);
      T(this, r.length), !e && i ? dn(a) ? function (n, t, e) {
        n.forEach(function (n) {
          -1 !== fn.indexOf(n.tagName) && function (n, t, e) {
            n.setAttribute("loading", "lazy"), on(n, t, e), function (n, t) {
              var e = Q[n.tagName];
              e && e(n, t);
            }(n, t), A(n, h);
          }(n, t, e);
        }), T(e, 0);
      }(r, a, this) : (o = r, function (n) {
        n.disconnect();
      }(t = this._observer), function (n, t) {
        t.forEach(function (t) {
          n.observe(t);
        });
      }(t, o)) : this.loadAll(r);
    },
    destroy: function destroy() {
      this._observer && this._observer.disconnect(), vn(this._settings).forEach(function (n) {
        $(n);
      }), delete this._observer, delete this._settings, delete this.loadingCount, delete this.toLoadCount;
    },
    loadAll: function loadAll(n) {
      var t = this,
          e = this._settings;
      pn(n, e).forEach(function (n) {
        z(n, t), rn(n, e, t);
      });
    },
    restoreAll: function restoreAll() {
      var n = this._settings;
      vn(n).forEach(function (t) {
        sn(t, n);
      });
    }
  }, hn.load = function (n, t) {
    var e = c(t);
    rn(n, e);
  }, hn.resetStatus = function (n) {
    k(n);
  }, t && function (n, t) {
    if (t) if (t.length) for (var e, i = 0; e = t[i]; i += 1) {
      u(n, e);
    } else u(n, t);
  }(hn, window.lazyLoadOptions), hn;
});

},{"@babel/runtime/helpers/interopRequireDefault":34,"@babel/runtime/helpers/typeof":37}]},{},[22]);
