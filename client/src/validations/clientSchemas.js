import * as Yup from 'yup';
import { rules } from '../utils/validators';

// ─── Client Form ──────────────────────────────────────────────────────────────

export const clientSchema = Yup.object().shape({
  clientName: rules.name.label('Contact person name'),
  businessName: rules.requiredText('Business name'),
  email: rules.email,
  phone: rules.phone,
  alternatePhone: rules.phoneOptional,
  website: rules.url,
  gstNumber: rules.gstNumber,

  address: Yup.object().shape({
    street: Yup.string().trim().notRequired(),
    city: Yup.string().trim().notRequired(),
    state: Yup.string().trim().notRequired(),
    country: Yup.string().trim().notRequired(),
    pincode: rules.pincode,
  }),

  contactPerson: Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(/^[A-Za-z\s'-]*$/, 'Contact name can only contain letters')
      .notRequired(),
    designation: Yup.string().trim().notRequired(),
    email: rules.emailOptional,
    phone: rules.phoneOptional,
  }),
});
