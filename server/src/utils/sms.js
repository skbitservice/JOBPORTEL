export const sendOtpSms = async ({ mobile, otp }) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, NODE_ENV } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log(`[DEV OTP] ${mobile}: ${otp}`);
    return { sent: NODE_ENV !== "production", provider: "development-log" };
  }

  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const body = new URLSearchParams({
    From: TWILIO_FROM_NUMBER,
    To: mobile,
    Body: `Your HireWave verification code is ${otp}. It expires in 10 minutes.`
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twilio SMS failed: ${text}`);
  }

  return { sent: true, provider: "twilio" };
};
