'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { toast } from 'react-toastify';

interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
  bodyTemplate: string;
  messageTemplate: string;
}

interface BackupInfo {
  lastBackupDate: string;
  lastBackupTime: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'backup'>('notifications');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Mock last backup info
  const [lastBackup] = useState<BackupInfo>({
    lastBackupDate: '20/01/2025',
    lastBackupTime: '14:30'
  });

  const {
    register: registerWhatsApp,
    handleSubmit: handleSubmitWhatsApp,
    formState: { errors: whatsAppErrors },
    reset: resetWhatsApp
  } = useForm<WhatsAppConfig>({
    defaultValues: {
      apiKey: '',
      apiUrl: 'https://api.whatsapp.com/send',
      bodyTemplate: `{
  "to": "{{no_hp}}",
  "message": "{{message}}"
}`,
      messageTemplate: `Halo {{nama}}, pesanan Anda dengan invoice {{invoice}} saat ini berstatus "{{status}}". Estimasi selesai: {{estimasi_selesai}}.

Terima kasih telah menggunakan layanan LaundryKilat!`
    }
  });

  const onSubmitWhatsApp = async (data: WhatsAppConfig) => {
    setIsSubmitting(true);
    
    try {
      // Here you would call your API to save WhatsApp configuration
      console.log('Saving WhatsApp config:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Konfigurasi WhatsApp berhasil disimpan!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      toast.error('Gagal menyimpan konfigurasi. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    
    try {
      // Here you would call your API to generate backup
      console.log('Generating backup...');
      
      // Simulate backup generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock backup file for download
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          customers: [],
          orders: [],
          employees: [],
          expenses: [],
          settings: {}
        }
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laundrykilat-backup-${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Backup berhasil diunduh!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Gagal membuat backup. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.sql') && !file.name.endsWith('.json')) {
        toast.error('Format file tidak valid. Gunakan file .sql atau .json', {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      setBackupFile(file);
    }
  };

  const handleRestore = async () => {
    if (!backupFile) {
      toast.error('Pilih file backup terlebih dahulu!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsRestoring(true);
    
    try {
      // Here you would call your API to restore from backup
      console.log('Restoring from backup:', backupFile.name);
      
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success('Data berhasil direstore dari backup!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      setBackupFile(null);
      setShowRestoreConfirm(false);
      
      // Reset file input
      const fileInput = document.getElementById('backup-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Gagal restore data. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const tabs = [
    {
      id: 'notifications',
      label: 'Notifikasi',
      icon: '📱',
      description: 'Konfigurasi WhatsApp'
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: '💾',
      description: 'Manajemen Data'
    }
  ];

  return (
    <DashboardLayout title="Pengaturan Sistem" subtitle="Konfigurasi sistem dan manajemen data">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">⚙️ Pengaturan Sistem</h2>
              <p className="text-gray-600">Kelola konfigurasi sistem dan backup data</p>
            </div>
          </div>

          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'notifications' | 'backup')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <span>📱</span>
                <span>Konfigurasi Notifikasi WhatsApp</span>
              </h3>
              <p className="text-gray-600">Atur integrasi WhatsApp untuk notifikasi otomatis kepada pelanggan</p>
            </div>

            <form onSubmit={handleSubmitWhatsApp(onSubmitWhatsApp)} className="space-y-6">
              {/* API Key */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
                  🔑 API Key WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  {...registerWhatsApp('apiKey', {
                    required: 'API Key wajib diisi',
                    minLength: {
                      value: 10,
                      message: 'API Key minimal 10 karakter'
                    }
                  })}
                  type="password"
                  placeholder="Masukkan API Key WhatsApp Anda"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    whatsAppErrors.apiKey ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {whatsAppErrors.apiKey && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>❌</span>
                    <span>{whatsAppErrors.apiKey.message}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Digunakan untuk otorisasi mengakses layanan WhatsApp API
                </p>
              </div>

              {/* API URL */}
              <div>
                <label htmlFor="apiUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                  🌐 URL API WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  {...registerWhatsApp('apiUrl', {
                    required: 'URL API wajib diisi',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'URL harus dimulai dengan http:// atau https://'
                    }
                  })}
                  type="url"
                  placeholder="https://api.whatsapp.com/send"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    whatsAppErrors.apiUrl ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {whatsAppErrors.apiUrl && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>❌</span>
                    <span>{whatsAppErrors.apiUrl.message}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Endpoint HTTP untuk mengirim pesan WhatsApp
                </p>
              </div>

              {/* Body Template */}
              <div>
                <label htmlFor="bodyTemplate" className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Body Template untuk Fetching <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerWhatsApp('bodyTemplate', {
                    required: 'Body template wajib diisi',
                    validate: (value) => {
                      try {
                        JSON.parse(value);
                        return true;
                      } catch {
                        return 'Format JSON tidak valid';
                      }
                    }
                  })}
                  rows={8}
                  placeholder={`{
  "to": "{{no_hp}}",
  "message": "{{message}}"
}`}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none font-mono text-sm resize-none ${
                    whatsAppErrors.bodyTemplate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {whatsAppErrors.bodyTemplate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>❌</span>
                    <span>{whatsAppErrors.bodyTemplate.message}</span>
                  </p>
                )}
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Placeholder yang Tersedia:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                    <div><code className="bg-blue-100 px-1 rounded">{'{{no_hp}}'}</code> - Nomor tujuan</div>
                    <div><code className="bg-blue-100 px-1 rounded">{'{{message}}'}</code> - Isi pesan</div>
                  </div>
                </div>
              </div>

              {/* Message Template */}
              <div>
                <label htmlFor="messageTemplate" className="block text-sm font-semibold text-gray-700 mb-2">
                  💬 Template Pesan Notifikasi Pelanggan <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerWhatsApp('messageTemplate', {
                    required: 'Template pesan wajib diisi',
                    minLength: {
                      value: 20,
                      message: 'Template pesan minimal 20 karakter'
                    }
                  })}
                  rows={6}
                  placeholder={`Halo {{nama}}, pesanan Anda dengan invoice {{invoice}} saat ini berstatus "{{status}}". Estimasi selesai: {{estimasi_selesai}}.`}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none ${
                    whatsAppErrors.messageTemplate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {whatsAppErrors.messageTemplate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>❌</span>
                    <span>{whatsAppErrors.messageTemplate.message}</span>
                  </p>
                )}
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-2">📋 Placeholder yang Tersedia:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                    <div><code className="bg-green-100 px-1 rounded">{'{{nama}}'}</code> - Nama pelanggan</div>
                    <div><code className="bg-green-100 px-1 rounded">{'{{invoice}}'}</code> - Nomor invoice</div>
                    <div><code className="bg-green-100 px-1 rounded">{'{{status}}'}</code> - Status pesanan</div>
                    <div><code className="bg-green-100 px-1 rounded">{'{{estimasi_selesai}}'}</code> - Estimasi selesai</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Simpan Konfigurasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            {/* Backup Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>📤</span>
                  <span>Backup Data</span>
                </h3>
                <p className="text-gray-600">Unduh backup seluruh data sistem dalam format SQL</p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <h4 className="font-semibold text-blue-800">Backup Terakhir</h4>
                      <p className="text-blue-700">
                        {lastBackup.lastBackupDate} pukul {lastBackup.lastBackupTime}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {isBackingUp ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Membuat Backup...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Download Backup</span>
                    </>
                  )}
                </button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-500 text-xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Informasi Backup</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Backup mencakup semua data: pelanggan, pesanan, pegawai, pengeluaran</li>
                        <li>• File backup dalam format SQL yang kompatibel</li>
                        <li>• Disarankan melakukan backup secara berkala</li>
                        <li>• Simpan file backup di tempat yang aman</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Restore Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>📥</span>
                  <span>Restore Data</span>
                </h3>
                <p className="text-gray-600">Upload dan restore data dari file backup</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="backup-file" className="block text-sm font-semibold text-gray-700 mb-2">
                    📁 Upload File Backup (.sql)
                  </label>
                  <input
                    id="backup-file"
                    type="file"
                    accept=".sql,.json"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format yang didukung: .sql, .json (maksimal 50MB)
                  </p>
                </div>

                {backupFile && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">📄</span>
                      <div>
                        <h4 className="font-semibold text-green-800">File Terpilih</h4>
                        <p className="text-green-700 text-sm">{backupFile.name}</p>
                        <p className="text-green-600 text-xs">
                          Ukuran: {(backupFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!showRestoreConfirm ? (
                  <button
                    onClick={() => setShowRestoreConfirm(true)}
                    disabled={!backupFile || isRestoring}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
                  >
                    <span>📥</span>
                    <span>Upload & Restore</span>
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">Konfirmasi Restore</h4>
                        <p className="text-red-700 text-sm mb-3">
                          Proses restore akan menimpa semua data yang ada di sistem. 
                          Data yang sudah ada akan hilang dan diganti dengan data dari backup.
                        </p>
                        <p className="text-red-600 text-sm font-medium">
                          Apakah Anda yakin ingin melanjutkan?
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowRestoreConfirm(false)}
                        disabled={isRestoring}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        {isRestoring ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Restoring...</span>
                          </>
                        ) : (
                          <>
                            <span>⚠️</span>
                            <span>Ya, Restore Data</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">Peringatan Penting</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Proses restore akan menimpa semua data yang ada</li>
                        <li>• Pastikan file backup valid dan tidak corrupt</li>
                        <li>• Disarankan membuat backup terlebih dahulu sebelum restore</li>
                        <li>• Proses restore tidak dapat dibatalkan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}