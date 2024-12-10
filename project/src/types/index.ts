export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  specialistId: string;
  sessions: number;
  pricePerSession: number;
  total: number;
  date: Date;
  status: 'draft' | 'final';
}

export interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
}