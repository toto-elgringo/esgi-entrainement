#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn noeud_seul() {
        let racine = nouveau("racine");
        assert_eq!(nom_du_parent(&racine), None, "la racine n'a pas de parent");
        assert_eq!(nombre_enfants(&racine), 0, "pas d'enfant au début");
        assert_eq!(chemin(&racine), "racine", "le chemin de la racine est son nom");
    }

    #[test]
    fn parent_et_enfants() {
        let racine = nouveau("racine");
        let a = nouveau("a");
        let b = nouveau("b");
        ajouter_enfant(&racine, &a);
        ajouter_enfant(&racine, &b);
        assert_eq!(nombre_enfants(&racine), 2, "deux enfants");
        assert_eq!(nom_du_parent(&a), Some("racine".to_string()), "le parent de a");
        assert_eq!(nom_du_parent(&b), Some("racine".to_string()), "le parent de b");
    }

    #[test]
    fn le_chemin() {
        let racine = nouveau("racine");
        let a = nouveau("a");
        let b = nouveau("b");
        ajouter_enfant(&racine, &a);
        ajouter_enfant(&a, &b);
        assert_eq!(chemin(&b), "racine/a/b", "chemin complet");
        assert_eq!(chemin(&a), "racine/a", "chemin de a");
    }

    #[test]
    fn les_compteurs() {
        let racine = nouveau("racine");
        let a = nouveau("a");
        let b = nouveau("b");
        ajouter_enfant(&racine, &a);
        ajouter_enfant(&a, &b);
        assert_eq!(Rc::strong_count(&a), 2, "a : la variable + la liste d'enfants de la racine");
        assert_eq!(Rc::weak_count(&a), 1, "a : un lien faible, celui de b vers son parent");
        assert_eq!(Rc::strong_count(&racine), 1, "la racine n'est possédée que par la variable");
        assert_eq!(Rc::weak_count(&racine), 1, "la racine : un lien faible, celui de a");
    }

    #[test]
    fn parent_disparu() {
        let racine = nouveau("racine");
        let a = nouveau("a");
        ajouter_enfant(&racine, &a);
        assert_eq!(nom_du_parent(&a), Some("racine".to_string()), "le parent existe");
        drop(racine);
        assert_eq!(nom_du_parent(&a), None, "le parent est libéré : upgrade donne None");
        assert_eq!(Rc::strong_count(&a), 1, "a n'est plus dans la liste de la racine");
    }
}
