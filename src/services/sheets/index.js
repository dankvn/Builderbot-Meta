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
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[1]; // La hoja que contiene los datos del catálogo
      await sheet.loadCells("A1:H10");
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Número_de_teléfono") === telefono) 
        .map((row) => ({
          Nombre: row.get("Nombre"),
          Número_de_teléfono: row.get("Número_de_teléfono"),
          Email: row.get("Email"),
          Fecha_de_registro: row.get("Fecha_de_registro"),
          
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return undefined; // Cambiamos 'null' a null
    }
  }

// Agrega registros
  async guardarDatosUsuario(nombre, email, telefono)  {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[1]; // Ajusta el índice de la hoja según tu configuración
      const fechaActual = new Date().toLocaleDateString(); // Obtener la fecha actual

      
      await sheet.addRow({ Nombre: nombre, Número_de_teléfono: telefono, Email: email, Fecha_de_registro: fechaActual }); // Ajusta los nombres de las columnas según tu hoja
      
      console.log('Datos del usuario guardados correctamente en Google Sheets');
    } catch (error) {
      console.error('Error al guardar los datos del usuario en Google Sheets:', error);
    }
  }





}

export default GoogleSheetService;