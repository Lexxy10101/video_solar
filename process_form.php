<?php
//Cod pentru pagina de contact
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];
$errors = [];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = filter_var($data['phone'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $subject = filter_var($data['subject'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message = filter_var($data['message'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $terms_accepted = isset($data['terms']) && $data['terms'] === 'on';

    if (empty($name)) {
        $errors['name'] = 'Numele este obligatoriu.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Adresa de email nu este validă.';
    }
    if (empty($subject)) {
        $errors['subject'] = 'Subiectul este obligatoriu.';
    }
    if (empty($message)) {
        $errors['message'] = 'Mesajul este obligatoriu.';
    }
    if (!empty($phone) && !preg_match('/^07[0-9]{8}$/', $phone)) {
        $errors['phone'] = 'Numărul de telefon nu este valid (ex: 07xxxxxxxx).';
    }
    // NOU: Validare pentru Termeni și Condiții
    if (!$terms_accepted) {
        $errors['terms'] = 'Trebuie să fii de acord cu Termenii și Condițiile.';
    }

    if (empty($errors)) {
        // Toate datele sunt valide. Aici poți procesa mesajul:
        // Ex: trimite un email, salvează în baza de date etc.

        $to = 'andreeaiacob@gmail.com'; // Înlocuiește cu adresa ta de email
        $email_subject = 'Mesaj nou de la formularul de contact: ' . $subject;
        $email_body = "Nume: $name\n";
        $email_body .= "Email: $email\n";
        $email_body .= "Telefon: " . ($phone ?: 'N/A') . "\n";
        $email_body .= "Mesaj:\n$message";

        $headers = "From: lexxy10101.github.io/video_solar/"; // Înlocuiește cu domeniul tău
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Exemplu de trimitere email (necesită configurare SMTP pe server)
        if (mail($to, $email_subject, $email_body, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Mulțumim! Mesajul tău a fost trimis cu succes.';
        } else {
            $response['message'] = 'A apărut o problemă la trimiterea mesajului. Te rog încearcă din nou mai târziu.';
            // Poți loga eroarea reală pentru debugging
            error_log("Eroare la trimiterea emailului: " . error_get_last()['message']);
        }

    } else {
        $response['message'] = 'Te rog corectează erorile din formular.';
        $response['errors'] = $errors;
    }
} else {
    $response['message'] = 'Metodă de cerere invalidă.';
}

echo json_encode($response);
?>