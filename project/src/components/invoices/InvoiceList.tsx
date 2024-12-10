import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InvoiceList() {
  const { invoices, clients, removeInvoice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client Inconnu';
  };

  const filteredInvoices = invoices.filter((invoice) =>
    getClientName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Factures</h1>
        <Link
          to="/invoices/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer une facture
        </Link>
      </div>

      <div className="flex items-center px-4 py-2 bg-white rounded-md shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des factures..."
          className="ml-2 flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Facture #{invoice.id}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {getClientName(invoice.clientId)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        €{invoice.total.toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {invoice.sessions} séances
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FileText className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => removeInvoice(invoice.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}