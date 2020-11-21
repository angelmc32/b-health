exports.registerEmailParams = (email, token) => {

  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 
            `<html>
              <h1>Bienvenido a Archivo Salud</h1>
              <h3>Verifica tu dirección de correo electrónico</h3>
              <p>Por favor utiliza la siguiente liga para verificar tu correo, ¡y así podrás utilizar la plataforma!</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 24px;" bgcolor="#4F39BF">
                          <a
                            href=${process.env.CLIENT_URL}/activate/${token}
                            target="_blank"
                            style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none;border-radius: 24px; padding: 12px 18px; border: 1px solid #4F39BF; display: inline-block;"
                            >Ir a activar mi cuenta &rarr;</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Completa tu registro a Archivo Salud'
      }
    }
  }

}

exports.resetPasswordEmailParams = (email, token) => {

  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 
            `<html>
              <h1>Restablecer Contraseña - Archivo Salud</h1>
              <p>Este mensaje es en respuesta a tu solicitud de restablecer una contraseña olvidada. Para restablecerla, da clic en el siguiente vínculo y sigue las instrucciones proporcionadas.</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 24px;" bgcolor="#4F39BF">
                          <a
                            href=${process.env.CLIENT_URL}/restablecer/${token}
                            target="_blank"
                            style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none;border-radius: 24px; padding: 12px 18px; border: 1px solid #4F39BF; display: inline-block;"
                            >Restablecer mi contraseña &rarr;</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color: #FF0000">Si no solicitó ayuda para restablecer su contraseña, ignore este mensaje.</p>
            </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Archivo Salud - Reestablecer contraseña'
      }
    }
  }

}