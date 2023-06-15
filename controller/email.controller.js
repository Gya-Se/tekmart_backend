const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
    try {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
   port: 587,
   secure: false,
   auth: {
   user: process.env.MAIL_ID,
   pass: process.env.MP,
   }, 
});
   
  let info =  await transporter.sendMail({
    from: '"Tekmart Support Team" <abc@gmail.com>',
    to: data.to,
   subject: data.subject,
   text: data.text,
   html: data.htm,
});
   
   console.log("Message sent: %s", info.messageId);

   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

   } catch (error) {
    console.log(error, "email not sent"); } 
});

 module.exports = sendEmail;