jquery-bulk-actions
===================

A jQuery plugin to manage bulk actions on a list of items selected with checkboxes. Uses localstorage to store the selected items on the client browser and persists the selected items when changing page (during pagination for instance).

The selected items id can be dumped to a text form field on every selection change. The corresponding form can be used to POST item ids to the server.

Usage
-----

To get started, copy the files from the src/ folder to your project, and link your HTML to it. Like this:

``` html
<script src="PATH_TO_JQUERY/jquery.min.js" type="text/javascript"></script>
<script src="PATH_TO_SRC/jquery.bulk-actions.js" type="text/javascript"></script>

<script type="text/javascript">
		bulk = $(".item-checkbox").bulk({
			// Name of the data HTML attribute of the checkbox, 
			// used to store declare the id of the item
			checkboxDataItemId: "item-id",

			// Hidden form field where item ids are copied, separated by a comma
			dumpField: "#form_items_ids",

			// Actions to toggle checkbox on the current page
			checkAllOnPageElement: "#checkbox-check-all-on-page",
			uncheckAllOnPageElement: "#checkbox-uncheck-all-on-page",
			toggleAllOnPageElement: "#checkbox-toggle-all-on-page",
			resetAllElement: "#checkbox-uncheck-all",

			// localStorage key used to store the array of selected item ids 
			storageKey: "selectedItemIds",

			onEmpty: function(){
			  // Hide action buttons
			},
			onNotEmpty: function(){
			  // Show action buttons
			}
		});
</script>
```

Each item should have a ``item-id`` data attribute (by default, but can be overridden with the ``checkboxDataItemId`` option) :

``` html
<table>
	<thead>
		<tr>
			<th><input type="checkbox" id="checkbox-toggle-all-on-page"/></th>
			<th>
				<a href="#" id="checkbox-check-all-on-page">Check all items on this page</a> | 
				<a href="#" id="checkbox-uncheck-all-on-page">Uncheck all items on this page</a> |
				<a href="#" id="checkbox-uncheck-all">Reset selection</a> |
			</th>
		</tr>
	</thead>
	<tr>
		<td><input type="checkbox" class="item-checkbox" data-item-id="56879" /></td>
		<td>Item n°1</td>
	</tr>
	<tr>
		<td><input type="checkbox" class="item-checkbox" data-item-id="568789" /></td>
		<td>Item n°2</td>
	</tr>
	<tr>
		<td><input type="checkbox" class="item-checkbox" data-item-id="568789" /></td>
		<td>Item n°3</td>
	</tr>
</table>	
```

You can also use a form to send item ids to the server

``` html
<form action="/perform_bulk_action">
	<input type="hidden" id="form_items_ids" name="item_ids" value="">
	<input type="submit" value="Validate">
</form>
```