// src/App.jsx
// Washdoor POS & Customer Management Application (Original Nav & Topbar Integration)

import React, { useState, useEffect } from 'react';
import { initialOrders, SERVICE_CATEGORIES } from './data/mockOrders';
import { CURRENCIES, LANGUAGES, TRANSLATIONS } from './data/i18nConfig';
import OrdersTableView from './components/kanban/OrdersTableView';
import OrdersKanbanView from './components/kanban/OrdersKanbanView';
import EditOrderModal from './components/kanban/EditOrderModal'; // ✅ NEW: Edit Order
import OrderDetailsModal from './components/kanban/OrderDetailsModal'; // ✅ NEW: View Details
import CreateOrderModal from './components/kanban/CreateOrderModal';

// ================= EXACT PIXEL-PERFECT THERMAL INVOICE MODAL =================
function ThermalReceiptModal({ isOpen, onClose, order }) {
  const [paperSize, setPaperSize] = useState('80mm');

  if (!isOpen || !order) return null;

  const orderId = order.id || 'ORD00042';
  const customerName = order.customer_name || 'Venkat-4999';
  const customerPhone = order.customer_phone || '+91 98388 88981';
  const address = order.address || '12 New entry address 238462';
  const dateStr = order.created_at || '2026-11-14 10:56 AM';

  const grandTotal = Number(order.amount) || 264.60;
  const subtotal = (grandTotal / 1.05).toFixed(2);
  const gst = (grandTotal - subtotal).toFixed(2);
  const isPaid = order.payment_status === 'Paid';

  const billItems = [
    { name: 'T-Shirt', cat: '[Laundry]', qty: 1, amt: 12.00 },
    { name: 'Formal Pant', cat: '[Laundry]', qty: 1, amt: 20.00 },
    { name: 'Shoe', cat: '[Laundry]', qty: 1, amt: 80.00 },
    { name: 'Jeans', cat: '[Laundry]', qty: 1, amt: 25.00 },
    { name: 'Saree', cat: '[Laundry]', qty: 1, amt: 60.00 },
    { name: 'Frock', cat: '[Laundry]', qty: 1, amt: 30.00 },
    { name: 'Kurta', cat: '[Laundry]', qty: 1, amt: 25.00 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-full">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-purple-600 text-base">📄</span>
            <span className="font-bold text-slate-800 text-sm">Thermal Invoice & Rece...</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaperSize('80mm')}
                className={`px-3 py-1 rounded-md transition ${paperSize === '80mm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                80mm (Counter)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('58mm')}
                className={`px-3 py-1 rounded-md transition ${paperSize === '58mm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                58mm (Mobile)
              </button>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
          </div>
        </div>

        <div className="bg-slate-200 p-6 flex justify-center max-h-[75vh] overflow-y-auto print:p-0 print:bg-white print:max-h-full">
          <div
            style={{ minHeight: 'fit-content' }}
            className={`bg-white text-slate-900 shadow-2xl p-6 border border-slate-300 font-mono space-y-3 transition-all duration-200 print:shadow-none print:border-none print:p-0 ${
              paperSize === '80mm' ? 'w-[340px] text-xs' : 'w-[270px] text-[10px]'
            }`}
          >
            <div className="text-center space-y-0.5">
              <h2 className="font-black text-base tracking-widest text-slate-950 font-sans">WASHDOOR</h2>
              <p className="text-[10px] text-slate-600 font-sans font-medium">Professional Laundry & Dry Cleaning</p>
              <p className="text-[10px] text-slate-600 font-sans">Ranipet Store #1</p>
              <p className="text-[9px] text-slate-500 font-sans">GSTIN: 33AABCT1332L1ZB</p>
              <p className="text-[9px] text-slate-500 font-sans">Tel: +91 7338851369</p>
              <div className="border-b border-dashed border-slate-400 pt-1.5"></div>
            </div>

            <div className="space-y-0.5 text-[11px] leading-tight font-sans">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-slate-700">ORDER:</span>
                <span className="font-black text-slate-950">{orderId}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="font-bold text-slate-700">DATE:</span>
                <span>{dateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">CUSTOMER:</span>
                <span className="font-bold text-slate-900 truncate max-w-[170px]">{customerName}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="font-bold text-slate-700">MOBILE:</span>
                <span>{customerPhone}</span>
              </div>
              {address && <div className="text-[10px] text-slate-600 truncate pt-0.5">{address}</div>}
              <div className="border-b border-dashed border-slate-400 pt-1.5"></div>
            </div>

            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-[10px] font-bold text-slate-900">
                    <th className="text-left pb-1 font-bold">ITEM / SERVICE</th>
                    <th className="text-center pb-1 w-10 font-bold">QTY</th>
                    <th className="text-right pb-1 w-14 font-bold">AMT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {billItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-left py-1 pr-1 align-top">
                        <div className="font-bold text-slate-900 leading-snug">{item.name}</div>
                        <div className="text-[9px] text-slate-500 font-sans">{item.cat}</div>
                      </td>
                      <td className="text-center py-1 font-mono font-bold text-slate-900 align-top w-10">{item.qty}</td>
                      <td className="text-right py-1 font-mono font-bold text-slate-900 align-top w-14">₹{item.amt.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-b border-dashed border-slate-400 pt-1.5"></div>
            </div>

            <div className="space-y-0.5 text-[11px] font-sans">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>GST (5%):</span>
                <span className="font-mono font-medium">₹{gst}</span>
              </div>
              <div className="border-b border-slate-300 my-1"></div>
              <div className="flex justify-between font-black text-xs text-slate-950 py-0.5">
                <span>GRAND TOTAL:</span>
                <span className="font-mono text-sm">₹{grandTotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-[10px]">
                <span>Advance Paid:</span>
                <span className="font-mono">-₹264.00</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold text-[10px]">
                <span>BALANCE DUE:</span>
                <span className="font-mono">₹0.60</span>
              </div>
              <div className="flex justify-between text-slate-700 text-[10px] pt-1 font-medium">
                <span>Payment:</span>
                <span>Paid (Cash)</span>
              </div>
              <div className="flex justify-between text-slate-700 text-[10px] font-medium">
                <span>Target Delivery:</span>
                <span>20 Oct 2026 05:00 PM</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[9px] text-slate-500 font-sans border-t border-dashed border-slate-300">
              Thank you for choosing Washdoor! Retain bill for delivery.
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-xs print:hidden">
          <span className="text-slate-500 font-medium">Ready to print on {paperSize} thermal printer</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold">
              Close
            </button>
            <button type="button" onClick={() => window.print()} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition">
              <span>🖨️</span> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= DRIVER ASSIGN MODAL =================
function DriverAssignModal({ isOpen, onClose, order, onUpdateDriver }) {
  const [selectedDriver, setSelectedDriver] = useState(order?.driver || 'Venkatesa R...');
  if (!isOpen || !order) return null;

  const DRIVERS = [
    { name: 'Venkatesa R...', phone: '+91 98401 11223', status: 'Available', vehicle: 'Van (TN-73-A-1234)' },
    { name: 'Ramesh', phone: '+91 98402 33445', status: 'On Route', vehicle: 'Bike (TN-73-B-5678)' },
    { name: 'Sakthi', phone: '+91 98403 55667', status: 'Available', vehicle: 'Van (TN-73-C-9900)' },
    { name: 'Vijay Kumar', phone: '+91 98404 77889', status: 'Counter Staff', vehicle: 'Store Counter' },
    { name: 'Venkat', phone: '+91 98405 99001', status: 'Available', vehicle: 'Bike (TN-73-D-2211)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚚</span> Assign Delivery Driver
            </h3>
            <p className="text-xs text-slate-400">Order: <span className="font-bold text-blue-600">{order.id}</span> ({order.customer_name})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Executive:</label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {DRIVERS.map((d) => (
              <div
                key={d.name}
                onClick={() => setSelectedDriver(d.name)}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                  selectedDriver === d.name
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>👤 {d.name}</span>
                    {selectedDriver === d.name && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">Selected</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">📞 {d.phone} • {d.vehicle}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  d.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onUpdateDriver(order.id, selectedDriver); onClose(); }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= EXACT NAVIGATION ITEMS FROM ORIGINAL PROJECT =================
const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'order',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <path d="M9 12h6"></path>
        <path d="M9 16h6"></path>
      </svg>
    ),
  },
  {
    id: 'customer',
    label: 'Customers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 'customer_mui',
    label: 'Customer Reference',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"></rect>
        <path d="M3 9h18"></path>
        <path d="M9 21V9"></path>
      </svg>
    ),
  },
  {
    id: 'report',
    label: 'Reports',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
  },
  {
    id: 'account',
    label: 'Account',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M20 21a8 8 0 1 0-16 0"></path>
      </svg>
    ),
  },
  {
    id: 'audit',
    label: 'Audit Log',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
        <path d="M10 9H8"></path>
      </svg>
    ),
  },
];

// ================= MAIN APP COMPONENT =================
export default function App() {
  const [activeTab, setActiveTab] = useState('order'); // Currently active on Orders
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // Collapsible like original project

  const [orders, setOrders] = useState(initialOrders);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const [navSearchQuery, setNavSearchQuery] = useState('');

  // Modals States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // ✅ NEW: Edit Order
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // ✅ NEW: View Details
  const [activeOrder, setActiveOrder] = useState(null);

  // Dropdown States
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Settings
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0] || { code: 'INR', symbol: '₹', label: 'INR (₹)' });
  const [selectedLang, setSelectedLang] = useState('en');

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const formatPrice = (amount) => {
    const rate = selectedCurrency.rate || 1;
    const converted = (amount * rate).toFixed(2);
    return `${selectedCurrency.symbol}${converted}`;
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleUpdateDriver = (orderId, newDriver) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, driver: newDriver } : order
      )
    );
  };

  // WhatsApp Sender
  const handleWhatsAppAlert = (order) => {
    if (!order) return;
    let cleanPhone = (order.customer_phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const customerName = order.customer_name || 'Customer';
    const orderId = order.id || 'ORD';
    const status = order.status || 'Delivered';
    const amount = order.amount || '0';

    const message = `Hello ${customerName}! ✨\nRegarding your Washdoor laundry order ${orderId} (Status: ${status}, Total: ₹${amount}): We are pleased to serve you. Please let us know if you need any assistance! — Washdoor Team`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

const handleAddOrder = (newOrder) => {
  setOrders((prev) => [newOrder, ...prev]);

  // Reset filters so the new order is visible
  setStatusFilter('All');
  setServiceFilter('All Services');
  setDateFilter('All Time');
  setPageSearchQuery('');
  setNavSearchQuery('');
  setCurrentPage(1);
};
  // ✅ NEW: Edit Order – replace only the edited order in the list
  const handleUpdateOrder = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
    setActiveOrder((prev) => (prev && prev.id === updatedOrder.id ? { ...prev, ...updatedOrder } : prev));
  };

  // ✅ NEW: Edit Order – open the edit drawer for an order
  const handleOpenEditModal = (order) => {
    setActiveOrder(order);
    setIsEditModalOpen(true);
  };

  // ✅ NEW: View Details – open the order details popup
  const handleOpenDetailsModal = (order) => {
    setActiveOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = "Order ID,Customer,Phone,Address,Services,Category,Status,Driver,Amount,Payment Status,Created At\n";
    const rows = filteredOrders
      .map(o => `"${o.id}","${o.customer_name}","${o.customer_phone}","${o.address}","${o.services}","${o.category}","${o.status}","${o.driver}",${o.amount},"${o.payment_status}","${o.created_at}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `washdoor_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesService = serviceFilter === 'All Services' || o.category === serviceFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'All Time') return true;
      if (dateFilter === 'Today') return o.date_group === 'Today';
      if (dateFilter === 'Yesterday') return o.date_group === 'Yesterday';
      if (dateFilter === 'Last 7 Days') {
        return ['Today', 'Yesterday', 'Last 7 Days'].includes(o.date_group);
      }
      if (dateFilter === 'This Month') {
        return ['Today', 'Yesterday', 'Last 7 Days', 'This Month'].includes(o.date_group);
      }
      return true;
    })();

    const combinedSearch = (pageSearchQuery || navSearchQuery).toLowerCase();
    const matchesSearch =
      !combinedSearch ||
      o.id.toLowerCase().includes(combinedSearch) ||
      o.customer_name.toLowerCase().includes(combinedSearch) ||
      o.customer_phone.includes(combinedSearch);

    return matchesStatus && matchesService && matchesDate && matchesSearch;
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const counts = {
    All: orders.length,
    'Order Received': orders.filter(o => o.status === 'Order Received').length,
    'In Progress': orders.filter(o => o.status === 'In Progress').length,
    Ready: orders.filter(o => o.status === 'Ready').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors">
      
      {/* ── 1. EXACT SIDEBAR FROM ORIGINAL PROJECT ── */}
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-4 shrink-0 transition-all duration-200 z-20 ${
          isNavCollapsed ? 'w-16 items-center' : 'w-60 px-3'
        }`}
      >
        <div className="flex flex-col gap-4 w-full">
          {/* Brand Logo & Title */}
          <div className={`flex items-center gap-3 ${isNavCollapsed ? 'justify-center' : 'px-2'}`}>
            <div
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/25 cursor-pointer shrink-0"
              title="Click to toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            {!isNavCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-black tracking-wide text-slate-900 dark:text-white truncate">WASHDOOR</h1>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold truncate">Ranipet Store #1</p>
              </div>
            )}
          </div>

          {/* Navigation Items List */}
          <nav className="flex flex-col gap-1 w-full mt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`flex items-center rounded-xl transition-all font-bold text-xs ${
                    isNavCollapsed
                      ? 'w-10 h-10 justify-center'
                      : 'w-full px-3.5 py-2.5 gap-3 justify-start'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isNavCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Store Info Card */}
        <div className={`w-full pt-3 border-t border-slate-100 dark:border-slate-800 ${isNavCollapsed ? 'flex justify-center' : 'px-2'}`}>
          {isNavCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-2xs" title="Ranipet Store #1 • Live Counter">
              🏪
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Ranipet Store #1</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Counter Active</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── 2. MAIN WORKSPACE WITH EXACT TOPBAR ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* EXACT TOP NAVBAR */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 gap-4">
          
          {/* Left: Desktop Toggle + Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-300 text-lg p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Navigation Menu"
            >
              ☰
            </button>

            <div className="relative w-full max-w-md">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Mobile Number..."
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 placeholder:text-slate-400 transition"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 px-1.5 py-0.2 rounded shadow-2xs">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right: Notifications, Supabase Live, Dropdowns, Avatar */}
          <div className="flex items-center gap-2 text-xs">
            {/* Notification Bell with Red Dot */}
            <button className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition" title="Notifications">
              <span className="text-sm">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900"></span>
            </button>

            {/* Supabase Live Pill */}
            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Live</span>
            </div>

            {/* Currency Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen); setIsLangDropdownOpen(false); }}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 shadow-2xs flex items-center gap-1"
              >
                <span>{selectedCurrency.code} ({selectedCurrency.symbol.trim()})</span>
                <span className="text-[10px]">▾</span>
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-1.5 text-xs">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Select Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { setSelectedCurrency(c); setIsCurrencyDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition ${
                        selectedCurrency.code === c.code ? 'font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{c.label}</span>
                      {selectedCurrency.code === c.code && <span className="font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setIsLangDropdownOpen(!isLangDropdownOpen); setIsCurrencyDropdownOpen(false); }}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 shadow-2xs flex items-center gap-1"
              >
                <span>🌐 {selectedLang === 'en' ? 'English' : LANGUAGES.find(l => l.code === selectedLang)?.native}</span>
                <span className="text-[10px]">▾</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-1.5 text-xs">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Select Language
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setSelectedLang(l.code); setIsLangDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition ${
                        selectedLang === l.code ? 'font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{l.native} <span className="text-[10px] text-slate-400">({l.label})</span></span>
                      {selectedLang === l.code && <span className="font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 shadow-2xs flex items-center gap-1"
            >
              {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>

            {/* Reports & Audit Button */}
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
            >
              <span>📊</span>
              <span>Reports & Audit</span>
            </button>

            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs cursor-pointer ml-1">
              A
            </div>
          </div>
        </header>

        {/* ── 3. WORKSPACE BODY: ORDERS & POS PAGE ── */}
        <main className="p-6 flex-1 flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Orders &amp; POS
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                Orders &amp; POS Counter Intake • Washdoor Laundry
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap relative">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name..."
                  value={pageSearchQuery}
                  onChange={(e) => setPageSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl w-56 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setIsDateDropdownOpen(!isDateDropdownOpen); setIsFilterDropdownOpen(false); }}
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50"
                >
                  📅 {dateFilter} ▾
                </button>
                {isDateDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1 text-xs">
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Date Range
                    </div>
                    {['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'This Month'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => { setDateFilter(d); setIsDateDropdownOpen(false); setCurrentPage(1); }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition ${
                          dateFilter === d ? 'font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : ''
                        }`}
                      >
                        <span>{d}</span>
                        {dateFilter === d && <span className="font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* + Create Order Button */}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition active:scale-95"
              >
                <span>+ Create Order</span>
                <span className="bg-blue-700 text-white text-[10px] px-1.5 rounded font-mono">N</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition"
              >
                📥 Export
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['All', 'Order Received', 'In Progress', 'Ready', 'Delivered'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2 transition ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  <span>• {st}</span>
                  <span className={`text-[11px] px-1.5 rounded-full font-black ${statusFilter === st ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    {counts[st] ?? 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs relative shrink-0">
              {/* Category Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition ${
                    serviceFilter !== 'All Services'
                      ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>⚙️ Filters</span>
                  {serviceFilter !== 'All Services' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  <span>▾</span>
                </button>

                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Service Category
                    </div>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setServiceFilter(cat);
                          setIsFilterDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-semibold transition ${
                          serviceFilter === cat
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{cat}</span>
                        {serviceFilter === cat && <span className="font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => {
                  setPageSearchQuery('');
                  setNavSearchQuery('');
                  setServiceFilter('All Services');
                  setStatusFilter('All');
                  setDateFilter('All Time');
                }}
                title="Reset Filters"
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-2xs"
              >
                🔄
              </button>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>

              {/* View Switcher: Table vs Kanban */}
              <div className="inline-flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  📋 Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  📊 Kanban
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC VIEW: Table or Kanban */}
          <div className="flex-1 min-h-0">
            {viewMode === 'kanban' ? (
              <OrdersKanbanView orders={filteredOrders} onStatusUpdate={handleStatusUpdate} formatPrice={formatPrice} onOpenEditModal={handleOpenEditModal} />
            ) : (
              <OrdersTableView
                orders={paginatedOrders}
                formatPrice={formatPrice}
                onOpenDriverModal={(order) => { setActiveOrder(order); setIsDriverModalOpen(true); }}
                onOpenReceiptModal={(order) => { setActiveOrder(order); setIsReceiptModalOpen(true); }}
                onOpenWhatsAppModal={handleWhatsAppAlert}
                onOpenEditModal={handleOpenEditModal}
                onOpenDetailsModal={handleOpenDetailsModal} // ✅ NEW: View Details
              />
            )}
          </div>

          {/* PAGINATION FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div>
              Showing <span className="font-extrabold text-slate-900 dark:text-slate-100">{totalOrders === 0 ? 0 : startIndex + 1}</span>-
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{Math.min(startIndex + pageSize, totalOrders)}</span> of{' '}
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{totalOrders}</span> orders
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 font-bold focus:outline-none shadow-2xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-30 font-bold shadow-2xs"
                >
                  ‹
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded-md font-extrabold transition shadow-2xs ${
                      currentPage === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages || totalOrders === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-30 font-bold shadow-2xs"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

    {/* CREATE ORDER MODAL */}
<CreateOrderModal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  onAddOrder={handleAddOrder}
  orders={orders}
/>


      {/* DRIVER ASSIGN MODAL */}
      <DriverAssignModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        order={activeOrder}
        onUpdateDriver={handleUpdateDriver}
      />

      {/* THERMAL INVOICE MODAL */}
      <ThermalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={activeOrder}
      />

      {/* ✅ NEW: EDIT ORDER MODAL */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={activeOrder}
        onUpdateOrder={handleUpdateOrder}
      />

      {/* ✅ NEW: ORDER DETAILS MODAL */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={activeOrder}
        formatPrice={formatPrice}
        onEdit={(order) => { setIsDetailsModalOpen(false); handleOpenEditModal(order); }}
        onPrintReceipt={(order) => { setIsDetailsModalOpen(false); setActiveOrder(order); setIsReceiptModalOpen(true); }}
        onWhatsApp={handleWhatsAppAlert}
      />

    </div>
  );
}