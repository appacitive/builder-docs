/**
 * Transformer module.
 * This takes care of any HTML mangling needed.  The main entry point is
 * `.mangle()` which applies all transformations needed.
 *
 *     var $content = $("<p>Hello there, this is a docu...");
 *     Transformer.mangle($content);
 *
 */

var Transformer = {};

/**
 * Takes a given HTML `$content` and improves the markup of it by executing
 * the transformations.
 *
 * > See: [Transformer](#transformer)
 */
Transformer.mangle = function($content) {
  this.addIDs($content);
};

var slugify = function (text) {
  return text.toLowerCase().match(/[a-z0-9]+/g).join('-');
};

/**
 * Adds IDs to headings.
 */
Transformer.addIDs = function($content) {
  $content.find('h1, h2, h3, h4').each(function() {
    var $el = $(this);
    var text = $el.text();
    var id = slugify(text);
    $el.attr('id', id);
  });
};

/**
 * Returns menu data for a given HTML.
 *
 *     menu = Flatdoc.transformer.getMenu($content);
 *     menu == {
 *       level: 0,
 *       items: [{
 *         section: "Getting started",
 *         level: 1,
 *         items: [...]}, ...]}
 */
Transformer.getMenu = function($content) {
  var root = {items: [], id: '', level: 0};
  var cache = [root];

  function mkdir_p(level) {
    var parent = (level > 1) ? mkdir_p(level-1) : root;
    if (!cache[level]) {
      var obj = { items: [], level: level };
      cache[level] = obj;
      parent.items.push(obj);
      return obj;
    }
    return cache[level];
  }

  $content.find('h1, h2, h3, h4').each(function() {
    var $el = $(this);
    var level = +(this.nodeName.substr(1));

    parent = mkdir_p(level-1);

    var obj = { section: $el.text(), items: [], level: level, id: $el.attr('id') };
    parent.items.push(obj);
    cache[level] = obj;
  });

  return root;
};

var setMenuEl = function(menu, $el) {

  function process(node, $parent) {
    var id = node.id || 'root';

    var $li = $('<li>')
      .attr('id', id + '-item')
      .addClass('level-' + node.level)
      .appendTo($parent);

    if (node.section) {
      var $a = $('<a>')
        .html(node.section)
        .attr('id', id + '-link')
        .attr('href', '#' + node.id)
        .addClass('level-' + node.level)
        .appendTo($li);
    }

    if (node.items.length > 0) {
      var $ul = $('<ul class="nav nav-stacked">')
        .addClass('level-' + (node.level+1))
        .attr('id', id + '-list')
        .appendTo($li);

      node.items.forEach(function(item) {
        process(item, $ul);
      });
    }
  }

  process(menu, $el);
  return $el;
};

// Mangle html 
Transformer.mangle($('#divDocContent'));
var menu = Transformer.getMenu($('#divDocContent'));
for(var i=0; i< menu.items.length; i= i+1) {
  setMenuEl(menu.items[i], $("ul#sidebar"));
}

$('.bs-docs-sidebar').show();

/**
 * Add scrollspy to generated sidebar
 */
$('body').scrollspy({
  target: ".doc-nav"
});

/**
 * Add affix for content specific navigation
 */

var sidebar = $('.bs-docs-sidebar');
$('.bs-docs-sidebar').affix({
  offset: {
    top: function() {
        var c = sidebar.offset().top, d = parseInt(sidebar.children(0).css("margin-top"), 10) + 20, e = $("#divHeader").height();
        return this.top = c - e - d
    }, bottom: function() {
        return this.bottom = $("#divFooter").outerHeight(!0) + 166;
    }
  }
});

$('.back-to-top').show();

if (window.location.hash == '') {
  $("ul#sidebar").children('li').first().addClass('active');
}