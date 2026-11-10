#[cfg(test)]
mod tests {
    use super::*;

    fn fichier_temporaire(nom: &str, contenu: &str) -> String {
        let chemin = std::env::temp_dir().join(format!("esgi-{}-{nom}", std::process::id()));
        std::fs::write(&chemin, contenu).expect("écriture du fichier de test");
        chemin.to_string_lossy().into_owned()
    }

    #[test]
    fn trois_lignes() {
        let chemin = fichier_temporaire("trois.txt", "un\ndeux\ntrois\n");
        assert_eq!(compter_lignes(&chemin).ok(), Some(3), "un fichier de 3 lignes donne Ok(3)");
    }

    #[test]
    fn fichier_vide() {
        let chemin = fichier_temporaire("vide.txt", "");
        assert_eq!(compter_lignes(&chemin).ok(), Some(0), "un fichier vide a 0 ligne");
    }

    #[test]
    fn sans_retour_final() {
        let chemin = fichier_temporaire("sans-fin.txt", "a\nb");
        assert_eq!(compter_lignes(&chemin).ok(), Some(2), "la dernière ligne compte même sans retour à la ligne");
    }

    #[test]
    fn fichier_absent() {
        assert!(
            compter_lignes("ce-fichier-n-existe-pas.txt").is_err(),
            "un fichier absent doit donner Err, sans paniquer"
        );
    }

    #[test]
    fn resume_ok() {
        let chemin = fichier_temporaire("resume.txt", "x\ny\n");
        assert_eq!(resume(&chemin), "2 lignes", "le résumé d'un fichier de 2 lignes");
    }

    #[test]
    fn resume_erreur() {
        let texte = resume("ce-fichier-n-existe-pas.txt");
        assert!(
            texte.starts_with("impossible de lire ce-fichier-n-existe-pas.txt : "),
            "le message d'erreur commence par « impossible de lire <chemin> : »"
        );
        assert!(texte.len() > "impossible de lire ce-fichier-n-existe-pas.txt : ".len(), "le message contient l'erreur du système");
    }
}
