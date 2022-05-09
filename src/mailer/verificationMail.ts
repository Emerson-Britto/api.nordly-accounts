import Mail from './index.js';

function mailText({ mail, code }) {
  return`
  By: inifity - account center
  Mail: ${ mail }
  Verification Code: ${ code }
  `
}

function mailHtml({ mail, code }) {
  return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Padauk&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      color: #fff;
    }
  </style>
  <title>INFINITY</title>
</head>
<body
  style="
    background-color: #000;
  "
>
  <section
    style="
      text-align: center;
      width: 90vw;
      margin: 0 auto;
      height: 80vh;
    ">
    <img
      style="width: 70%;"
      src="https://cdn-istatics.herokuapp.com/static/imgs/branding/infinity-center.png"
      alt="ifinity center img"
    />
    <hr style="opacity: 30%; width: 80%; margin: 0 auto;" />

    <section style="text-align: center; color: #fff; font-family: sans-serif;">

      <img
        style="width: 160px; margin: 20px 0;"
        src="https://cdn-istatics.herokuapp.com/static/imgs/repository/sendMail.png"
        alt="sendMail_icon"
      />
      <h2 style="margin: 30px 0 50px 0;">Verification Code</h2>
      <p>Mail: ${mail}</p>
      <p style="font-size: 1.2em; margin: 10px 0;"><strong>Code: ${code}</strong></p>
    </section>
  </section>
</body>
</html>
  `
}

class VerificationMail extends Mail {
  constructor({ mail, code }) {
    super();
    this.from = '"Infinity Center" <noreply@inifity.com>';
    this.to = mail;
    this.subject = 'Verification Mail';
    this.text = mailText({ mail, code });
    this.html = mailHtml({ mail, code });
  }
}

export { VerificationMail };