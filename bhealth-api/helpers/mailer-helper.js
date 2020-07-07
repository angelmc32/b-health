const nodemailer = require('nodemailer');
const pug = require('pug');
const fs = require('fs');

const transporter = nodemailer.createTransport(
  {
    service: 'Sendgrid',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  }
);

const generateHTML = (filename, options) => {

  const html = pug.compileFile(`${__dirname}/../views/mails/${filename}.pug`);
  
  return html(options);

};

exports.send = (options) => {

  const html = `
    <html>
      <h1>Bienvenido a Beesalud</h1>
      <h3>Verifica tu dirección de correo electrónico</h3>
      <p>Por favor utiliza la siguiente liga para verificar tu correo, ¡y así podrás utilizar la plataforma!</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 24px;" bgcolor="#4F39BF">
                  <a
                    href=${process.env.CLIENT_URL}/activate/${options.token}
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
    </html>
  `
  const plainText = `
    Bienvenido a Beesalud

    Verifica tu dirección de correo electrónico
    Por favor utiliza la siguiente liga para verificar tu correo, ¡y así podrás utilizar la plataforma!
    
    ${process.env.CLIENT_URL}/activate/${options.token}
  `

  const mailOptions = {
    from: 'Equipo de Beesalud <noreply@beesalud.com',
    to: options.email,
    subject: options.subject,
    text: plainText,
    html
  };

  return transporter.sendMail(mailOptions);

}

exports.sendResetPassword = (options) => {

  const html = `
    <html>
      <h1>Restablecer Contraseña - Beesalud</h1>
      <p>Este mensaje es en respuesta a tu solicitud de restablecer una contraseña olvidada. Para restablecerla, da clic en el siguiente vínculo y sigue las instrucciones proporcionadas.</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 24px;" bgcolor="#4F39BF">
                  <a
                    href=${process.env.CLIENT_URL}/restablecer/${options.token}
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
    </html>
  `
  const plainText = `
    Restablecer Contraseña - Beesalud

    Este mensaje es en respuesta a tu solicitud de restablecer una contraseña olvidada. Para restablecerla, da clic en el siguiente vínculo y sigue las instrucciones proporcionadas.
    
    ${process.env.CLIENT_URL}/restablecer/${options.token}
  `

  const mailOptions = {
    from: 'Equipo de Beesalud <noreply@beesalud.com',
    to: options.email,
    subject: options.subject,
    text: plainText,
    html
  };

  return transporter.sendMail(mailOptions);

}