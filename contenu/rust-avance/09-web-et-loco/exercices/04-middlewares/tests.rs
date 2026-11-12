#[cfg(test)]
mod tests {
    use super::*;

    fn requete(chemin: &str, jeton: Option<&str>) -> Requete {
        Requete {
            chemin: chemin.to_string(),
            jeton: jeton.map(|j| j.to_string()),
        }
    }

    fn page() -> Gestionnaire {
        Box::new(|r| Reponse::new(200, &format!("page {}", r.chemin)))
    }

    #[test]
    fn jeton_valide() {
        let h = exiger_jeton(page(), "secret");
        assert_eq!(h(&requete("/a", Some("secret"))), Reponse::new(200, "page /a"), "jeton correct : la page répond");
    }

    #[test]
    fn jeton_faux() {
        let h = exiger_jeton(page(), "secret");
        assert_eq!(h(&requete("/a", Some("autre"))), Reponse::new(401, "non autorisé"), "mauvais jeton");
    }

    #[test]
    fn jeton_absent() {
        let h = exiger_jeton(page(), "secret");
        assert_eq!(h(&requete("/a", None)), Reponse::new(401, "non autorisé"), "pas de jeton");
    }

    #[test]
    fn le_gestionnaire_n_est_pas_appele_sans_jeton() {
        let appels = Rc::new(RefCell::new(0));
        let compteur = Rc::clone(&appels);
        let h = exiger_jeton(
            Box::new(move |_| {
                *compteur.borrow_mut() += 1;
                Reponse::new(200, "ok")
            }),
            "secret",
        );
        h(&requete("/a", None));
        assert_eq!(*appels.borrow(), 0, "le gestionnaire ne doit pas être appelé");
        h(&requete("/a", Some("secret")));
        assert_eq!(*appels.borrow(), 1, "il est appelé avec le bon jeton");
    }

    #[test]
    fn journal_simple() {
        let journal: Journal = Rc::new(RefCell::new(Vec::new()));
        let h = journaliser(page(), Rc::clone(&journal));
        let rep = h(&requete("/x", None));
        assert_eq!(rep, Reponse::new(200, "page /x"), "la réponse est renvoyée telle quelle");
        assert_eq!(
            *journal.borrow(),
            vec!["début /x".to_string(), "fin /x 200".to_string()],
            "deux lignes de journal"
        );
    }

    #[test]
    fn journal_et_jeton_combines() {
        let journal: Journal = Rc::new(RefCell::new(Vec::new()));
        let h = journaliser(exiger_jeton(page(), "secret"), Rc::clone(&journal));
        h(&requete("/prive", None));
        h(&requete("/prive", Some("secret")));
        assert_eq!(
            *journal.borrow(),
            vec![
                "début /prive".to_string(),
                "fin /prive 401".to_string(),
                "début /prive".to_string(),
                "fin /prive 200".to_string(),
            ],
            "le journal voit aussi les refus"
        );
    }
}
