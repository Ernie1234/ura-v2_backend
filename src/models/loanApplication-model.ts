import { Schema, model, Document, Types } from 'mongoose';

export interface ILoanApplication extends Document {
  business: Types.ObjectId; // Ref to Business
  amountRequested: number;
  purpose: string;
  repaymentDuration: number; // In months
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  consent: boolean;
}

const loanApplicationSchema = new Schema<ILoanApplication>(
  {
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    amountRequested: { type: Number, required: true },
    purpose: { type: String, required: true },
    repaymentDuration: { type: Number, required: true }, // e.g., 6, 12, 24
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processing'],
      default: 'pending',
    },
    consent: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const LoanApplication = model<ILoanApplication>('LoanApplication', loanApplicationSchema);
