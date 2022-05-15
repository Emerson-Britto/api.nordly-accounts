import Mail from './index';
import { MailData, LoginInfor } from '../common/interfaces';

function mailText(data:LoginInfor) {
  return`
  By: Nordly - Account Center
  Mail: ${data.mail}
  login confirmation
  `
}

function mailHtml(data:LoginInfor, code:string) {
  return`
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

    #confirmation_illustration {
      width: 260px;
      margin: 50px 0;
    }

    .actions_section {
      margin: 50px 0;
    }

    .actions_btn {
      border: none;
      padding: 5px 10px;
      margin: 0 5px;
      background-color: #29294F;
      font-size: 1.3em;
      transition: 400ms;
      cursor: pointer;
    }

    .actions_btn:hover {
      background-color: #1D1C36;
    }
  </style>
  <title>Nordly</title>
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
      style="width: 50%;"
      src="https://cdn-istatics.herokuapp.com/static/imgs/branding/nordly_branding_title.png"
      alt="Nordly Branding"
    />
    <hr style="opacity: 30%; width: 80%; margin: 0 auto;" />

    <section style="text-align: center; color: #fff; font-family: sans-serif;">
      <img
        id="confirmation_illustration"
        src="https://cdn-istatics.herokuapp.com/static/imgs/illustrations/undraw_confirm_re_69me.svg"
        alt="sendMail_icon"
      />
      <p>IP: ${data.ip}</p>
      <p>DATE: ${data.date}</p>
      <p>TIME: ${data.time}</p>
      <p>LOCATION: ${data.location}</p>
      <p>ISP: ${data.ISP}</p>
      <p>HOSTNAME: ${data.hostname}</p>
      <p>OS: ${data.os}</p>
      <div class="actions_section">
        <a href="#">
          <button class="actions_btn">Yes, authorize</button>
        </a>
        <a href="#">
          <button class="actions_btn">No, deny</button>
        </a>
      </div>
    </section>
  </section>
</body>
</html>
`
}

class VerificationMail extends Mail {
  constructor(data:LoginInfor, code:string) {
    super({
      from: '"Nordly Center" <noreply@nordly.com>',
      to: data.mail,
      subject: 'Verification Mail',
      text: mailText(data),
      html: mailHtml(data, code)   
    });
  }
}

export { VerificationMail };
