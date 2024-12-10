import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Invoice } from '../../types';
import { jsPDF } from 'jspdf';

const SPECIALIST_INFO = {
  name: 'Salima Gee',
  address: '13 rue perchamps',
  email: 'sallygere16@gmail.com',
  siret: '33775562300051'
};

export function InvoiceForm() {
  const navigate = useNavigate();
  const { addInvoice, clients, invoices } = useStore();
  const [formData, setFormData] = useState({
    clientId: '',
    sessionType: '',
    sessions: 1,
    pricePerSession: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const total = formData.sessions * formData.pricePerSession;
  
  // Generate next invoice number based on existing invoices
  const getNextInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const yearInvoices = invoices.filter(inv => 
      new Date(inv.date).getFullYear() === currentYear
    );
    return `${currentYear}-${(yearInvoices.length + 1).toString().padStart(4, '0')}`;
  };

  const generatePDF = (invoice: Invoice) => {
    const client = clients.find(c => c.id === invoice.clientId);
    const doc = new jsPDF();
    
    // Specialist information (top left)
    doc.setFontSize(12);
    doc.text(SPECIALIST_INFO.name, 20, 20);
    doc.text(SPECIALIST_INFO.address, 20, 30);
    doc.text(SPECIALIST_INFO.email, 20, 40);
    doc.text(`SIRET: ${SPECIALIST_INFO.siret}`, 20, 50);
    
    // Client information (top right)
    if (client) {
      doc.text('Client:', 120, 20);
      doc.text(`${client.firstName} ${client.lastName}`, 120, 30);
      doc.text(client.email, 120, 40);
    }
    
    // Invoice number and date
    doc.setFontSize(14);
    doc.text(`Facture N° ${invoice.id}`, 20, 70);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 80);
    
    // Invoice details
    doc.setFontSize(12);
    doc.text('Description', 20, 100);
    doc.text('Type de séance', 60, 100);
    doc.text('Nombre', 120, 100);
    doc.text('Prix unitaire', 150, 100);
    doc.text('Total', 180, 100);
    
    // Line items
    doc.text('Consultation', 20, 110);
    doc.text(formData.sessionType, 60, 110);
    doc.text(`${invoice.sessions}`, 120, 110);
    doc.text(`€${invoice.pricePerSession}`, 150, 110);
    doc.text(`€${invoice.total}`, 180, 110);
    
    // Total
    doc.setFontSize(14);
    doc.text(`Total à payer: €${invoice.total}`, 180, 130, { align: 'right' });
    
    // Save the PDF
    doc.save(`facture-${invoice.id}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: getNextInvoiceNumber(),
      ...formData,
      total,
      date: new Date(formData.date),
      status: 'final'
    };
    addInvoice(newInvoice);
    generatePDF(newInvoice);
    navigate('/invoices');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Créer une nouvelle facture</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type de séance</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.sessionType}
            onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
            placeholder="Ex: Consultation, Suivi, Bilan..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de séances</label>
          <input
            type="number"
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.sessions}
            onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix par séance</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.pricePerSession}
            onChange={(e) => setFormData({ ...formData, pricePerSession: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-lg font-semibold">Total: €{total.toFixed(2)}</p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Créer la facture
          </button>
        </div>
      </form>
    </div>
  );
}