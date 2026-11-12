#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn chemin_de_la_racine() {
        let racine = nouveau("racine");
        assert_eq!(chemin(&racine), "racine", "la racine n'a pas de parent");
    }

    #[test]
    fn chemin_d_une_feuille() {
        let racine = nouveau("racine");
        let src = nouveau("src");
        let main = nouveau("main");
        ajouter_enfant(&racine, &src);
        ajouter_enfant(&src, &main);
        assert_eq!(chemin(&main), "racine/src/main", "le chemin remonte jusqu'à la racine");
    }

    #[test]
    fn descendants() {
        let racine = nouveau("racine");
        let a = nouveau("a");
        let b = nouveau("b");
        let c = nouveau("c");
        ajouter_enfant(&racine, &a);
        ajouter_enfant(&racine, &b);
        ajouter_enfant(&a, &c);
        assert_eq!(compter_descendants(&racine), 3, "a, b et c");
        assert_eq!(compter_descendants(&a), 1, "seulement c");
        assert_eq!(compter_descendants(&c), 0, "une feuille n'a pas de descendant");
    }

    #[test]
    fn parent_libere() {
        let feuille = nouveau("feuille");
        assert!(!a_un_parent(&feuille), "pas encore de parent");
        {
            let branche = nouveau("branche");
            ajouter_enfant(&branche, &feuille);
            assert!(a_un_parent(&feuille), "le parent existe");
        }
        assert!(!a_un_parent(&feuille), "le parent a été libéré");
    }

    #[test]
    fn le_parent_n_est_pas_garde_en_vie_par_l_enfant() {
        let racine = nouveau("racine");
        let enfant = nouveau("enfant");
        ajouter_enfant(&racine, &enfant);
        assert_eq!(Rc::strong_count(&racine), 1, "l'enfant ne compte pas comme propriétaire du parent");
        assert_eq!(Rc::weak_count(&racine), 1, "mais il le référence faiblement");
        assert_eq!(Rc::strong_count(&enfant), 2, "le parent possède l'enfant");
    }
}
