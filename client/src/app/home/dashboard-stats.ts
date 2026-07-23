import { Expense } from '../expenses/expense.service';

export interface DashboardStats {
  totalThisMonth: number;
  totalThisWeek: number;
  totalToday: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TRAILING_WEEK_DAYS = 7;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Expense dates are calendar days ("2026-07-23" or an ISO datetime built
 * from one). Parsing the raw string with `new Date(...)` reads the date
 * part as UTC midnight, which can land on the previous local calendar day
 * depending on the browser's timezone. Slicing to just the date component
 * and constructing a local Date avoids that off-by-one.
 */
function parseCalendarDate(dateString: string): Date {
  const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function isSameMonth(expenseDate: Date, now: Date): boolean {
  return (
    expenseDate.getFullYear() === now.getFullYear() &&
    expenseDate.getMonth() === now.getMonth()
  );
}

function isWithinTrailingDays(
  expenseDate: Date,
  now: Date,
  days: number,
): boolean {
  const diff = startOfDay(now).getTime() - startOfDay(expenseDate).getTime();
  return diff >= 0 && diff < days * MS_PER_DAY;
}

function isSameDay(expenseDate: Date, now: Date): boolean {
  return startOfDay(expenseDate).getTime() === startOfDay(now).getTime();
}

/**
 * Computes the dashboard's three summary totals from a user's full expense
 * list. `now` is passed in explicitly (rather than read internally) so the
 * date math stays pure and deterministic for tests.
 */
export function computeDashboardStats(
  expenses: Expense[],
  now: Date,
): DashboardStats {
  return expenses.reduce<DashboardStats>(
    (stats, expense) => {
      const expenseDate = parseCalendarDate(expense.date);

      return {
        totalThisMonth:
          stats.totalThisMonth +
          (isSameMonth(expenseDate, now) ? expense.amount : 0),
        totalThisWeek:
          stats.totalThisWeek +
          (isWithinTrailingDays(expenseDate, now, TRAILING_WEEK_DAYS)
            ? expense.amount
            : 0),
        totalToday:
          stats.totalToday + (isSameDay(expenseDate, now) ? expense.amount : 0),
      };
    },
    { totalThisMonth: 0, totalThisWeek: 0, totalToday: 0 },
  );
}

export function sortByDateDescending(expenses: Expense[]): Expense[] {
  return [...expenses].sort(
    (a, b) =>
      parseCalendarDate(b.date).getTime() - parseCalendarDate(a.date).getTime(),
  );
}
