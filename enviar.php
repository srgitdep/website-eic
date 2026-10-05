<?php
// ==================== CONFIGURAÇÕES ====================
$para = "geral@eic-lda.co.mz";          // Email que recebe as mensagens
$remetente = "geral@eic-lda.co.mz";     // Remetente (tem de ser do próprio domínio)
$assunto_padrao = "Nova mensagem do site EIC, LDA";

// Função para limpar quebras de linha (evita injecção de cabeçalhos)
function limpar_linha($texto) {
    return trim(str_replace(array("\r", "\n", "%0a", "%0d"), '', $texto));
}

// ==================== PEGAR DADOS DO FORMULÁRIO ====================
$nome = isset($_POST['nome']) ? limpar_linha($_POST['nome']) : '';
$email = isset($_POST['email']) ? limpar_linha($_POST['email']) : '';
$telefone = isset($_POST['telefone']) ? limpar_linha($_POST['telefone']) : '';
$assunto = isset($_POST['assunto']) ? limpar_linha($_POST['assunto']) : 'Sem assunto definido';
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';

// ==================== VALIDAÇÃO ====================
$erros = array();

if (empty($nome) || strlen($nome) < 3) {
    $erros[] = "Nome completo é obrigatório (mínimo 3 caracteres)";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = "Email válido é obrigatório";
}

if (empty($telefone) || strlen($telefone) < 8) {
    $erros[] = "Telefone é obrigatório (mínimo 8 dígitos)";
}

if (empty($mensagem) || strlen($mensagem) < 10) {
    $erros[] = "Mensagem é obrigatória (mínimo 10 caracteres)";
}

// ==================== SE HOUVER ERROS ====================
if (!empty($erros)) {
    echo "<!DOCTYPE html>
    <html lang='pt'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Erro no Envio</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
            .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center; border-left: 5px solid #ff4444; }
            .error-box h2 { color: #ff4444; margin-top: 0; }
            .error-box ul { text-align: left; padding: 0 20px; margin: 20px 0; }
            .error-box ul li { color: #555; margin: 8px 0; }
            .error-box .btn { display: inline-block; background: #AF9C03; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; transition: background 0.3s; border: none; cursor: pointer; }
            .error-box .btn:hover { background: #8a7a02; }
        </style>
    </head>
    <body>
        <div class='error-box'>
            <h2>⚠️ Erro no Envio</h2>
            <p>Por favor, corrija os seguintes erros:</p>
            <ul>";
    foreach ($erros as $erro) {
        echo "<li>• " . htmlspecialchars($erro) . "</li>";
    }
    echo "      </ul>
            <a href='javascript:history.back()' class='btn'>← Voltar e Corrigir</a>
        </div>
    </body>
    </html>";
    exit;
}

// ==================== MONTAR EMAIL ====================
// Assunto codificado em UTF-8 (para acentos funcionarem)
$assunto_completo = "=?UTF-8?B?" . base64_encode($assunto_padrao . " - " . $assunto) . "?=";

$corpo_email = "
===========================================
       NOVA MENSAGEM DO SITE EIC, LDA
===========================================

DADOS DO CLIENTE:
------------------------------------------------
Nome:        $nome
Email:       $email
Telefone:    $telefone
Assunto:     $assunto

MENSAGEM:
------------------------------------------------
$mensagem

===========================================
Enviado através do formulário de contacto
Data: " . date('d/m/Y H:i:s') . "
IP: " . $_SERVER['REMOTE_ADDR'] . "
===========================================
";

// ==================== HEADERS ====================
// From = email do próprio domínio | Reply-To = email do visitante
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/plain; charset=utf-8\r\n";
$headers .= "From: Site EIC <" . $remetente . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ==================== ENVIAR EMAIL ====================
if (mail($para, $assunto_completo, $corpo_email, $headers, "-f" . $remetente)) {
    // ===== ENVIAR CÓPIA PARA O CLIENTE =====
    $assunto_cliente = "=?UTF-8?B?" . base64_encode("EIC, LDA - Confirmamos o recebimento da sua mensagem") . "?=";
    $corpo_cliente = "
Olá $nome,

Recebemos a sua mensagem com sucesso! Agradecemos o seu contacto.

Dados da sua mensagem:
------------------------------------------------
Assunto: $assunto
Mensagem: $mensagem
------------------------------------------------

Entraremos em contacto consigo o mais breve possível (dentro de 24h úteis).

Caso prefira, pode contactar-nos directamente:
   Telefone: (+258) 84 239 7504 ou (+258) 84 477 5449
   Email: geral@eic-lda.co.mz

Atenciosamente,
Equipa EIC, LDA
www.eic-lda.co.mz
";

    $headers_cliente = "MIME-Version: 1.0\r\n";
    $headers_cliente .= "Content-type: text/plain; charset=utf-8\r\n";
    $headers_cliente .= "From: EIC, LDA <" . $remetente . ">\r\n";
    $headers_cliente .= "Reply-To: " . $remetente . "\r\n";

    @mail($email, $assunto_cliente, $corpo_cliente, $headers_cliente, "-f" . $remetente);

    // ===== REDIRECIONAR PARA PÁGINA DE SUCESSO =====
    header("Location: obrigado.html");
    exit;
} else {
    // ===== ERRO NO ENVIO =====
    echo "<!DOCTYPE html>
    <html lang='pt'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Erro no Envio</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
            .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center; border-left: 5px solid #ff6b35; }
            .error-box h2 { color: #ff6b35; margin-top: 0; }
            .error-box p { color: #555; line-height: 1.6; }
            .error-box .btn { display: inline-block; background: #AF9C03; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; transition: background 0.3s; border: none; cursor: pointer; }
            .error-box .btn:hover { background: #8a7a02; }
            .error-box .btn-whatsapp { display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 10px; transition: background 0.3s; margin-left: 10px; }
            .error-box .btn-whatsapp:hover { background: #1da851; }
        </style>
    </head>
    <body>
        <div class='error-box'>
            <h2>❌ Erro ao Enviar</h2>
            <p>Desculpe, ocorreu um erro ao enviar sua mensagem.<br>Por favor, tente novamente ou contacte-nos diretamente:</p>
            <p>
                <a href='tel:+258842397504' class='btn' style='background: #5025EC;'>📞 Ligar</a>
                <a href='https://wa.me/message/JNSUV6PHP3MOA1' target='_blank' class='btn-whatsapp'>💬 WhatsApp</a>
            </p>
            <br>
            <a href='javascript:history.back()' class='btn'>← Voltar e Tentar Novamente</a>
        </div>
    </body>
    </html>";
    exit;
}
?>
