#[cfg(test)]
mod tests {
    use super::*;

    fn construire(valeurs: &[i32]) -> Arbre {
        let mut arbre: Arbre = None;
        for &valeur in valeurs {
            arbre = inserer(arbre, valeur);
        }
        arbre
    }

    #[test]
    fn arbre_vide() {
        let arbre: Arbre = None;
        assert_eq!(hauteur(&arbre), 0, "arbre vide : hauteur 0");
        assert!(!contient(&arbre, 1), "rien dans un arbre vide");
        assert_eq!(en_ordre(&arbre), Vec::<i32>::new(), "arbre vide : aucune valeur");
    }

    #[test]
    fn tri() {
        let arbre = construire(&[50, 30, 70, 20, 40, 60, 80]);
        assert_eq!(en_ordre(&arbre), vec![20, 30, 40, 50, 60, 70, 80], "valeurs triées");
    }

    #[test]
    fn recherche() {
        let arbre = construire(&[5, 3, 8, 1]);
        assert!(contient(&arbre, 1), "1 est dans l'arbre");
        assert!(contient(&arbre, 8), "8 est dans l'arbre");
        assert!(!contient(&arbre, 4), "4 n'est pas dans l'arbre");
    }

    #[test]
    fn hauteurs() {
        assert_eq!(hauteur(&construire(&[10])), 1, "un seul nœud");
        assert_eq!(hauteur(&construire(&[50, 30, 70])), 2, "arbre équilibré de 3 nœuds");
        assert_eq!(hauteur(&construire(&[1, 2, 3, 4])), 4, "valeurs déjà triées : une chaîne");
    }

    #[test]
    fn doublons() {
        let arbre = construire(&[4, 4, 2, 2, 4]);
        assert_eq!(en_ordre(&arbre), vec![2, 4], "les doublons sont ignorés");
    }
}
