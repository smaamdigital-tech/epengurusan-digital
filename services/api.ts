
// Konfigurasi Endpoint - Masukkan URL Web App Google Script anda di sini
// Contoh: https://script.google.com/macros/s/AKfycbx.../exec
export const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx_YOUR_SCRIPT_ID_HERE/exec"; 

export const apiService = {
  // Fungsi Membaca: Hybrid (Local Storage First, then Network if needed, but keeping simple for now)
  // Untuk demo ini, kita utamakan LocalStorage untuk kepantasan, 
  // tetapi kod struktur bersedia untuk fetch.
  read: async (key: string) => {
    try {
      const localData = localStorage.getItem(key);
      // Jika URL ada, boleh cuba fetch background (optional implementation)
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error(`Ralat membaca data tempatan (${key}):`, error);
      return null;
    }
  },

  // Fungsi Menyimpan: Local Storage + Google Sheet (Background)
  write: async (key: string, data: any) => {
    try {
      // 1. Simpan Local
      localStorage.setItem(key, JSON.stringify(data));
      
      // 2. Simpan Cloud (Jika URL diset)
      if (GOOGLE_SHEET_URL && !GOOGLE_SHEET_URL.includes("PLACEHOLDER")) {
          // Fire and forget, or await if critical
          fetch(GOOGLE_SHEET_URL, {
              method: 'POST',
              mode: 'no-cors', // Google Script Web App limitation usually requires no-cors or redirect handling
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'write', key, data })
          }).catch(err => console.warn("Cloud sync failed:", err));
      }
      
      return true;
    } catch (error) {
      console.error(`Ralat menyimpan data (${key}):`, error);
      return false; 
    }
  },

  // NEW: Fungsi Khas untuk Kosongkan Data di Cloud
  clearData: async (key: string) => {
    try {
        // 1. Clear Local
        localStorage.removeItem(key); // Or set to empty array depending on preference
        
        // 2. Clear Cloud
        if (GOOGLE_SHEET_URL && !GOOGLE_SHEET_URL.includes("PLACEHOLDER")) {
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'clearOrganisasi', key })
            });
        }
        return true;
    } catch (error) {
        console.error(`Ralat mengosongkan data (${key}):`, error);
        return false;
    }
  }
};
