
/**
 * SISTEM PENGURUSAN DIGITAL SMAAM - BACKEND API V2.5
 * Updated: Support 'PERANAN' in Jawatankuasa & Clear Function
 */

const COLUMN_MAP = {
  // --- DATA MURID ---
  'id': 'ID',
  'name': 'Nama Murid',
  'kp': 'No. KP',
  'status': 'Status Kediaman',
  'className': 'Kelas',
  
  // --- JAWATANKUASA (AJK) ---
  'unitName': 'NAMA UNIT',       // Kolum Kiri (Grouping Key)
  'role': 'PERANAN',             // NEW: Baris 1 (e.g., Pengurusan/AJK Tertinggi)
  'position': 'JAWATAN',         // Baris 2 (e.g., Pengerusi)
  'teacherName': 'NAMA GURU',    // Baris 3 (e.g., Nama Cikgu)
  'task': 'BIDANG TUGAS',        // Kolum Kanan (Tugas)
  'committeeId': 'COMMITTEE_ID', // ID untuk grouping
  
  // --- PENGURUSAN KELAS ---
  'form': 'TINGKATAN',       
  'class': 'NAMA KELAS',     
  'teacher': 'NAMA GURU KELAS', 
  
  // --- PENYELARAS TINGKATAN ---
  // 'form' shared
  // 'name' handled manually in readData for PENYELARAS_TINGKATAN
  
  // --- TAKWIM & LAIN-LAIN ---
  'week': 'MINGGU',
  'date': 'TARIKH',
  'program': 'PROGRAM',
  'activity': 'AKTIVITI',
  'event': 'NAMA PROGRAM/AKTIVITI',
  'month': 'BULAN',
  'notes': 'CATATAN',
  'unit': 'UNIT', // For Koko Assembly
  'dalaman': 'PEPERIKSAAN DALAMAN',
  'jaj': 'PEPERIKSAAN JAJ',
  'awam': 'PEPERIKSAAN AWAM'
};

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  // Tunggu sehingga 30 saat untuk mendapatkan lock
  const successLock = lock.tryLock(30000); 

  if (!successLock) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Server busy. Please try again.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let action = e.parameter.action;
    let key = e.parameter.key;
    let data = null;

    if (e.postData && e.postData.contents) {
      const body = JSON.parse(e.postData.contents);
      if (body.action) action = body.action;
      if (body.key) key = body.key;
      if (body.data) data = body.data;
    }

    if (!key) throw new Error("Tiada 'key' diberikan.");
    const sheet = getOrCreateSheet(key);

    let result;
    if (action === 'read') {
      result = readData(sheet);
    } else if (action === 'write') {
      result = writeData(sheet, data);
    } else if (action === 'clearOrganisasi') {
      // NEW: Clear functionality keeping header
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        // Clear from Row 2 to Last Row, and all columns
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      }
      result = { success: true, message: "Data berjaya dikosongkan." };
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function readData(sheet) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  const headers = rows[0];
  const data = [];
  const reverseMap = {};
  const sheetName = sheet.getName();
  
  // Build Reverse Map
  for (let key in COLUMN_MAP) {
    reverseMap[COLUMN_MAP[key]] = key;
  }

  // Custom Mapping for Penyelaras
  if (sheetName === 'PENYELARAS_TINGKATAN') {
    reverseMap['NAMA PENYELARAS'] = 'name';
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    let hasData = false;

    for (let j = 0; j < headers.length; j++) {
      const headerName = headers[j];
      const cellValue = row[j];
      const keyName = reverseMap[headerName] || headerName;
      
      obj[keyName] = cellValue;
      if (cellValue !== "") hasData = true;
    }

    // Special handling for Data Murid
    if (sheetName === 'DATA_MURID') {
       const cleanObj = { id: obj.id, name: obj.name, kp: obj.kp, status: obj.status, className: obj.className, dynamicData: {} };
       for (let k in obj) {
         if (!['id','name','kp','status','className'].includes(k)) cleanObj.dynamicData[k] = obj[k];
       }
       if (hasData) data.push(cleanObj);
    } else {
       if (hasData) data.push(obj);
    }
  }
  return data;
}

function writeData(sheet, data) {
  // If data is empty array, clear the sheet except header
  if (!Array.isArray(data) || data.length === 0) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    return "Data dikosongkan.";
  }

  const flattenedData = data.map(item => {
    let flatItem = { ...item };
    if (item.dynamicData) {
      for (let key in item.dynamicData) flatItem[key] = item.dynamicData[key];
      delete flatItem.dynamicData;
    }
    return flatItem;
  });

  let headersSet = new Set();
  // Ensure critical keys are present for header generation
  const priorityKeys = ['id', 'unitName', 'role', 'position', 'teacherName', 'task', 'form', 'class', 'name', 'committeeId'];
  
  priorityKeys.forEach(k => {
      if(flattenedData.some(d => d.hasOwnProperty(k))) headersSet.add(k);
  });

  flattenedData.forEach(row => Object.keys(row).forEach(k => headersSet.add(k)));
  const keys = Array.from(headersSet);
  
  // Header Mapping Output
  const sheetName = sheet.getName();
  const displayHeaders = keys.map(k => {
      if (sheetName === 'PENYELARAS_TINGKATAN' && k === 'name') return 'NAMA PENYELARAS';
      return COLUMN_MAP[k] || k;
  });

  const sheetValues = [displayHeaders];
  flattenedData.forEach(item => {
    const row = keys.map(k => (item[k] === null || item[k] === undefined) ? "" : item[k]);
    sheetValues.push(row);
  });

  sheet.clear();
  if (sheetValues.length > 0) {
    sheet.getRange(1, 1, sheetValues.length, sheetValues[0].length).setValues(sheetValues);
    sheet.getRange(1, 1, 1, sheetValues[0].length).setFontWeight("bold").setBackground("#C9B458");
  }
  return "Data disimpan.";
}

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}
