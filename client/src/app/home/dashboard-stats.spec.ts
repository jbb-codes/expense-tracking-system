import { Expense } from '../expenses/expense.service';
import { computeDashboardStats, sortByDateDescending } from './dashboard-stats';

function makeExpense(date: string, amount: number): Expense {
  return {
    _id: date + '-' + amount,
    userId: 1,
    username: 'emily',
    categoryId: 1,
    amount,
    date,
  };
}

describe('computeDashboardStats', () => {
  const now = new Date('2026-07-23T12:00:00');

  it('returns zeros when there are no expenses', () => {
    expect(computeDashboardStats([], now)).toEqual({
      totalThisMonth: 0,
      totalThisWeek: 0,
      totalToday: 0,
    });
  });

  it('sums only expenses within the current calendar month', () => {
    const expenses = [
      makeExpense('2026-07-01', 10),
      makeExpense('2026-07-23', 5),
      makeExpense('2026-06-30', 100),
    ];

    expect(computeDashboardStats(expenses, now).totalThisMonth).toBe(15);
  });

  it('sums only expenses within the trailing 7 days', () => {
    const expenses = [
      makeExpense('2026-07-23', 5), // today, within
      makeExpense('2026-07-17', 10), // 6 days ago, within
      makeExpense('2026-07-16', 100), // 7 days ago, outside
    ];

    expect(computeDashboardStats(expenses, now).totalThisWeek).toBe(15);
  });

  it('sums only expenses that occurred today', () => {
    const expenses = [
      makeExpense('2026-07-23', 5),
      makeExpense('2026-07-22', 100),
    ];

    expect(computeDashboardStats(expenses, now).totalToday).toBe(5);
  });
});

describe('sortByDateDescending', () => {
  it('orders expenses from most recent to oldest', () => {
    const expenses = [
      makeExpense('2026-07-01', 1),
      makeExpense('2026-07-23', 2),
      makeExpense('2026-07-10', 3),
    ];

    const sorted = sortByDateDescending(expenses);

    expect(sorted.map((expense) => expense.date)).toEqual([
      '2026-07-23',
      '2026-07-10',
      '2026-07-01',
    ]);
  });

  it('does not mutate the original array', () => {
    const expenses = [
      makeExpense('2026-07-01', 1),
      makeExpense('2026-07-23', 2),
    ];
    const original = [...expenses];

    sortByDateDescending(expenses);

    expect(expenses).toEqual(original);
  });
});
