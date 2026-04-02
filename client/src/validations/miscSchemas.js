import * as Yup from 'yup';
import { rules } from '../utils/validators';

// ─── Invoice Form ─────────────────────────────────────────────────────────────

export const invoiceSchema = Yup.object().shape({
  client: rules.requiredSelect('Client'),
  dueDate: rules.requiredDate('Due date'),

  billingAddress: Yup.object().shape({
    name: Yup.string().trim().notRequired(),
    company: Yup.string().trim().notRequired(),
    email: rules.emailOptional,
    phone: rules.phoneOptional,
    address: Yup.string().trim().notRequired(),
    gstin: Yup.string().trim().notRequired(),
  }),

  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().trim().required('Item description is required'),
        quantity: Yup.number()
          .typeError('Quantity must be a number')
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        rate: Yup.number()
          .typeError('Rate must be a number')
          .min(0.01, 'Rate must be greater than 0')
          .required('Rate is required'),
      })
    )
    .min(1, 'At least one invoice item is required'),
});

// ─── Settings — Profile Form ──────────────────────────────────────────────────

export const profileSchema = Yup.object().shape({
  name: rules.name,
  email: rules.email,
  phone: rules.phoneOptional,
});

// ─── Settings — Password Change ───────────────────────────────────────────────

export const changePasswordSchema = Yup.object().shape({
  currentPassword: rules.currentPassword,
  newPassword: rules.password,
  confirmPassword: rules.confirmPassword('newPassword'),
});

// ─── Settings — Company Form ──────────────────────────────────────────────────

export const companySchema = Yup.object().shape({
  companyName: Yup.string().trim().notRequired(),
  gst: rules.gstNumber,
  website: rules.url,
  companyEmail: rules.emailOptional,
  address: Yup.string().trim().notRequired(),
});
