import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
"https://www.googleapis.com/auth/drive.readonly",
];

class GoogleSheetService {
  jwtFromEnv = undefined;
  doc = undefined;

  constructor(id = undefined) {
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
   * @param {*} telefono
   * @returns
   */
  // Agrega un método para mostrar resultados del catálogo basado en el código de destino
  async validatePhoneNumber(telefono) {
    try {
      telefono = telefono.replace(/\s/g, '').replace(/[-()]/g, '');
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[1]; // La hoja que contiene los datos del catálogo
      await sheet.loadCells("B:B"); // Carga solo las celdas de la columna con los números de teléfono
      const lastRow = sheet.rowCount;

      for (let i = 0; i < lastRow; i++) {
          const cell = sheet.getCell(i, 0); // Accede a la celda en la columna de números de teléfono
          if (cell.value === telefono) { // Compara el valor de la celda con el número de teléfono buscado
              // Si se encuentra el número de teléfono, retorna verdadero
              return true;
          }
      }

      // Si el número de teléfono no se encuentra en ninguna celda, retorna falso
      return false;
  } catch (err) {
      console.log(err);
      return false; // En caso de error, retorna falso
  }
  }

 /**
   * Recuperar el menu del dia
   * @param {*} dayNumber
   * @returns
   */
retrieveColumnData = async (columnIndex = 0) => {
  try {
    const list = [];
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[0]; // the first sheet
    await sheet.loadCells("A1:H10");
    const rows = await sheet.getRows();
    for (const a of Array.from(Array(rows.length).keys())) {
      // Obtiene la celda en la fila actual y la columna especificada
      const cellA1 = sheet.getCell(a + 1, columnIndex);
      list.push(cellA1.value);
    }

    return list;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};



}

export default GoogleSheetService;