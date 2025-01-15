export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
}
export enum TransactionType {
  Income = 'income',
  Expense = 'expense'
}

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export enum IncomeCategory {
  Salary = 'salary',
  Bonus = 'bonus',
  InvestmentIncome = 'investment income',
  RentalIncome = 'rental income',
  Freelance = 'freelance',
  Refund = 'refund',
  OtherIncome = 'other income'
}

export enum ExpenseCategory {
  Housing = 'housing',
  Utilities = 'utilities',
  Groceries = 'groceries',
  DiningOut = 'dining out',
  Transportation = 'transportation',
  Healthcare = 'healthcare',
  Insurance = 'insurance',
  Entertainment = 'entertainment',
  Subscriptions = 'subscriptions',
  Education = 'education',
  Childcare = 'childcare',
  PersonalCare = 'personal care',
  Shopping = 'shopping',
  DebtPayment = 'debt payment',
  Taxes = 'taxes',
  Travel = 'travel',
  Gifts = 'gifts',
  Charity = 'charity',
  Miscellaneous = 'miscellaneous'
}
