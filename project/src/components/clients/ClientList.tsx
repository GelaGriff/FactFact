import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientList() {
  const { clients, removeClient } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <Link
          to="/clients/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un client
        </Link>
      </div>

      <div className="flex items-center px-4 py-2 bg-white rounded-md shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des clients..."
          className="ml-2 flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredClients.map((client) => (
            <li key={client.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{client.email}</p>
                      {client.phone && (
                        <p className="mt-1 text-sm text-gray-500">
                          {client.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/clients/${client.id}/edit`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => removeClient(client.id)}
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