"use strict";

// Helpers for installment plans and subscriptions. Dates are "YYYY-MM-DD" strings.

function parseISODate(text) {
  const [year, month, day] = text.split("-").map(Number);
  return { year, month, day };
}

function formatISODate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

// Adds `steps` weeks / months / years to a date. A start day that does not exist
// in the target month (e.g. the 31st) is clamped to the last day of that month.
function addUnits(startISO, steps, unit) {
  const { year, month, day } = parseISODate(startISO);
  if (unit === "weeks") {
    const moved = new Date(Date.UTC(year, month - 1, day) + steps * 7 * 86400000);
    return formatISODate(moved.getUTCFullYear(), moved.getUTCMonth() + 1, moved.getUTCDate());
  }
  const totalMonths = year * 12 + (month - 1) + steps * (unit === "years" ? 12 : 1);
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;
  return formatISODate(newYear, newMonth, Math.min(day, daysInMonth(newYear, newMonth)));
}

// Date of the k-th payment (k starts at 0).
function occurrenceDate(plan, k) {
  return addUnits(plan.start_date, k * plan.interval, plan.unit);
}

// Interest rate for one payment period, from a nominal yearly rate in percent.
function periodicRate(annualPercent, interval, unit) {
  const yearsPerPeriod = unit === "weeks" ? interval / 52 : unit === "years" ? interval : interval / 12;
  return (annualPercent / 100) * yearsPerPeriod;
}

// mode "total": `amount` is the amount to finance; payments are equal, with optional interest.
// mode "installment": `amount` is the amount of every payment (no interest calculation).
function installmentAmounts({ amount, mode, count, annualPercent, interval, unit }) {
  if (mode === "installment") {
    const each = Math.round(amount * 100) / 100;
    return { amounts: new Array(count).fill(each), total: Math.round(each * count * 100) / 100, interest: 0 };
  }
  const rate = periodicRate(annualPercent || 0, interval, unit);
  let amounts;
  if (rate > 0) {
    const payment = (amount * rate) / (1 - Math.pow(1 + rate, -count));
    amounts = new Array(count).fill(Math.round(payment * 100) / 100);
  } else {
    // No interest: split in cents, the last payment absorbs the rounding difference.
    const totalCents = Math.round(amount * 100);
    const base = Math.floor(totalCents / count);
    amounts = new Array(count).fill(base / 100);
    amounts[count - 1] = (totalCents - base * (count - 1)) / 100;
  }
  const total = Math.round(amounts.reduce((a, b) => a + b, 0) * 100) / 100;
  return { amounts, total, interest: Math.max(0, Math.round((total - amount) * 100) / 100) };
}

// Subscription charges that are due and not yet created: from plan.generated
// up to the end of the month that contains today.
function subscriptionDates(plan, todayISO) {
  const { year, month } = parseISODate(todayISO);
  const horizon = formatISODate(year, month, daysInMonth(year, month));
  const dates = [];
  for (let k = plan.generated; k < plan.generated + 2000; k++) {
    const date = occurrenceDate(plan, k);
    if (date > horizon) break;
    dates.push(date);
  }
  return dates;
}

if (typeof module !== "undefined") {
  module.exports = { addUnits, occurrenceDate, periodicRate, installmentAmounts, subscriptionDates };
}
