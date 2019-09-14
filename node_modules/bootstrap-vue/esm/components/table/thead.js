function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Vue from '../../utils/vue';
import normalizeSlotMixin from '../../mixins/normalize-slot';
export var props = {
  headVariant: {
    type: String,
    // supported values: 'lite', 'dark', or null
    default: null
  }
}; // @vue/component

export var BThead =
/*#__PURE__*/
Vue.extend({
  name: 'BThead',
  mixins: [normalizeSlotMixin],
  inheritAttrs: false,
  provide: function provide() {
    return {
      bvTableThead: this
    };
  },
  inject: {
    bvTable: {
      default: null
    }
  },
  props: props,
  computed: {
    theadClasses: function theadClasses() {
      return [this.headVariant ? "thead-".concat(this.headVariant) : null];
    },
    theadAttrs: function theadAttrs() {
      return _objectSpread({
        role: 'rowgroup'
      }, this.$attrs);
    }
  },
  render: function render(h) {
    return h('thead', {
      class: this.theadClasses,
      attrs: this.theadAttrs,
      // Pass down any native listeners
      on: this.$listeners
    }, this.normalizeSlot('default', {}));
  }
});