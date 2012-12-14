/**
 * @fileOverview jquery-bulk-action, the jQuery Bulk Actions Helper
 * @author <a href="mailto:thibaut.decaudain@gmail.com">Thibaut Decaudain</a>
 * @requires jQuery 1.6+
 *
 * Use under either MIT like jQuery
 * License: http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
 *
 * Project home: https://github.com/tricote/jquery-bulk-actions
 */


(function ($) {

  var bulkState = function (options) {
    this.options = options;
    return this;
  };

  bulkState.prototype = {

    /**
     * Default options
     **/
    defaults: {
      // The name of the data attribute that holds the id of the items 
      checkboxDataItemId: "item-id",

      // The local storage Key to use to store selected item ids
      storageKey: "selectedItemIds"
    },

    init: function () {
      // Introduce defaults that can be extended either
      this.config = $.extend({}, this.defaults, this.options);

      if (this.config.dumpField) {
        this.dumpField = this.config.dumpField;
        this.$dumpField = $(this.dumpField);
      }

      if (this.config.checkAllOnPageElement) {
        this.$checkAllOnPageElement = $(this.config.checkAllOnPageElement);
        this.$checkAllOnPageElement.on('click', $.proxy(this.checkAllCheckboxesOnPage, this));
      }

      if (this.config.uncheckAllOnPageElement) {
        this.$uncheckAllOnPageElement = $(this.config.uncheckAllOnPageElement);
        this.$uncheckAllOnPageElement.on('click', $.proxy(this.uncheckAllCheckboxesOnPage, this));
      }

      if (this.config.toggleAllOnPageElement) {
        this.$toggleAllOnPageElement = $(this.config.toggleAllOnPageElement);
        this.$toggleAllOnPageElement.on('click', $.proxy(this.toggleAllCheckboxesOnPage, this));
      }

      if (this.config.resetAllElement) {
        this.$resetAllElement = $(this.config.resetAllElement);
        this.$resetAllElement.on('click', $.proxy(this.resetSelectedItem, this));
      }


      if (this.config.onEmpty) {
        this.onEmpty = this.config.onEmpty
      }

      if (this.config.onNotEmpty) {
        this.onNotEmpty = this.config.onNotEmpty
      }

      this.checkboxDataItemId = this.config.checkboxDataItemId;
      this.storageKey = this.config.storageKey;


      this.selectedItemIds = new Array();
      this.checkBoxOnPage = new Array();
      this.loadSelectedItems();

      return this;
    },


    /**
     * Add an item to the list of selected items
     **/
    addSelectedItem: function (itemId, save) {
      save = typeof save !== 'undefined' ? save : true;

      if (!this.itemSelected(itemId)) {
        this.selectedItemIds.push(itemId);
      }

      if (save) {
        this.saveSelectedItems();
      }
    },

    /**
     * Remove an item from the list of selected items
     **/
    removeSelectedItem: function (itemId) {
      for (var i = 0; i < this.selectedItemIds.length; i++) {
        if (this.selectedItemIds[i] == itemId) {
          this.selectedItemIds.splice(i, 1);
          i--;
        }
      }
      this.saveSelectedItems();
    },


    /**
     * Remove all item from the list of selected items
     **/
    resetSelectedItem: function (itemId) {
      this.selectedItemIds.splice(0, this.selectedItemIds.length);
      this.saveSelectedItems();
      this.refreshCheckboxesOnPage();
    },

    /**
     * Test if an item is already in the list of selected items
     **/
    itemSelected: function (itemId) {
      for (var i = 0; i < this.selectedItemIds.length; i++) {
        if (this.selectedItemIds[i] == itemId) return true;
      }
      return false;
    },

    /**
     * Test if the list of selected items is empty
     **/
    isEmpty: function (itemId) {
      return this.selectedItemIds.length == 0
    },

    /**
     * Load the selectedItemsIds array from localStorage
     **/
    loadSelectedItems: function () {
      if (window.localStorage && localStorage.getItem(this.storageKey)) {
        this.selectedItemIds = JSON.parse(localStorage.getItem(this.storageKey));
      }
    },

    /**
     * Save the selectedItemsIds array in localStorage
     **/
    saveSelectedItems: function () {
      if (window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.selectedItemIds));
      }

      if (this.$dumpField) {
        this.dumpSelectedItems();
      }

    },


    /**
     * Dump the selectedItemsIds in the dumpField text field
     **/
    dumpSelectedItems: function () {
      this.$dumpField.val(this.selectedItemIds.join(','));

      if (this.isEmpty()) {

        // If the toggleAllOnPageElement is defined, update it's state
        if (this.$toggleAllOnPageElement) {
          this.$toggleAllOnPageElement.prop("indeterminate", false).prop("checked", false);
        }

        // Call the user defined onEmpty if defined
        if (this.onEmpty) {
          this.onEmpty.call(this);
        }
      } else {

        // If the toggleAllOnPageElement is defined, update it's state
        if (this.$toggleAllOnPageElement) {
          this.$toggleAllOnPageElement.prop("checked", true).prop("indeterminate", true);
        }

        // Call the user defined onNotEmpty if defined
        if (this.onNotEmpty) {
          this.onNotEmpty.call(this);
        }

      }

      // console.log(this.selectedItemIds);
    },


    /**
     * Check JobApplication checkboxes on the current page
     * Call this method to initiate the page based on the jobApplicationIds state
     **/
    refreshCheckboxesOnPage: function () {
      for (i = 0; i < this.checkBoxOnPage.length; i++) {
        if ($.inArray(this.checkBoxOnPage[i].item_id, this.selectedItemIds) > -1) {
          this.checkBoxOnPage[i].$elem.attr("checked", true);
        } else {
          this.checkBoxOnPage[i].$elem.attr("checked", false);
        }
      }
    },

    /**
     * Check all checkboxes on the current page
     **/
    checkAllCheckboxesOnPage: function () {
      for (i = 0; i < this.checkBoxOnPage.length; i++) {
        this.checkBoxOnPage[i].$elem.attr("checked", true);
        this.addSelectedItem(this.checkBoxOnPage[i].item_id, false);
      }
      this.saveSelectedItems();
    },

    /**
     * Uncheck all checkboxes on the current page
     **/
    uncheckAllCheckboxesOnPage: function () {
      for (i = 0; i < this.checkBoxOnPage.length; i++) {
        this.checkBoxOnPage[i].$elem.attr("checked", false);
        this.removeSelectedItem(this.checkBoxOnPage[i].item_id, false);
      }
      this.saveSelectedItems();
    },

    /**
     * Uncheck all checkboxes on the current page
     **/
    toggleAllCheckboxesOnPage: function () {
      if (this.isEmpty()) {
        this.checkAllCheckboxesOnPage();
      } else {
        this.uncheckAllCheckboxesOnPage();
      }
    }


  };

  bulkState.defaults = bulkState.prototype.defaults;


  var bulkCheckbox = function (elem, bulkSate, options) {
    this.$elem = elem;
    this.bulkState = bulkSate;
    this.item_id = this.$elem.data(this.bulkState.checkboxDataItemId);
    this.options = options;
    return this;
  };

  bulkCheckbox.prototype = {

    /**
     * Default options
     **/
    defaults: {

    },


    init: function () {
      // Introduce defaults that can be extended either
      this.config = $.extend({}, this.defaults, this.options);
      this.$elem.on('click', $.proxy(this.toggleItem, this));
      return this;
    },

    toggleItem: function () {
      if (this.$elem.attr("checked") == "checked") {
        this.bulkState.addSelectedItem(this.item_id);
      } else {
        this.bulkState.removeSelectedItem(this.item_id);
      }
    }

  };

  bulkCheckbox.defaults = bulkCheckbox.prototype.defaults;

  $.fn.bulk = function (options) {
    var bs = new bulkState(options).init();
    this.each(function () {
      bs.checkBoxOnPage.push(new bulkCheckbox($(this), bs).init());
    });

    // Load from local storage and refresh checkbox on the page 
    bs.refreshCheckboxesOnPage();
    bs.dumpSelectedItems();

    return bs;
  };

}(jQuery));