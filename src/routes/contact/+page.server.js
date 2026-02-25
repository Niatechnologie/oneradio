

import { json } from '@sveltejs/kit';
import { RECAPTCHA_SECRET } from './recaptcha.js';
import nodemailer from 'nodemailer';


export async function POST({ request }) {
    const data = await request.json();
    const captcha = data.captcha;
    if (!captcha) {
        return json({ success: false, message: 'Captcha manquant.' }, { status: 400 });
    }
    // Vérification du captcha côté serveur
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captcha}`;
    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaJson = await captchaRes.json();
    if (!captchaJson.success) {
        return json({ success: false, message: 'Échec de la vérification du captcha.' }, { status: 400 });
    }
    // Récupération des champs du formulaire
    const { name, email, subject, message, phone } = data;
    if (!name || !email || !subject || !message) {
        return json({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return json({ success: false, message: 'Adresse email invalide.' }, { status: 400 });
    }

    // Configuration du transporteur SMTP (adapté de la config PHP)
    const transporter = nodemailer.createTransport({
        host: 'mail.oneradio.ci',
        port: 465,
        secure: true,
        auth: {
            user: 'contact@oneradio.ci',
            pass: '@@Cnt20192**'
        }
    });

    // Email principal (vers OneRadio)
    const mailOptions = {
        from: 'contact@oneradio.ci',
        to: 'contact@oneradio.ci',
        replyTo: `${email}`,
        subject: `[Contact Oneradio] ${subject}`,
        html: `<html><body style='font-family:Arial,sans-serif;background:#f8f9fa;'>
            <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(45,102,86,0.10);padding:32px;'>
                <h2 style='color:#2d6656;margin-top:0;'>Nouveau message de contact</h2>
                <div style='margin-bottom:18px;'>
                    <span style='font-weight:700;color:#2d6656;'>Nom :</span> ${name}<br>
                    <span style='font-weight:700;color:#2d6656;'>Email :</span> ${email}<br>
                    <span style='font-weight:700;color:#2d6656;'>Téléphone :</span> ${phone || ''}<br>
                    <span style='font-weight:700;color:#2d6656;'>Sujet :</span> ${subject}
                </div>
                <div style='background:#f2f6f5;padding:18px;border-radius:8px;color:#333;'>
                    <strong style='color:#ff6b35;'>Message :</strong><br>
                    <div style='white-space:pre-line;'>${message}</div>
                </div>
                <div style='margin-top:32px;color:#888;font-size:0.95em;text-align:center;'>
                    Oneradio<br>
                    <span style='font-size:0.9em;'>Envoyé le ${(new Date()).toLocaleString('fr-FR')}</span>
                </div>
            </div>
        </body></html>`,
        text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || ''}\nSujet: ${subject}\n\n${message}`
    };

    // Email de confirmation au client
    const mailClientOptions = {
        from: 'contact@oneradio.ci',
        to: email,
        subject: 'Confirmation de votre message - Oneradio',
        html: `<html><body style='font-family:Arial,sans-serif;'>
            <div style='max-width:600px;margin:0 auto;padding:30px;background:#f8f9fa;border-radius:10px;'>
            <h2 style='color:#2d6656;'>Merci pour votre message !</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous avons bien reçu votre message concernant : <strong>${subject}</strong>.</p>
            <p>Notre équipe vous contactera dans les plus brefs délais.<br>Pour toute question urgente, contactez-nous à <a href='mailto:contact@oneradio.ci'>contact@oneradio.ci</a>.</p>
            <hr style='margin:30px 0;'>
            <p style='color:#888;font-size:0.95em;'>Oneradio </p>
            </div></body></html>`,
        text: `Merci pour votre message ! Nous avons bien reçu votre demande concernant : ${subject}. Notre équipe vous contactera dans les plus brefs délais.`
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailClientOptions);
        return json({ success: true, message: 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.' });
    } catch (error) {
        return json({ success: false, message: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.", error: error.message });
    }
}
