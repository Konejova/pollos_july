/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_combo_products.screens', function (require) {
    "use strict";
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const ProductItem = require('point_of_sale.ProductItem');

    const PosResComboProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _clickProduct(event) {
                const product = event.detail;
                var self = this;
                if (product.is_combo_product) {
                    var line;
                    if (product.pos_combo_groups_ids && !product.product_variant_ids) {
                        self.showPopup('ComboPopupWidget', {
                            title: product.display_name,
                            groups: product.pos_combo_groups_ids,
                            product: product,
                            line: line,
                        });
                    } else {
                        if (!this.currentOrder) {
                            this.env.pos.add_new_order();
                        }
                        const options = await this._getAddProductOptions(product);
                        if (!options) return;
                        self.showPopup('ComboPopupWidget', {
                            title: product.display_name,
                            groups: product.pos_combo_groups_ids,
                            product: product,
                            line: line,
                            options: options,
                        });
                    }
                }
                else {
                    super._clickProduct(event)
                }
            }

            _setValue(val) {
                var self = this;
                var curr_orderline = self.currentOrder.get_selected_orderline()
                if (curr_orderline === undefined) {
                    super._setValue(val)
                } else {
                    var combo_line = self.currentOrder.get_selected_orderline().product.is_combo_product;
                    if (curr_orderline) {
                        if (self.env.pos.numpadMode === 'quantity') {
                            if (!combo_line) {
                                super._setValue(val)
                            } else {
                                if (val != 'remove') {
                                    curr_orderline.input_quantity = val
                                    curr_orderline.set_quantity(val)
                                    curr_orderline.set_unit_price(curr_orderline.price);
                                } else {
                                    self.currentOrder.remove_orderline(curr_orderline)
                                }
                            }
                        } else if (self.env.pos.numpadMode === 'price') {
                            if (!combo_line) {
                                super._setValue(val);
                            } else {
                                self.showPopup('ErrorPopup', {
                                    title: this.env._t('Not Allowed'),
                                    body: this.env._t("You cannot change price of a Combo Product."),
                                });
                            }
                        } else {
                            super._setValue(val)
                        }
                    } else {
                        super._setValue(val)
                    }
                }
            }
        }

    Registries.Component.extend(ProductScreen, PosResComboProductScreen);

    const PosResComboProductItem = (ProductItem) =>
        class extends ProductItem {
            wk_is_combo_product(product_id) {
                var self = this;
                var combo_products = self.env.pos.db.product_by_id;
                var combo_prod_items = _.filter(combo_products, function (product) { return product.is_combo_product == true; });
                for (var i = 0; i < combo_prod_items.length; i++) {
                    if (combo_prod_items[i].id == product_id) {
                        return true;
                    }
                }
            }
        };
    Registries.Component.extend(ProductItem, PosResComboProductItem);
});
