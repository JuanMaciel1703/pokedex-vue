function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Vue from '../../../utils/vue';
import toString from '../../../utils/to-string';
import { isUndefinedOrNull } from '../../../utils/inspect';
import normalizeSlotMixin from '../../../mixins/normalize-slot';
var digitsRx = /^\d+$/; // Parse a rowspan or colspan into a digit (or null if < 1 or NaN)

var parseSpan = function parseSpan(val) {
  val = parseInt(val, 10);
  return digitsRx.test(String(val)) && val > 0 ? val : null;
};
/* istanbul ignore next */


var spanValidator = function spanValidator(val) {
  return isUndefinedOrNull(val) || parseSpan(val) > 0;
};

export var props = {
  header: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: null
  },
  colspan: {
    type: [Number, String],
    default: null,
    validator: spanValidator
  },
  rowspan: {
    type: [Number, String],
    default: null,
    validator: spanValidator
  },
  stackedHeading: {
    type: String,
    default: null
  },
  stickyColumn: {
    type: Boolean,
    default: false
  }
}; // @vue/component

export var BTableCell =
/*#__PURE__*/
Vue.extend({
  name: 'BTableCell',
  mixins: [normalizeSlotMixin],
  inheritAttrs: false,
  inject: {
    // Injections for feature / attribute detection
    bvTable: {
      default: null
    },
    bvTableTbody: {
      default: null
    },
    bvTableThead: {
      default: null
    },
    bvTableTfoot: {
      default: null
    },
    bvTableTr: {
      default: null
    }
  },
  props: props,
  computed: {
    isDark: function isDark() {
      return this.bvTable && this.bvTable.dark;
    },
    isStacked: function isStacked() {
      return this.bvTable && this.bvTable.isStacked;
    },
    isStackedCell: function isStackedCell() {
      // We only support stacked-heading in tbody in stacked mode
      return this.isStacked && this.bvTableTbody;
    },
    isResponsive: function isResponsive() {
      return this.bvTable && this.bvTable.isResponsive && !this.isStacked;
    },
    isStickyHeader: function isStickyHeader() {
      // Needed to handle header background classes, due to lack of
      // bg color inheritance with Bootstrap v4 tabl css
      // Sticky headers only apply to cells in table `thead`
      return !this.isStacked && this.bvTable && this.bvTableThead && this.bvTableTr && this.bvTable.stickyHeader;
    },
    isStickyColumn: function isStickyColumn() {
      // Needed to handle header background classes, due to lack of
      // background color inheritance with Bootstrap v4 table css.
      // Sticky column cells are only available in responsive
      // mode (horzontal scrolling) or when sticky header mode.
      // Applies to cells in `thead`, `tbody` and `tfoot`
      return (this.isResponsive || this.isStickyHeader) && this.stickyColumn && !this.isStacked && this.bvTable && this.bvTableTr;
    },
    cellClasses: function cellClasses() {
      // We use computed props here for improved performance by caching
      // the results of the string interpolation
      var variant = this.variant;

      if (!variant && this.isStickyHeader && !this.bvTableThead.headVariant || !variant && this.isStickyColumn) {
        // Needed for stickyheader mode as Bootstrap v4 table cells do
        // not inherit parent's background-color. Boo!
        variant = this.bvTableTr.variant || this.bvTable.tableVariant || 'b-table-default';
      }

      return [variant ? "".concat(this.isDark ? 'bg' : 'table', "-").concat(variant) : null, this.isStickyColumn ? 'b-table-sticky-column' : null];
    },
    computedColspan: function computedColspan() {
      return parseSpan(this.colspan);
    },
    computedRowspan: function computedRowspan() {
      return parseSpan(this.rowspan);
    },
    cellAttrs: function cellAttrs() {
      // We use computed props here for improved performance by caching
      // the results of the object spread (Object.assign)
      var headOrFoot = this.bvTableThead || this.bvTableTfoot; // Make sure col/rowspan's are > 0 or null

      var colspan = this.computedColspan;
      var rowspan = this.computedRowspan; // Default role and scope

      var role = 'cell';
      var scope = null; // Compute role and scope
      // We only add scopes with an explicit span of 1 or greater

      if (headOrFoot) {
        // Header or footer cells
        role = 'columnheader';
        scope = colspan > 0 ? 'colspan' : 'col';
      } else if (this.header) {
        // th's in tbody
        role = 'rowheader';
        scope = rowspan > 0 ? 'rowgroup' : 'row';
      }

      return _objectSpread({
        colspan: colspan,
        rowspan: rowspan,
        role: role,
        scope: scope
      }, this.$attrs, {
        // Add in the stacked cell label data-attribute if in
        // stacked mode (if a stacked heading label is provided)
        'data-label': this.isStackedCell && !isUndefinedOrNull(this.stackedHeading) ? toString(this.stackedHeading) : null
      });
    }
  },
  render: function render(h) {
    var content = [this.normalizeSlot('default')];
    return h(this.header ? 'th' : 'td', {
      class: this.cellClasses,
      attrs: this.cellAttrs,
      // Transfer any native listeners
      on: this.$listeners
    }, [this.isStackedCell ? h('div', {}, [content]) : content]);
  }
});