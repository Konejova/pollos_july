from odoo import api, fields, models

class ComboGroups(models.Model):
    _inherit = 'combo.groups'

    company_id = fields.Many2one('res.company', string='Compañia', index=True, default=lambda self: self.env.company)