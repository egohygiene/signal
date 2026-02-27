export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'other';

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number | null;
};
