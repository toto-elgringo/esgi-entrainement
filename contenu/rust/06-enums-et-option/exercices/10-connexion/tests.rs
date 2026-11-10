#[cfg(test)]
mod tests {
    use super::*;

    fn connecte(session: u64, pseudo: &str) -> Connexion {
        Connexion::Connecte {
            session,
            pseudo: pseudo.to_string(),
        }
    }

    #[test]
    fn demarrer_depuis_deconnecte() {
        assert_eq!(
            Connexion::Deconnecte.demarrer(1_000),
            Connexion::EnCours { depuis_ms: 1_000 },
            "démarrer une connexion déconnectée la met en cours"
        );
    }

    #[test]
    fn demarrer_ne_change_pas_les_autres_etats() {
        assert_eq!(
            Connexion::EnCours { depuis_ms: 5 }.demarrer(99),
            Connexion::EnCours { depuis_ms: 5 },
            "une connexion déjà en cours garde son instant de départ"
        );
        assert_eq!(connecte(1, "ana").demarrer(99), connecte(1, "ana"), "une connexion établie ne redémarre pas");
    }

    #[test]
    fn accepter_une_connexion_en_cours() {
        assert_eq!(
            Connexion::EnCours { depuis_ms: 10 }.accepter(42, "ferris"),
            connecte(42, "ferris"),
            "une connexion en cours acceptée devient connectée"
        );
    }

    #[test]
    fn accepter_sans_demarrer() {
        assert_eq!(
            Connexion::Deconnecte.accepter(42, "ferris"),
            Connexion::Deconnecte,
            "on ne peut pas accepter une connexion qui n'a pas démarré"
        );
        assert_eq!(connecte(1, "ana").accepter(2, "bob"), connecte(1, "ana"), "une connexion établie ne change pas de session");
    }

    #[test]
    fn deconnecter_tout() {
        assert_eq!(connecte(1, "ana").deconnecter(), Connexion::Deconnecte, "se déconnecter quand on est connecté");
        assert_eq!(Connexion::EnCours { depuis_ms: 3 }.deconnecter(), Connexion::Deconnecte, "annuler une connexion en cours");
        assert_eq!(Connexion::Deconnecte.deconnecter(), Connexion::Deconnecte, "rester déconnecté");
    }

    #[test]
    fn le_pseudo() {
        assert_eq!(connecte(7, "ferris").pseudo(), Some("ferris"), "un client connecté a un pseudo");
        assert_eq!(Connexion::Deconnecte.pseudo(), None, "un client déconnecté n'a pas de pseudo");
        assert_eq!(Connexion::EnCours { depuis_ms: 0 }.pseudo(), None, "pas encore de pseudo pendant la connexion");
    }

    #[test]
    fn attente_trop_longue() {
        let c = Connexion::EnCours { depuis_ms: 1_000 };
        assert!(c.trop_longue(7_000, 5_000), "6 000 ms d'attente pour une limite de 5 000 : trop long");
        assert!(!c.trop_longue(6_000, 5_000), "exactement 5 000 ms : pas encore trop long");
        assert!(!c.trop_longue(2_000, 5_000), "1 000 ms d'attente : ça va");
    }

    #[test]
    fn jamais_trop_longue_hors_attente() {
        assert!(!Connexion::Deconnecte.trop_longue(1_000_000, 10), "un client déconnecté n'attend rien");
        assert!(!connecte(1, "ana").trop_longue(1_000_000, 10), "un client connecté n'attend plus");
    }
}
