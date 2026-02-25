
import { json } from '@sveltejs/kit';
import { RECAPTCHA_SECRET } from './recaptcha.js';


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
    // TODO: Traiter les données du formulaire (ex: envoyer un email)
    return json({ success: true, message: 'Message reçu !' });
}
