import { describe, expect, it } from "vitest";
import { getLoanLevel, getNextLevel, LOAN_LEVELS } from "../../src/constants/loanLevels";
import { IN_PROGRESS_LOAN_STATUSES } from "../../src/constants/loan";

describe("loan levels", () => {
  it("returns the matching config for each level", () => {
    expect(getLoanLevel(1).name).toBe("Bronze");
    expect(getLoanLevel(4).maxAmount).toBe(1000);
  });

  it("clamps levels outside the ladder", () => {
    expect(getLoanLevel(0).level).toBe(LOAN_LEVELS[0].level);
    expect(getLoanLevel(999).level).toBe(LOAN_LEVELS[LOAN_LEVELS.length - 1].level);
  });

  it("walks the ladder via getNextLevel", () => {
    expect(getNextLevel(1)?.level).toBe(2);
    expect(getNextLevel(4)).toBeNull();
  });
});

describe("in-progress loan statuses", () => {
  it("covers every status that must block a fresh application", () => {
    expect([...IN_PROGRESS_LOAN_STATUSES]).toEqual(["pending", "approved", "active", "overdue"]);
  });
});