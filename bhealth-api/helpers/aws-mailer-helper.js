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
              <h1>Bienvenido a Beesalud</h1>
              <h3>Verifica tu dirección de correo electrónico</h3>
              <p>Por favor utiliza la siguiente liga para verificar tu correo, ¡y así podrás utilizar la plataforma!</p>
              <p>${process.env.CLIENT_URL}/activate/${token}</p>
            </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Completa tu registro a Beesalud'
      }
    }
  }

}