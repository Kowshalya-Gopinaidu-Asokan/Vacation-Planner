import { useState } from 'react';
import type { ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../types';
import { validateExpense } from '../../utils/validation';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

interface BudgetTrackerProps {
  tripId: string;
}

export function BudgetTracker({ tripId }: BudgetTrackerProps) {
  const { getTripExpenses, addExpense, deleteExpense, data } = useApp();
  const expenses = getTripExpenses(tripId);
  const trip = data.trips.find((t) => t.id === tripId);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = trip?.estimatedBudget ?? 0;
  const remaining = budget - total;
  const overBudget = remaining < 0;

  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateExpense({ description, amount });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    addExpense({
      tripId,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
    });

    setDescription('');
    setAmount('');
    setCategory('other');
    setErrors({});
  };

  return (
    <div className="budget animate-in">
      <div className="budget__summary">
        <Card className="budget-stat">
          <p className="budget-stat__label">Total Planned</p>
          <p className="budget-stat__value">${total.toLocaleString()}</p>
        </Card>
        <Card className="budget-stat">
          <p className="budget-stat__label">Estimated Budget</p>
          <p className="budget-stat__value">${budget.toLocaleString()}</p>
        </Card>
        <Card className={`budget-stat ${overBudget ? 'budget-stat--warning' : 'budget-stat--success'}`}>
          <p className="budget-stat__label">{overBudget ? 'Over Budget' : 'Remaining'}</p>
          <p className="budget-stat__value">${Math.abs(remaining).toLocaleString()}</p>
        </Card>
      </div>

      {categoryTotals.length > 0 && (
        <Card className="budget__breakdown">
          <h3>By Category</h3>
          <div className="category-bars">
            {categoryTotals.map((cat) => (
              <div key={cat.value} className="category-bar">
                <div className="category-bar__header">
                  <span>{cat.label}</span>
                  <span>${cat.total.toLocaleString()}</span>
                </div>
                <div className="category-bar__track">
                  <div
                    className="category-bar__fill"
                    style={{ width: `${total > 0 ? (cat.total / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3>Add Expense</h3>
        <form className="form" onSubmit={handleAdd} noValidate>
          <div className="form__row form__row--wrap">
            <div className="form__group form__group--grow">
              <label htmlFor="exp-desc">Description</label>
              <input
                id="exp-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hotel booking"
                className={errors.description ? 'input--error' : ''}
              />
              {errors.description && (
                <span className="form__error">{errors.description}</span>
              )}
            </div>
            <div className="form__group">
              <label htmlFor="exp-amount">Amount ($)</label>
              <input
                id="exp-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={errors.amount ? 'input--error' : ''}
              />
              {errors.amount && <span className="form__error">{errors.amount}</span>}
            </div>
            <div className="form__group">
              <label htmlFor="exp-category">Category</label>
              <select
                id="exp-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit">Add Expense</Button>
        </form>
      </Card>

      {expenses.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No expenses tracked"
          description="Add planned expenses to keep your vacation budget on track."
        />
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => {
            const catLabel =
              EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label ?? expense.category;
            return (
              <li key={expense.id} className="expense-item animate-in">
                <div className="expense-item__info">
                  <strong>{expense.description}</strong>
                  <span className="expense-item__category">{catLabel}</span>
                </div>
                <div className="expense-item__right">
                  <span className="expense-item__amount">${expense.amount.toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                    aria-label={`Remove ${expense.description}`}
                  >
                    ✕
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
