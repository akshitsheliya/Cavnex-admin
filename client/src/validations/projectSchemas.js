import * as Yup from 'yup';
import { rules } from '../utils/validators';

// ─── Project Form ─────────────────────────────────────────────────────────────

export const projectSchema = Yup.object().shape({
  projectName: rules.requiredText('Project name'),

  client: rules.requiredSelect('Client'),

  startDate: rules.requiredDate('Start date'),

  deadline: Yup.string()
    .trim()
    .required('Deadline is required')
    .test(
      'deadline-after-start',
      'Deadline must be after start date',
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }
    ),

  budget: Yup.number()
    .typeError('Budget must be a number')
    .required('Budget is required')
    .min(0, 'Budget must be a positive number'),

  amountPaid: Yup.number()
    .typeError('Amount paid must be a number')
    .min(0, 'Amount paid cannot be negative')
    .notRequired(),

  description: Yup.string().trim().notRequired(),

  repositoryUrl: rules.url,
  liveUrl: rules.url,
  stagingUrl: rules.url,

  notes: Yup.string().trim().notRequired(),
});
