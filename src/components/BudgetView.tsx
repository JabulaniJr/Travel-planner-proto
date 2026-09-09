import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  PlusCircle,
  AlertCircle,
  Lightbulb,
  Plane,
  Building,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  Package,
  Calendar,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Trip, Expense } from '../types';

interface BudgetViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ trip, onUpdateTrip }) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // New Expense form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('Food');
  const [expensePaidBy, setExpensePaidBy] = useState(trip.members[0]?.id || 'user-current');
  const [expenseDate, setExpenseDate] = useState('2026-09-12');

  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = trip.totalBudget - totalSpent;
  const percentSpent = Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100));

  // Category totals
  const categoryConfig: Record<
    Expense['category'],
    { label: string; icon: any; color: string; emoji: string }
  > = {
    Flights: { label: 'Flights', icon: Plane, color: '#3B82F6', emoji: '✈️' },
    Accommodation: { label: 'Accommodation', icon: Building, color: '#6366F1', emoji: '🏨' },
    Food: { label: 'Food & Dining', icon: Utensils, color: '#F97316', emoji: '🍜' },
    Transport: { label: 'Transport', icon: Car, color: '#14B8A6', emoji: '🚕' },
    Activities: { label: 'Activities', icon: Ticket, color: '#EC4899', emoji: '🎟️' },
    Shopping: { label: 'Shopping', icon: ShoppingBag, color: '#8B5CF6', emoji: '🛍️' },
    Other: { label: 'Other / Misc', icon: Package, color: '#64748B', emoji: '📦' },
  };

  const chartData = (Object.keys(categoryConfig) as Expense['category'][])
    .map((cat) => {
      const amount = trip.expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        name: cat,
        value: amount,
        color: categoryConfig[cat].color,
        emoji: categoryConfig[cat].emoji,
      };
    })
    .filter((d) => d.value > 0);

  const handleAddExpense = () => {
    if (!expenseTitle.trim() || !expenseAmount || Number(expenseAmount) <= 0) return;

    const amountNum = Number(expenseAmount);
    const memberIds = trip.members.map((m) => m.id);
    const splitAmount = parseFloat((amountNum / memberIds.length).toFixed(2));

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: expenseTitle,
      amount: amountNum,
      currency: trip.currency,
      category: expenseCategory,
      paidByMemberId: expensePaidBy,
      date: expenseDate,
      splitBetween: memberIds,
      splits: memberIds.map((mId) => ({
        memberId: mId,
        amount: splitAmount,
        isPaid: mId === expensePaidBy,
      })),
    };

    onUpdateTrip({
      ...trip,
      expenses: [newExpense, ...trip.expenses],
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setIsAddExpenseOpen(false);
  };

  return (
    <div id="budget-view-container" className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trip Budget & Expenses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time spending, breakdown categories, and automated AI cost projections.
          </p>
        </div>

        <button
          id="open-add-expense-btn"
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* 12. Main 3 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Budget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Budget
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {trip.currency} {trip.totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Allocated for {trip.travellerCount} travellers ({trip.durationDays} days)
          </p>
        </div>

        {/* Spent */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Spent
          </span>
          <div className="text-3xl font-extrabold text-blue-600">
            {trip.currency} {totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {percentSpent}% of total budget reached
          </p>
        </div>

        {/* Remaining */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Remaining
          </span>
          <div
            className={`text-3xl font-extrabold ${
              remainingBudget < 0 ? 'text-red-600' : 'text-teal-600'
            }`}
          >
            {trip.currency} {remainingBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {remainingBudget >= 0 ? 'Comfortably within limit' : 'Budget exceeded!'}
          </p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Overall Budget Progress</span>
          <span>{percentSpent}% consumed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentSpent > 90
                ? 'bg-amber-500'
                : percentSpent > 70
                ? 'bg-teal-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>

      {/* AI Budget Insight Card */}
      <div
        id="ai-budget-insight-card"
        className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            💡 AI Budget Insight
          </h4>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">
            "You're spending 12% more on food than planned. Consider allocating {trip.currency}80 less
            per day for the remaining trip."
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Tip: Swap your planned Day 3 Wagyu banquet for the Michelin Bib-Gourmand ramen to save ~
            {trip.currency}115 per person without sacrificing gastronomic quality.
          </p>
        </div>
      </div>

      {/* Category Breakdown & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(categoryConfig) as Expense['category'][]).map((cat) => {
              const conf = categoryConfig[cat];
              const Icon = conf.icon;
              const catTotal = trip.expenses
                .filter((e) => e.category === cat)
                .reduce((s, e) => s + e.amount, 0);
              const pct = totalSpent > 0 ? Math.round((catTotal / totalSpent) * 100) : 0;

              return (
                <div
                  key={cat}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: conf.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {conf.emoji} {conf.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{pct}% of spend</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      {trip.currency} {catTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart (1 col) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Spending Distribution
          </h3>
          <div className="w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${trip.currency} ${Number(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-1">
            Interactive breakdown of logged purchases.
          </p>
        </div>
      </div>

      {/* Recent Expense Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
          <span className="text-xs text-slate-400">{trip.expenses.length} records</span>
        </div>

        <div className="divide-y divide-slate-100">
          {trip.expenses.map((exp) => {
            const payer = trip.members.find((m) => m.id === exp.paidByMemberId);
            const conf = categoryConfig[exp.category];

            return (
              <div
                key={exp.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{conf.emoji}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Paid by <span className="font-semibold text-slate-700">{payer?.name || 'Group'}</span> •{' '}
                      {exp.date} • Split between {exp.splitBetween.length} people
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {trip.currency} {exp.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {trip.currency} {(exp.amount / (exp.splitBetween.length || 1)).toFixed(2)} / person
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Expense</h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Asakusa Street Food Dinner"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Amount ({trip.currency})
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Activities">Activities</option>
                    <option value="Flights">Flights</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Paid By
                  </label>
                  <select
                    value={expensePaidBy}
                    onChange={(e) => setExpensePaidBy(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {trip.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.isCurrentUser ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                Add to Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
