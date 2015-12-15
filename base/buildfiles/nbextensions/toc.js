// adapted from https://gist.github.com/magican/5574556
// modified to:
// - fix TOC nesting (sublists inside <li>),
// - choose between numbered/unnumbered lists (depending on whether the
//   headings are already numbered or not)

define( ["require", "jquery", "base/js/namespace"],
	function (require, $, IPython) {

  "use strict";

  var create_toc_div = function () {
    var toc_wrapper = $('<div id="toc-wrapper"/>')
    .append(
      $("<div/>")
      .addClass("header")
      .text("Contents ")
      .click( function(){
        $('#toc').slideToggle();
        $('#toc-wrapper').toggleClass('closed');
        if ($('#toc-wrapper').hasClass('closed')){
          $('#toc-wrapper .hide-btn')
          .text('[+]')
          .attr('title', 'Show ToC');
        } else {
          $('#toc-wrapper .hide-btn')
          .text('[-]')
          .attr('title', 'Hide ToC');
        }
        return false;
      }).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("hide-btn")
        .attr('title', 'Hide ToC')
        .text("[-]")
      ).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("reload-btn")
        .text("  \u21BB")
        .attr('title', 'Reload ToC')
        .click( function(){
          table_of_contents();
          return false;
        })
      )
    ).append(
        $("<div/>").attr("id", "toc")
    );
    toc_wrapper.hide();
    $("body").append(toc_wrapper);
  };

  var table_of_contents = function (threshold) {
    if (threshold === undefined) {
      threshold = 4;
    }
    var toc_wrapper = $("#toc-wrapper");
    if (toc_wrapper.length === 0) {
      create_toc_div();
    }
  
    // Traverse all headings, check if they are numbered and collect data
    var numreg = /^\d[.\d]*\s/;
    var hasNumbers = true;
    var hdrList = new Array();
    $("#notebook").find(":header").map( function(i,h) {
      var hLevel = parseInt( h.nodeName.substring(1) );
      var hTitle = $(h).contents().filter( function() {return this.nodeType==3;} ).text();
      if( hLevel > 1 )	// we ignore if <H1> has numbers or not
	hasNumbers &= numreg.test( hTitle );
      hdrList.push( [ hLevel, h.id, hTitle ] );
      //alert( [i,hLevel,h.tagName,h.id,hTitle,numreg.test(hTitle)].join('|') );
    } );
    //alert( hdrList.toString() );

    // Decide if we will use numbered or number-less lists
    var listClass = hasNumbers ? 'toc-item-noc' : 'toc-item';

    // Initialize the container
    var ol = $("<ol/>");
    ol.addClass( listClass );
    $("#toc").empty().append(ol);

    // Loop through all the collected headers and create the ToC
    var depth = 1;
    var li;
    for( var idx=0; idx<hdrList.length; idx++ ) {
      var hdr = hdrList[idx];
      var level = hdr[0];
      // skip below threshold, or headings with no ID to link to
      if (level > threshold || !hdr[1])
	continue;
      // walk down levels
      for (; depth < level; depth++) {
        var new_ol = $("<ol/>");
        new_ol.addClass(listClass);
        li.append(new_ol);
        ol = new_ol;
      }
      // walk up levels
      for (; depth > level; depth--) {
	// up twice: the enclosing <ol> and the <li> it was inserted in
        ol = ol.parent().parent();
      }
      // insert the ToC element
      var a = $("<a/>").attr( "href", '#'+hdr[1] ).text( hdr[2] );
      li = $("<li/>").append( a );
      ol.append( li );
    }

    $(window).resize(function(){
      $('#toc').css({maxHeight: $(window).height() - 200});
    });

    $(window).trigger('resize');
  };
    
  var toggle_toc = function () {
    // toggle draw (first because of first-click behavior)
    $("#toc-wrapper").toggle();
    // recompute:
    table_of_contents();
  };
  
  var toc_button = function () {
    if (!IPython.toolbar) {
      $([IPython.events]).on("app_initialized.NotebookApp", toc_button);
      return;
    }
    if ($("#toc_button").length === 0) {
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Table of Contents',
          'icon'    : 'fa-list',
          'callback': toggle_toc,
          'id'      : 'toc_button'
        },
      ]);
    }
  };
  
  var load_css = function () {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./toc.css");
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  
  var load_ipython_extension = function () {
    load_css();
    toc_button();
    table_of_contents();
    // $([IPython.events]).on("notebook_loaded.Notebook", table_of_contents);
    $([IPython.events]).on("notebook_saved.Notebook", table_of_contents);
  };

  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents,
    
  };

});
