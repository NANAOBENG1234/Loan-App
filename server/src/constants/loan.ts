// Statuses under which a borrower still has an outstanding obligation:
// they must be shown as in-a-loan and are blocked from applying again.
export const IN_PROGRESS_LOAN_STATUSES = ["pending", "approved", "active", "overdue"] as const;