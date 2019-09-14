function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import KeyCodes from '../../../utils/key-codes';
import get from '../../../utils/get';
import toString from '../../../utils/to-string';
import { arrayIncludes } from '../../../utils/array';
import { isFunction, isString, isUndefinedOrNull } from '../../../utils/inspect';
import filterEvent from './filter-event';
import textSelectionActive from './text-selection-active';
import { BTr } from '../tr';
import { BTd } from '../td';
import { BTh } from '../th';
var detailsSlotName = 'row-details';
export default {
  props: {
    tbodyTrClass: {
      type: [String, Array, Function],
      default: null
    }
  },
  methods: {
    // Methods for computing classes, attributes and styles for table cells
    getTdValues: function getTdValues(item, key, tdValue, defValue) {
      var parent = this.$parent;

      if (tdValue) {
        var value = get(item, key, '');

        if (isFunction(tdValue)) {
          return tdValue(value, key, item);
        } else if (isString(tdValue) && isFunction(parent[tdValue])) {
          return parent[tdValue](value, key, item);
        }

        return tdValue;
      }

      return defValue;
    },
    getThValues: function getThValues(item, key, thValue, type, defValue) {
      var parent = this.$parent;

      if (thValue) {
        var value = get(item, key, '');

        if (isFunction(thValue)) {
          return thValue(value, key, item, type);
        } else if (isString(thValue) && isFunction(parent[thValue])) {
          return parent[thValue](value, key, item, type);
        }

        return thValue;
      }

      return defValue;
    },
    // Method to get the value for a field
    getFormattedValue: function getFormattedValue(item, field) {
      var key = field.key;
      var formatter = this.getFieldFormatter(key);
      var value = get(item, key, null);

      if (isFunction(formatter)) {
        value = formatter(value, key, item);
      }

      return isUndefinedOrNull(value) ? '' : value;
    },
    // Factory function methods
    toggleDetailsFactory: function toggleDetailsFactory(hasDetailsSlot, item) {
      var _this = this;

      // Returns a function to toggle a row's details slot
      return function () {
        if (hasDetailsSlot) {
          _this.$set(item, '_showDetails', !item._showDetails);
        }
      };
    },
    rowEvtFactory: function rowEvtFactory(handler, item, rowIndex) {
      var _this2 = this;

      // Return a row event handler
      return function (evt) {
        // If table is busy (via provider) then don't propagate
        if (_this2.stopIfBusy && _this2.stopIfBusy(evt)) {
          return;
        } // Otherwise call the handler


        handler(evt, item, rowIndex);
      };
    },
    // Row event handlers (will be wrapped by the above rowEvtFactory function)
    tbodyRowKeydown: function tbodyRowKeydown(evt, item, rowIndex) {
      // Keypress handler
      var keyCode = evt.keyCode;
      var target = evt.target; // `this.$refs.itemRow`s is most likely an array of `BTr` components, but it
      // could be regular `tr` elements, so we map to the `tr` elements just in case

      var trs = (this.$refs.itemRows || []).map(function (tr) {
        return tr.$el || tr;
      });

      if (!(target && target.tagName === 'TR' && target === document.activeElement)) {
        // Ignore if not the active tr element
        return;
      } else if (target.tabIndex !== 0) {
        // Ignore if not focusable

        /* istanbul ignore next */
        return;
      } else if (trs.length === 0) {
        // No item rows

        /* istanbul ignore next */
        return;
      }

      var index = trs.indexOf(target);

      if (keyCode === KeyCodes.ENTER || keyCode === KeyCodes.SPACE) {
        // We also allow enter/space to trigger a click (when row is focused)
        evt.stopPropagation();
        evt.preventDefault(); // We translate to a row-clicked event

        this.rowClicked(evt, item, rowIndex);
      } else if (arrayIncludes([KeyCodes.UP, KeyCodes.DOWN, KeyCodes.HOME, KeyCodes.END], keyCode)) {
        // Keyboard navigation of rows
        evt.stopPropagation();
        evt.preventDefault();
        var shift = evt.shiftKey;

        if (keyCode === KeyCodes.HOME || shift && keyCode === KeyCodes.UP) {
          // Focus first row
          trs[0].focus();
        } else if (keyCode === KeyCodes.END || shift && keyCode === KeyCodes.DOWN) {
          // Focus last row
          trs[trs.length - 1].focus();
        } else if (keyCode === KeyCodes.UP && index > 0) {
          // Focus previous row
          trs[index - 1].focus();
        } else if (keyCode === KeyCodes.DOWN && index < trs.length - 1) {
          // Focus next row
          trs[index + 1].focus();
        }
      }
    },
    rowClicked: function rowClicked(evt, item, index) {
      if (filterEvent(evt)) {
        // clicked on a non-disabled control so ignore
        return;
      } else if (textSelectionActive(this.$el)) {
        // User is selecting text, so ignore

        /* istanbul ignore next: JSDOM doesn't support getSelection() */
        return;
      }

      this.$emit('row-clicked', item, index, evt);
    },
    middleMouseRowClicked: function middleMouseRowClicked(evt, item, index) {
      if (evt.which === 2) {
        this.$emit('row-middle-clicked', item, index, evt);
      }
    },
    rowDblClicked: function rowDblClicked(evt, item, index) {
      if (filterEvent(evt)) {
        // clicked on a non-disabled control so ignore

        /* istanbul ignore next: event filtering already tested via click handler */
        return;
      }

      this.$emit('row-dblclicked', item, index, evt);
    },
    rowHovered: function rowHovered(evt, item, index) {
      this.$emit('row-hovered', item, index, evt);
    },
    rowUnhovered: function rowUnhovered(evt, item, index) {
      this.$emit('row-unhovered', item, index, evt);
    },
    rowContextmenu: function rowContextmenu(evt, item, index) {
      this.$emit('row-contextmenu', item, index, evt);
    },
    // Render helpers
    renderTbodyRowCell: function renderTbodyRowCell(field, colIndex, item, rowIndex) {
      // Renders a TD or TH for a row's field
      var h = this.$createElement;
      var hasDetailsSlot = this.hasNormalizedSlot(detailsSlotName);
      var formatted = this.getFormattedValue(item, field);
      var key = field.key;
      var data = {
        // For the Vue key, we concatenate the column index and
        // field key (as field keys could be duplicated)
        // TODO: Although we do prevent duplicate field keys...
        //   So we could change this to: `row-${rowIndex}-cell-${key}`
        key: "row-".concat(rowIndex, "-cell-").concat(colIndex, "-").concat(key),
        class: [field.class ? field.class : '', this.getTdValues(item, key, field.tdClass, '')],
        props: {
          stackedHeading: this.isStacked ? field.label : null,
          stickyColumn: field.stickyColumn,
          variant: item._cellVariants && item._cellVariants[key] ? item._cellVariants[key] : field.variant || null
        },
        attrs: _objectSpread({
          'aria-colindex': String(colIndex + 1)
        }, field.isRowHeader ? this.getThValues(item, key, field.thAttr, 'row', {}) : this.getTdValues(item, key, field.tdAttr, {}))
      };
      var slotScope = {
        item: item,
        index: rowIndex,
        field: field,
        unformatted: get(item, key, ''),
        value: formatted,
        toggleDetails: this.toggleDetailsFactory(hasDetailsSlot, item),
        detailsShowing: Boolean(item._showDetails)
      };

      if (this.selectedRows) {
        // Add in rowSelected scope property if selectable rows supported
        slotScope.rowSelected = this.isRowSelected(rowIndex);
      } // The new `v-slot` syntax doesn't like a slot name starting with
      // a square bracket and if using in-document HTML templates, the
      // v-slot attributes are lower-cased by the browser.
      // Switched to round bracket syntax to prevent confusion with
      // dynamic slot name syntax.
      // We look for slots in this order: `cell(${key})`, `cell(${key.toLowerCase()})`, 'cell()'
      // Slot names are now cached by mixin tbody in `this.$_bodyFieldSlotNameCache`
      // Will be `null` if no slot (or fallback slot) exists


      var slotName = this.$_bodyFieldSlotNameCache[key];
      var $childNodes = slotName ? this.normalizeSlot(slotName, slotScope) : toString(formatted);

      if (this.isStacked) {
        // We wrap in a DIV to ensure rendered as a single cell when visually stacked!
        $childNodes = [h('div', {}, [$childNodes])];
      } // Render either a td or th cell


      return h(field.isRowHeader ? BTh : BTd, data, [$childNodes]);
    },
    renderTbodyRow: function renderTbodyRow(item, rowIndex) {
      var _this3 = this;

      // Renders an item's row (or rows if details supported)
      var h = this.$createElement;
      var fields = this.computedFields;
      var tableStriped = this.striped;
      var hasDetailsSlot = this.hasNormalizedSlot(detailsSlotName);
      var rowShowDetails = Boolean(item._showDetails && hasDetailsSlot);
      var hasRowClickHandler = this.$listeners['row-clicked'] || this.isSelectable; // We can return more than one TR if rowDetails enabled

      var $rows = []; // Details ID needed for `aria-details` when details showing
      // We set it to `null` when not showing so that attribute
      // does not appear on the element

      var detailsId = rowShowDetails ? this.safeId("_details_".concat(rowIndex, "_")) : null; // For each item data field in row

      var $tds = fields.map(function (field, colIndex) {
        return _this3.renderTbodyRowCell(field, colIndex, item, rowIndex);
      }); // Calculate the row number in the dataset (indexed from 1)

      var ariaRowIndex = null;

      if (this.currentPage && this.perPage && this.perPage > 0) {
        ariaRowIndex = String((this.currentPage - 1) * this.perPage + rowIndex + 1);
      } // Create a unique :key to help ensure that sub components are re-rendered rather than
      // re-used, which can cause issues. If a primary key is not provided we use the rendered
      // rows index within the tbody.
      // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/2410


      var primaryKey = this.primaryKey;
      var hasPkValue = primaryKey && !isUndefinedOrNull(item[primaryKey]);
      var rowKey = hasPkValue ? toString(item[primaryKey]) : String(rowIndex); // If primary key is provided, use it to generate a unique ID on each tbody > tr
      // In the format of '{tableId}__row_{primaryKeyValue}'

      var rowId = hasPkValue ? this.safeId("_row_".concat(item[primaryKey])) : null;
      var evtFactory = this.rowEvtFactory;
      var handlers = {};

      if (hasRowClickHandler) {
        handlers.click = evtFactory(this.rowClicked, item, rowIndex);
        handlers.keydown = evtFactory(this.tbodyRowKeydown, item, rowIndex);
      } // Selectable classes and attributes


      var selectableClasses = this.selectableRowClasses ? this.selectableRowClasses(rowIndex) : {};
      var selectableAttrs = this.selectableRowAttrs ? this.selectableRowAttrs(rowIndex) : {}; // Add the item row

      $rows.push(h(BTr, {
        key: "__b-table-row-".concat(rowKey, "__"),
        ref: 'itemRows',
        refInFor: true,
        class: [isFunction(this.tbodyTrClass) ? this.tbodyTrClass(item, 'row') : this.tbodyTrClass, selectableClasses, rowShowDetails ? 'b-table-has-details' : ''],
        props: {
          variant: item._rowVariant || null
        },
        attrs: _objectSpread({
          id: rowId,
          tabindex: hasRowClickHandler ? '0' : null,
          'data-pk': rowId ? String(item[primaryKey]) : null,
          // Should this be `aria-details` instead?
          'aria-details': detailsId,
          'aria-owns': detailsId,
          'aria-rowindex': ariaRowIndex
        }, selectableAttrs),
        on: _objectSpread({}, handlers, {
          // TODO:
          //   Instantiate the following handlers only if we have registered
          //   listeners i.e. `this.$listeners['row-middle-clicked']`, etc.
          //
          //   Could make all of this (including the above click/key handlers)
          //   the result of a factory function and/or make it a delegated event
          //   handler on the tbody (if we store the row index as a data-attribute
          //   on the TR as we can lookup the item data from the computedItems array
          //   or it could be a hidden prop (via attrs) on BTr instance)
          auxclick: evtFactory(this.middleMouseRowClicked, item, rowIndex),
          contextmenu: evtFactory(this.rowContextmenu, item, rowIndex),
          // Note: These events are not accessibility friendly!
          dblclick: evtFactory(this.rowDblClicked, item, rowIndex),
          mouseenter: evtFactory(this.rowHovered, item, rowIndex),
          mouseleave: evtFactory(this.rowUnhovered, item, rowIndex)
        })
      }, $tds)); // Row Details slot

      if (rowShowDetails) {
        var detailsScope = {
          item: item,
          index: rowIndex,
          fields: fields,
          toggleDetails: this.toggleDetailsFactory(hasDetailsSlot, item)
        }; // Render the details slot in a TD

        var $details = h(BTd, {
          props: {
            colspan: fields.length
          }
        }, [this.normalizeSlot(detailsSlotName, detailsScope)]); // Add a hidden row to keep table row striping consistent when details showing

        if (tableStriped) {
          $rows.push( // We don't use `BTr` here as we dont need the extra functionality
          h('tr', {
            key: "__b-table-details-stripe__".concat(rowKey),
            staticClass: 'd-none',
            attrs: {
              'aria-hidden': 'true',
              role: 'presentation'
            }
          }));
        } // Add the actual details row


        $rows.push(h(BTr, {
          key: "__b-table-details__".concat(rowKey),
          staticClass: 'b-table-details',
          class: [isFunction(this.tbodyTrClass) ? this.tbodyTrClass(item, detailsSlotName) : this.tbodyTrClass],
          props: {
            variant: item._rowVariant || null
          },
          attrs: {
            id: detailsId,
            tabindex: '-1'
          }
        }, [$details]));
      } else if (hasDetailsSlot) {
        // Only add the placeholder if a the table has a row-details slot defined (but not shown)
        $rows.push(h());

        if (tableStriped) {
          // Add extra placeholder if table is striped
          $rows.push(h());
        }
      } // Return the row(s)


      return $rows;
    }
  }
};