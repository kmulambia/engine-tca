
import * as SERVICE from '../services.config.json';
import mailer from '../services/mailer.service';

const support = SERVICE.MAILER.EMAIL;
const from = SERVICE.MAILER.FROM;



export function welcomeEmail(model: any) {
  var email = {
    recipient: model.email,
    subject: 'Welcome',
    body: `
    <p style="text-transform: capitalize;">Dear ${model.name} ,</p>
    <p><strong>Welcome to ${from}</strong></p>
    <p>Your log in details:<br /><br />Email Address:<strong> ${model.email} </strong><br />Password:<strong>${model.password}</strong><br /><br /></p>
    <p><strong>Regards,</strong></p>
    <p><strong>&nbsp;</strong></p>
    <p><strong>${support}</strong></p>`
  };
  mailer.send(JSON.stringify(email));
}

export function passwordResetEmail(model: any) {
  var email = {
    recipient: model.email,
    subject: 'Password Reset Email',
    body: `
      <p style="text-transform: capitalize;">Dear ${model.name} ,</p>
      <p><strong>Password Reset Email<br /></strong></p>
      <p>We received a request to reset the password for your account with</p>
      <p>Email Address:<strong> ${model.email} </strong></p>
      <p>&nbsp;</p>
      <p>To reset your password enter the code below</p>
      <p>Code :<strong>${model.token}</strong><br /><br /></p>
      <p><strong>Regards,</strong></p>
      <p><strong>&nbsp;</strong></p>
      <p><strong>${from}</strong></p>`
  };
  mailer.send(JSON.stringify(email));
}

export function accountRecoveryEmail(model: any) {
  var email = {
    recipient: model.email,
    subject: 'Account Recovery Email',
    body: `
    <p style="text-transform: capitalize;">Dear ${model.name} ,</p>
    <p><strong>Your account has been recovered by System Admin</strong></p>
    <p>Find your new log in details:<br /><br />Email Address:<strong> ${model.email} </strong><br />Password:<strong>${model.password}</strong><br /><br /></p>
    <p><strong>Regards,</strong></p>
    <p><strong>&nbsp;</strong></p>
    <p><strong>${from}</strong></p>`
  };
  mailer.send(JSON.stringify(email));
}



