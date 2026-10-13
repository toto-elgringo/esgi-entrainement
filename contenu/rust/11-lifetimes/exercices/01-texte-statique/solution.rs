fn message_erreur(code: u32) -> &'static str {
    match code {
        200 => "ok",
        404 => "page introuvable",
        500 => "erreur du serveur",
        _ => "code inconnu",
    }
}

fn main() {
    println!("404 : {}", message_erreur(404));
}
