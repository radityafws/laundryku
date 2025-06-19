'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

interface BackupInfo {
  lastBackupDate: string;
  lastBackupTime: string;
}

export default function SystemBackupRestore() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Mock last backup info
  const [lastBackup] = useState<BackupInfo>({
    lastBackupDate: '20/01/2025',
    lastBackupTime: '14:30'
  });

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

  return (
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
  );
}