function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { props as tbodyProps, BTbody } from '../tbody';
import tbodyRowMixin from './mixin-tbody-row';

var props = _objectSpread({
  tbodyClass: {
    type: [String, Array, Object] // default: undefined

  }
}, tbodyProps);

export default {
  mixins: [tbodyRowMixin],
  props: props,
  methods: {
    renderTbody: function renderTbody() {
      var _this = this;

      // Render the tbody element and children
      var items = this.computedItems; // Shortcut to `createElement` (could use `this._c()` instead)

      var h = this.$createElement; // Prepare the tbody rows

      var $rows = []; // Add the item data rows or the busy slot

      var $busy = this.renderBusy ? this.renderBusy() : null;

      if ($busy) {
        // If table is busy and a busy slot, then return only the busy "row" indicator
        $rows.push($busy);
      } else {
        // Table isn't busy, or we don't have a busy slot
        // Create a slot cache for improved performace when looking up cell slot names.
        // Values will be keyed by the field's `key` and will store the slot's name.
        // Slots could be dynamic (i.e. `v-if`), so we must compute on each render.
        // Used by tbodyRow mixin render helper.
        var cache = {};
        var defaultSlotName = this.hasNormalizedSlot('cell()') ? 'cell()' : null;
        this.computedFields.forEach(function (field) {
          var key = field.key;
          var fullName = "cell(".concat(key, ")");
          var lowerName = "cell(".concat(key.toLowerCase(), ")");
          cache[key] = _this.hasNormalizedSlot(fullName) ? fullName : _this.hasNormalizedSlot(lowerName) ? lowerName : defaultSlotName;
        }); // Created as a non-reactive property so to not trigger component updates.
        // Must be a fresh object each render.

        this.$_bodyFieldSlotNameCache = cache; // Add static Top Row slot (hidden in visibly stacked mode as we can't control data-label attr)

        $rows.push(this.renderTopRow ? this.renderTopRow() : h()); // render the rows

        items.forEach(function (item, rowIndex) {
          // Render the individual item row (rows if details slot)
          $rows.push(_this.renderTbodyRow(item, rowIndex));
        }); // Empty Items / Empty Filtered Row slot (only shows if items.length < 1)

        $rows.push(this.renderEmpty ? this.renderEmpty() : h()); // Static bottom row slot (hidden in visibly stacked mode as we can't control data-label attr)

        $rows.push(this.renderBottomRow ? this.renderBottomRow() : h());
      } // Assemble rows into the tbody


      var $tbody = h(BTbody, {
        class: this.tbodyClass || null,
        props: {
          tbodyTransitionProps: this.tbodyTransitionProps,
          tbodyTransitionHandlers: this.tbodyTransitionHandlers
        }
      }, $rows); // Return the assembled tbody

      return $tbody;
    }
  }
};