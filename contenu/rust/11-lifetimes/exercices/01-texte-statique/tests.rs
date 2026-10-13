#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn codes_connus() {
        assert_eq!(message_erreur(200), "ok", "200 : ok");
        assert_eq!(message_erreur(404), "page introuvable", "404 : page introuvable");
        assert_eq!(message_erreur(500), "erreur du serveur", "500 : erreur du serveur");
    }

    #[test]
    fn codes_inconnus() {
        assert_eq!(message_erreur(0), "code inconnu", "0 n'est pas un code connu");
        assert_eq!(message_erreur(418), "code inconnu", "418 n'est pas dans la liste");
    }

    #[test]
    fn le_message_survit_a_tout() {
        let message;
        {
            let code = 404;
            message = message_erreur(code);
        }
        assert_eq!(message, "page introuvable", "un &'static str reste valable partout");
    }
}
