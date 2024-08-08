import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/submit-form', (req: Request, res: Response) => {
  const { username, email, phoneNumber, amount, reference, date } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Payment Verification',
    html: `
      <h1>Payment Details</h1>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Date:</strong> ${date}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Email could not be sent');
    } else {
      res.send('Email sent successfully');
    }
  });
});

app.get('/', (req: Request, res: Response) => res.send('Express on Vercel'));

app.listen(3000, () => console.log('Server ready on port 3000.'));

export default app;
