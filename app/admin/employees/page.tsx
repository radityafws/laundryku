'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import { useEmployees } from '@/hooks/useDashboard';

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'staff': return '👨‍💼';
      case 'driver': return '🚚';
      default: return '👤';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'staff': return 'Staff Laundry';
      case 'driver': return 'Driver';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
  };

  const totalSalary = employees?.reduce((sum, emp) => sum + emp.salary, 0) || 0;
  const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;

  return (
    <DashboardLayout title="Manajemen Pegawai" subtitle="Manage staff and employee data">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pegawai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
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

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Gaji Bulanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSalary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">👥 Daftar Pegawai</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
                <span>➕</span>
                <span>Tambah Pegawai</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : employees && employees.length > 0 ? (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <span>{getRoleIcon(employee.role)}</span>
                            <span>{getRoleName(employee.role)}</span>
                          </span>
                          <span>📧 {employee.email}</span>
                          <span>📱 {employee.phone}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Bergabung: {formatDate(employee.joinDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(employee.salary)}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">per bulan</p>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 bg-blue-50 rounded-lg">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1 bg-red-50 rounded-lg">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Belum Ada Data Pegawai
                </h3>
                <p className="text-gray-600 mb-6">
                  Mulai tambahkan data pegawai untuk manajemen yang lebih baik.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                  Tambah Pegawai Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}