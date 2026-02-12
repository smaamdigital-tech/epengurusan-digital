
// Konfigurasi Endpoint Google Apps Script
// Sila gantikan URL di bawah dengan URL Web App Google Apps Script anda
export const GOOGLE_SHEET_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

export const apiService = {
  // Fungsi untuk membaca data dari Google Sheet
  read: async (key: string) => {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("PASTE_YOUR")) {
      console.warn("API URL belum ditetapkan. Menggunakan LocalStorage sahaja.");
      return null;
    }
    
    try {
      const response = await fetch(`${GOOGLE_SHEET_URL}?action=read&key=${key}`, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error(`Gagal membaca data (${key}):`, error);
      return null;
    }
  },

  // Fungsi untuk menyimpan data ke Google Sheet
  write: async (key: string, data: any) => {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("PASTE_YOUR")) return;

    try {
      // Menggunakan no-cors atau text/plain untuk mengelakkan isu CORS preflight dengan GAS
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ action: "write", key, data }),
      });
      console.log(`Data (${key}) berjaya dihantar ke Google Sheet.`);
    } catch (error) {
      console.error(`Gagal menyimpan data (${key}):`, error);
      // Fallback: Data masih tersimpan di LocalStorage/State aplikasi
    }
  }
};
