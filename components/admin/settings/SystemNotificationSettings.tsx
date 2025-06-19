'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
  bodyTemplate: string;
  messageTemplate: string;
}

export default function SystemNotificationSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
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
  );
}