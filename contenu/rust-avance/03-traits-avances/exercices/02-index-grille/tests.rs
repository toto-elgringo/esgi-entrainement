#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lecture_initiale() {
        let g = Grille::new(3, 2);
        assert_eq!(g[(1, 2)], 0, "une case neuve vaut 0");
    }

    #[test]
    fn ecriture_et_lecture() {
        let mut g = Grille::new(3, 2);
        g[(1, 2)] = 7;
        assert_eq!(g[(1, 2)], 7, "la case (1, 2) doit valoir 7 après écriture");
        assert_eq!(g[(0, 2)], 0, "les autres cases ne bougent pas");
        assert_eq!(g[(1, 1)], 0, "les autres cases ne bougent pas");
    }

    #[test]
    fn modification_sur_place() {
        let mut g = Grille::new(2, 2);
        g[(0, 1)] += 4;
        g[(0, 1)] *= 3;
        assert_eq!(g[(0, 1)], 12, "+= puis *= doivent s'appliquer à la même case");
    }

    #[test]
    fn rangement_par_ligne() {
        let mut g = Grille::new(4, 3);
        g[(2, 1)] = 9;
        assert_eq!(g.cases[2 * 4 + 1], 9, "la case (2, 1) est à la position ligne * largeur + colonne");
    }

    #[test]
    #[should_panic]
    fn colonne_hors_grille() {
        let g = Grille::new(3, 2);
        let _ = g[(0, 3)];
    }

    #[test]
    #[should_panic]
    fn ligne_hors_grille() {
        let mut g = Grille::new(3, 2);
        g[(2, 0)] = 1;
    }
}
