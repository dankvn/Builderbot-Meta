const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.readonly",
];

class GoogleSheetService {
  constructor(id) {
    if (!id) {
      throw new Error("ID_UNDEFINED");
    }

    this.jwtFromEnv = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });

    this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
  }

  /**
   * @param {string} telefono
   * @returns {Promise<{Nombre: string, Número_de_teléfono: string, Correo: string, Fecha_de_registro: string} | null>}
   */
  async validatePhoneNumber(telefono) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[1]; // La hoja que contiene los datos del catálogo
      await sheet.loadCells("A1:H10");
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Número_de_teléfono") === telefono) 
        .map((row) => ({
          Nombre: row.get("Nombre"),
          Número_de_teléfono: row.get("Número_de_teléfono"),
          Correo: row.get("Correo"),
          Fecha_de_registro: row.get("Fecha_de_registro"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = GoogleSheetService;