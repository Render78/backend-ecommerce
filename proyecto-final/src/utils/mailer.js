import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import logger from './logger.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `http://localhost:8080/reset-password/${token}`;
    logger.debug(`Generando enlace de restablecimiento: ${resetLink}`);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <h2>Solicitud para restablecer la contraseña</h2>
            <p>Haga clic en el botón de abajo para restablecer su contraseña:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Restablecer Contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
        `
    };

    try {
        logger.debug(`Enviando correo a ${email} con token ${token}`);
        await transporter.sendMail(mailOptions);
        logger.info(`Correo de restablecimiento enviado a ${email}`);
    } catch (error) {
        logger.error(`Error al enviar correo a ${email}: ${error.message}`);
        throw error;
    }
};

export const sendAccountDeletionEmail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Eliminación de cuenta',
        html: `
            <h2>Notificación de Eliminación de Cuenta</h2>
            <p>Estimado usuario,</p>
            <p>Su cuenta ha sido eliminada debido a inactividad durante los últimos 2 días.</p>
            <p>Si considera que esto es un error, por favor contáctenos.</p>
            <p>Gracias por su comprensión.</p>
        `
    };

    try {
        logger.debug(`Enviando correo de eliminación de cuenta a ${email}`);
        await transporter.sendMail(mailOptions);
        logger.info(`Correo de eliminación de cuenta enviado a ${email}`);
    } catch (error) {
        logger.error(`Error al enviar correo a ${email}: ${error.message}`);
        throw error;
    }
};

export const sendEmail = async (email, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Correo enviado a ${email} con asunto: ${subject}`);
    } catch (error) {
        logger.error(`Error al enviar correo a ${email}: ${error.message}`);
        throw error;
    }
};