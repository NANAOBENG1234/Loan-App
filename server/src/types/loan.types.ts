export interface ApplyLoanInput {
  amount: number;
  purpose?: string;
}

export interface LoanLevelConfig {
  level: number;
  maxAmount: number;
  interestRate: number;
  repaymentDays: number;
  name: string;
}
