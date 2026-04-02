import * as Yup from 'yup';
import { rules } from '../utils/validators';

// ─── Lead Form ────────────────────────────────────────────────────────────────

export const leadSchema = Yup.object().shape({
  leadName: rules.name.label('Lead name'),
  businessName: Yup.string().trim().notRequired(),
  businessType: Yup.string().trim().notRequired(),
  phone: rules.phone,
  email: rules.email,
  city: Yup.string().trim().notRequired(),
  estimatedValue: Yup.number()
    .typeError('Estimated value must be a number')
    .min(0, 'Estimated value cannot be negative')
    .notRequired(),
  source: rules.requiredSelect('Lead source'),
  followUpDate: Yup.string().trim().notRequired(),
  notes: Yup.string().trim().notRequired(),
});
