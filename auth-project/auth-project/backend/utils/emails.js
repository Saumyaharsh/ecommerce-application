import { mailtrapclient, sender } from "../config/mailtrap.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailtemplate.js";

export const sendverificationemail = async (email, verificationtoken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationtoken,
      ),
      category: "Email verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    throw new Error(error);
  }
};

export const sendwelcomeemail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      template_uuid: "725167b2-ff72-4590-909b-8474a560a89d",
      template_variables: {
        company_info_name: "Auth Company",
        John: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    throw new Error(error);
  }
};

export const sendpasswordresetemail = async (email, reseturl) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", reseturl),
      category: "password reset",
    });
    console.log("Resend email sent successfully", response);
  } catch (error) {
    throw new Error(error);
  }
};

export const sendresetsuccessemail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "password reset success",
    });
    console.log("Reset password success email sent", response);
  } catch (error) {
    throw new Error(error);
  }
};
