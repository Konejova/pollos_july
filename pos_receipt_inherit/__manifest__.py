# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Custom POS RECEIPT',
    'category': 'Hidden/Tools',
    'summary': 'Tickets',
    'description': 'Tickets Receipt',
    'version' : '1.1',
    'data' : [
    ],
    'installable': True,
    'auto_install': True,
    'application': False,
    'license': 'LGPL-3',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale.assets': [
            'pos_receipt_inherit/static/src/xml/OrderReceipt.xml'
        ],
    },
}