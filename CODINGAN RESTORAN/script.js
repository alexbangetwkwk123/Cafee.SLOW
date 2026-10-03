/**
 * RESTORAN KENANGAN INDAH - BACKEND ENGINE
 */

const SPREADSHEET_ID = "GANTI_DENGAN_ID_SPREADSHEET_ANDA";

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Restoran Kenangan Indah | Fine Dining & Culinary Experience')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Memproses reservasi meja & menyimpan ke Google Sheets
 */
function processReservation(formObject) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName("Reservasi");

    if (!sheet) {
      sheet = ss.insertSheet("Reservasi");
      sheet.appendRow(["ID Reservasi", "Waktu Input", "Nama Pelanggan", "WhatsApp", "Tanggal", "Jam", "Jumlah Tamu", "Area Meja", "Permintaan Khusus"]);
      sheet.getRange("A1:I1").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#d4af37");
    }

    const reservationId = "RES-" + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date();

    sheet.appendRow([
      reservationId,
      timestamp,
      formObject.nama,
      formObject.whatsapp,
      formObject.tanggal,
      formObject.jam,
      formObject.jumlahTamu,
      formObject.area,
      formObject.catatan || "-"
    ]);

    return {
      success: true,
      reservationId: reservationId,
      message: `Terima kasih Bapak/Ibu ${formObject.nama}. Reservasi eksklusif Anda (${reservationId}) berhasil dicatat.`
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi hambatan sistem: " + error.message
    };
  }
}

/**
 * Memproses pesanan makanan & menyimpan ke Google Sheets
 */
function processOrder(orderData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName("Pesanan");

    if (!sheet) {
      sheet = ss.insertSheet("Pesanan");
      sheet.appendRow(["ID Pesanan", "Waktu Order", "Nama Pelanggan", "WhatsApp", "Layanan", "Rincian Menu", "Subtotal", "Pajak", "Total Akhir", "Metode Bayar", "Status"]);
      sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#d4af37");
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date();
    const detailItems = orderData.items.map(i => `${i.name} x${i.qty}`).join(", ");

    sheet.appendRow([
      orderId,
      timestamp,
      orderData.nama,
      orderData.whatsapp,
      orderData.tipe,
      detailItems,
      orderData.subtotal,
      orderData.tax,
      orderData.total,
      orderData.pembayaran,
      "Menunggu Pembayaran"
    ]);

    return {
      success: true,
      orderId: orderId,
      message: `Pesanan (${orderId}) berhasil diteruskan ke dapur utama kami.`
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memproses pesanan: " + error.message
    };
  }
}