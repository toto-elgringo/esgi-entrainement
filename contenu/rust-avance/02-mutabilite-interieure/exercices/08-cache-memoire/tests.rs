#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valeurs_correctes() {
        let c = Calculateur::nouveau();
        assert_eq!(c.carre(4), 16, "4 au carré");
        assert_eq!(c.carre(0), 0, "0 au carré");
        assert_eq!(c.carre(12), 144, "12 au carré");
    }

    #[test]
    fn premier_calcul_compte() {
        let c = Calculateur::nouveau();
        assert_eq!(c.calculs(), 0, "aucun calcul au départ");
        c.carre(4);
        assert_eq!(c.calculs(), 1, "un calcul après le premier appel");
    }

    #[test]
    fn le_cache_evite_de_recalculer() {
        let c = Calculateur::nouveau();
        c.carre(4);
        c.carre(4);
        c.carre(4);
        assert_eq!(c.calculs(), 1, "le même nombre n'est calculé qu'une fois");
    }

    #[test]
    fn valeurs_differentes() {
        let c = Calculateur::nouveau();
        c.carre(4);
        c.carre(5);
        c.carre(4);
        assert_eq!(c.calculs(), 2, "deux nombres différents, deux calculs");
        assert_eq!(c.carre(5), 25, "la valeur en cache est la bonne");
    }
}
