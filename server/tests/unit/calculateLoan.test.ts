import { describe, expect, it } from "vitest";
import { calculateLoanRepayment, calculatePenalty } from "../../src/utils/calculateLoan";
import { LOAN_LEVELS } from "../../src/constants/loanLevels";

describe("calculateLoanRepayment", () => {
  it("adds level interest as a percentage of the principal", () => {
    const result = calculateLoanRepayment(100, 1); // Bronze 10%
    expect(result.totalRepayment).toBe(110);
    expect(result.interest).toBe(10);
    expect(result.interestRate).toBe(10);
  });

  it("uses per-level interest rates", () => {
    expect(calculateLoanRepayment(1000, 4).interestRate).toBe(5); // Platinum
    expect(calculateLoanRepayment(300, 2).interestRate).toBe(8); // Silver
  });

  it("sets the due date repaymentDays from the level ahead", () => {
    const result = calculateLoanRepayment(100, 1);
    const diffDays = (result.dueDate.getTime() - Date.now()) / 86_400_000;
    expect(diffDays).toBeGreaterThan(5.9);
    expect(diffDays).toBeLessThanOrEqual(LOAN_LEVELS[0].repaymentDays);
  });

  it("clamps an out-of-range user level to the nearest valid level", () => {
    expect(calculateLoanRepayment(100, -3).interestRate).toBe(LOAN_LEVELS[0].interestRate);
    expect(calculateLoanRepayment(100, 99).interestRate).toBe(LOAN_LEVELS[LOAN_LEVELS.length - 1].interestRate);
  });
});

describe("calculatePenalty", () => {
  it("charges 2% of the amount per overdue day rounded to 2dp", () => {
    expect(calculatePenalty(1, 100)).toBe(2);
    expect(calculatePenalty(5, 137.5)).toBe(13.75);
  });
});