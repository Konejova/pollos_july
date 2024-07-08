from odoo import api, fields, models

class ComboProducts(models.Model):
    _inherit = 'combo.products'

    company_id = fields.Many2one('res.company', string='Compañia', index=True, default=lambda self: self.env.company)