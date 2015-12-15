// Based on the Search&Replace extension at:
// https://github.com/ipython-contrib/IPython-notebook-extensions/wiki/Search-&-Replace
// Adds a search box to the notebook toolbar and selects search word if found
// Can wrap search around the notebook

define([
    'base/js/namespace',
    'jquery',
    'require',
    'codemirror/addon/search/search',
    'codemirror/addon/search/searchcursor'
],   function(IPython, $, require) {
    "use strict";

    /**
     * Search/replace a string within the complete notebook, starting at current cell or
     * CodeMirror selection
     * @param hotkey
     * @param replace {boolean}
     * @returns {boolean}
     */
    var search = function(hotkey,replace) {
        /* execute search operation only after pressing return key or button click */
        if (hotkey != 0 && hotkey != 13) {
            return false;
        }

	if( replace )
	    replace = $('#searchbar_replace_text').val();
    
        var findString = $('#searchbar_search_text').val();
	var do_wrap = $('#searchbar_wrap').hasClass('active');
	var case_sensitive = !$('#searchbar_case_sensitive').hasClass('active');

	var ncells = IPython.notebook.ncells();
	var cindex = IPython.notebook.get_selected_index();
	var cell = IPython.notebook.get_cell( cindex );
	for( var i=1; i<=ncells; i++ ) {

	    if (cell.rendered == true && cell.cell_type == "markdown" ) 
		cell.unrender();

	    // Search in this cell, from the cursor current position
	    var cur = cell.code_mirror.getCursor();
	    var find = cell.code_mirror.getSearchCursor(findString,cur,case_sensitive);
	    if( find.find() == true ) {
		// found! Select it and return
		IPython.notebook.scroll_cell_percent( cindex, 50 );
		cell.code_mirror.setSelection(find.pos.from,find.pos.to);
		if( replace )
		    cell.code_mirror.replaceSelection(replace,'around');
		cell.code_mirror.focus();
		return;
	    }

	    // Not found in this cell. Go to the next one

	    // Erase the current selection
	    if( cell.code_mirror.somethingSelected() )
		cell.code_mirror.setCursor( {line:0, ch:0} );

	    // Find the next cell
	    if( cindex < ncells-1 )
		cindex++;
	    else if( do_wrap )
		cindex = 0
	    else
		break; // Not found. We're done

	    // Prepare the next cell for searching
	    IPython.notebook.select( cindex );
	    IPython.notebook.edit_mode();
	    cell = IPython.notebook.get_cell( cindex );
	    cell.code_mirror.setCursor( {line:0, ch:0} );
	}

	// No match. Terminate search
	cell.code_mirror.setCursor( {line:0, ch:0} );
	cell.code_mirror.focus();
    };

    /**
     * Create floating toolbar
     *
     */
    var create_searchbar_div = function () {
        var btn = '<div class="btn-toolbar">\
                    <div class="btn-group">\
                    <label for="usr">Search text:</label>\
                     <input id="searchbar_search_text" type="text" class="form-control searchbar_input">\
                     <button id="searchbar_search" class="btn btn-primary fa fa-search searchbar_buttons"></button>\
                     <button id="searchbar_case_sensitive" class="btn btn-primary searchbar_buttons" data-toggle="button" value="OFF" >aA</button>\
                     <button id="searchbar_wrap" class="btn btn-primary fa fa-level-up searchbar_buttons" data-toggle="button" value="OFF" ></button>\
                   </div>\
                    <div class="btn-group">\
                    <label for="usr">Replace text:</label>\
                     <input id="searchbar_replace_text" type="text" class="form-control searchbar_input">\
                     <button type="button" id="searchbar_replace" class="btn btn-primary fa fa-search searchbar_buttons"></button>\
                   </div>\
                 </div>';

        var searchbar_wrapper = $('<div id="searchbar-wrapper">')
	//.text("Searchbar")
           .append(btn)
           .draggable()
           .append("</div>");

        $("#header").append(searchbar_wrapper);
        $("#searchbar-wrapper").css({'position' : 'absolute'});

        $('#searchbar_search').on('click', function() { search(0,false); this.blur(); })
            .tooltip({ title : 'Search text' , delay: {show: 500, hide: 100}});
        $('#searchbar_case_sensitive').on('click', function() {  this.blur(); })
            .tooltip({ title : 'Case sensitive' , delay: {show: 500, hide: 100}});
        $('#searchbar_wrap').on('click', function() {  this.blur(); })
            .tooltip({ title : 'Wrap' , delay: {show: 500, hide: 100}});
        $('#searchbar_replace').on('click', function() { search(0,true); this.blur(); })
            .tooltip({ title : 'Replace text' , delay: {show: 500, hide: 100}});
        $('#searchbar_search_text').on('keyup', function(event) { search(event.keyCode);});
        $('#searchbar_replace_text').on('keyup', function(event) { replace(event.keyCode);});
        IPython.notebook.keyboard_manager.register_events($('#searchbar_search_text'));
        IPython.notebook.keyboard_manager.register_events($('#searchbar_replace_text'));
    };

    /**
     * Show/hide toolbar
     *
     */
    var toggle_toolbar = function() {
        var dom = $("#searchbar-wrapper");

        if (dom.is(':visible')) {
            $('#toggle_searchbar').removeClass('active').blur();
            dom.hide();
        } else {
            $('#toggle_searchbar').addClass('active');
            dom.show();
        }

        if (dom.length === 0) {
            create_searchbar_div()
        }

    };

   IPython.toolbar.add_buttons_group([
           {
               id : 'toggle_searchbar',
               label : 'Toggle Search Toolbar',
               icon : 'fa-search',
               callback : function () {
                   toggle_toolbar();
                   $('#searchbar_search_text')
                   }
           }
        ]);

    $("#toggle_searchbar").css({'outline' : 'none'});

   /**
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    /**
     * Initialize extension
     */
    var load_ipython_extension = function() {
        load_css('./search-replace.css');

        /* Add keyboard shortcuts for search and replace.
         * Hardcoded for now, should be configurable
         */
        var add_shortcuts = {
            'f' : {
                help    : 'search',
                help_index : 'se',
                handler : function() {
                    if (!$('#toggle_searchbar').hasClass('active')) {
                        toggle_toolbar();
                    }
                    $('#searchbar_search_text').focus();
                    return false;
                }
            },
            'r' : {
                help    : 'replace',
                help_index : 're',
                handler : function() {
                    if (!$('#toggle_searchbar').hasClass('active')) {
                        toggle_toolbar();
                    }
                    $('#searchbar_replace_text').focus();
                    return false;
                }
            }
        };

        IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_shortcuts);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
