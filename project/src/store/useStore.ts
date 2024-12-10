import { create } from 'zustand';
import { Client, Invoice, Specialist } from '../types';

interface Store {
  clients: Client[];
  invoices: Invoice[];
  specialists: Specialist[];
  addClient: (client: Client) => void;
  addInvoice: (invoice: Invoice) => void;
  addSpecialist: (specialist: Specialist) => void;
  removeClient: (id: string) => void;
  removeInvoice: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  clients: [],
  invoices: [],
  specialists: [],
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
  addSpecialist: (specialist) =>
    set((state) => ({ specialists: [...state.specialists, specialist] })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    })),
}));