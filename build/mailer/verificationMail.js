"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationMail = void 0;
const index_1 = __importDefault(require("./index"));
function mailText(data) {
    return `
  By: Nordly - Account Center
  Mail: ${data.mail}
  login confirmation
  `;
}
function mailHtml(data, code) {
    return `
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Padauk&display=swap" rel="stylesheet">
  <style>
    html {
      background-color: #000;
    }

    * {
      margin: 0;
      padding: 0;
      color: #fff;
    }

    #confirmation_illustration {
      width: 280px;
      filter: invert(100%);
      margin: 30px 0 50px 0;
    }

    .infors {
      margin: 4px 0;
    }

    .actions_section {
      margin: 50px 0;
    }

    .actions_btn {
      border: none;
      padding: 5px 10px;
      margin: 0 10px;
      background-color: transparent;
      border: 3px solid #A4EFA9;
      color: #A4EFA9;
      border-radius: 6px;
      font-size: 1.3em;
      transition: 300ms;
      cursor: pointer;
    }

    #deny_btn {
      border: 3px solid #FF9E9F;
      background-color: transparent;
      color: #FF9E9F;
    }
    #deny_btn:hover {
      background-color: #FF8278;
      color: #000;
    }

    .actions_btn:hover {
      color: #000;
      background-color: #7FEF89;
    }
  </style>
  <title>Nordly</title>
</head>
<body>
  <section
    style="
      text-align: center;
      width: 90%;
      margin: 0 auto;
      height: 80%;
    ">
    <img
      style="width: 35%;"
      src="https://cdn-istatics.herokuapp.com/static/imgs/branding/nordly_branding_title.png"
      alt="Nordly Branding"
    />
    <hr style="opacity: 30%; width: 80%; margin: 0 auto;" />

    <section style="text-align: center; color: #fff; font-family: sans-serif;">
      <img
        id="confirmation_illustration"
        src="https://cdn-istatics.herokuapp.com/static/imgs/illustrations/undraw_Confirm_re_69me.png"
        alt="sendMail_icon"
      />
      <p class="infors">IP: ${data.ip}</p>
      <p class="infors">DATE: ${data.date}</p>
      <p class="infors">TIME: ${data.time}</p>
      <p class="infors">LOCATION: ${data.location}</p>
      <p class="infors">ISP: ${data.ISP}</p>
      <p class="infors">HOSTNAME: ${data.hostname}</p>
      <p class="infors">OS: ${data.os}</p>
      <div class="actions_section">
        <a href="http://localhost:7050/authorization/${code}?mail=${data.mail}&authorized=allow">
          <button class="actions_btn">Yes, authorize</button>
        </a>
        <a href="http://localhost:7050/authorization/${code}?mail=${data.mail}&authorized=deny">
          <button id="deny_btn" class="actions_btn">No, deny</button>
        </a>
      </div>
    </section>
  </section>
</body>
</html>
`;
}
class VerificationMail extends index_1.default {
    constructor(data, code) {
        super({
            from: '"Nordly Center" <nordly.team@nordly.com>',
            to: data.mail,
            subject: 'Verification Mail',
            text: mailText(data),
            html: mailHtml(data, code)
        });
    }
}
exports.VerificationMail = VerificationMail;
