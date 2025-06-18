'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import EmployeesTable from '@/components/admin/EmployeesTable';
import AddEmployeeModal from '@/components/admin/AddEmployeeModal';
import EditEmployeeModal from '@/components/admin/EditEmployeeModal';
import { useEmployees } from '@/hooks/useEmployees';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: employees, isLoading, refetch } = useEmployees();

  // Filter employees based on search
  const filteredEmployees = employees?.filter(employee => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.phone.includes(debouncedSearchTerm) ||
      employee.email.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Calculate stats
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
  };

  const handleDeleteEmployee = (employee: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pegawai "${employee.name}"?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
      // Here you would call the delete API
      console.log('Delete employee:', employee.id);
      toast.success(`Pegawai "${employee.name}" berhasil dihapus!`, {
        position: "top-right",
        autoClose: 3000,
      });
      refetch();
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingEmployee(null);
    refetch(); // Refresh data after modal closes
  };

  return (
    <DashboardLayout title="Manajemen Pegawai" subtitle="Kelola data pegawai dan karyawan">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pegawai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEmployees}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pegawai Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeEmployees}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">👨‍💼 Daftar Pegawai</h2>
              <p className="text-sm text-gray-600">Kelola dan pantau data semua pegawai</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Pegawai</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Pencarian Pegawai
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, HP, atau email..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="text-gray-400">🔍</span>
                )}
              </div>
            </div>
            
            {/* Search Results Info */}
            <div className="mt-2 text-sm text-gray-600">
              {debouncedSearchTerm ? (
                <span>
                  Menampilkan {filteredEmployees.length} dari {employees?.length || 0} pegawai
                  {debouncedSearchTerm && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      "{debouncedSearchTerm}"
                    </span>
                  )}
                </span>
              ) : (
                <span>Total {employees?.length || 0} pegawai terdaftar</span>
              )}
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <EmployeesTable
          employees={paginatedEmployees}
          isLoading={isLoading}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={handleModalClose}
        />
      )}

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          isOpen={!!editingEmployee}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}