const { handleHistory } = require("../utils/handleHistory");

/**
 * Su funcion es almacenar en el state todos los mensajes que el usuario escriba
 */
module.exports = async function({ body }, { state }) {
    await handleHistory({ content: body, role: 'user' }, state);
};
