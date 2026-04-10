// lib/email.ts - Email utilities
import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string = "http://localhost:3000") {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${baseUrl}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@sextadoempreendedor.com",
    to: email,
    subject: "Redefinir Senha - Sexta do Empreendedor",
    html: `
      <h1>Redefinir sua senha</h1>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}">Redefinir Senha</a>
      <p>Este link expira em 1 hora.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

