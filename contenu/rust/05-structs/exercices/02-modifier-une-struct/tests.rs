#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compter() {
        assert_eq!(compter_jusqua(0), 0, "sans avancer, le compteur reste à 0");
        assert_eq!(compter_jusqua(3), 3, "après 3 pas, le compteur vaut 3");
        assert_eq!(compter_jusqua(10), 10, "après 10 pas, le compteur vaut 10");
    }

    #[test]
    fn remise_a_zero() {
        let mut compteur = Compteur { valeur: 42 };
        remettre_a_zero(&mut compteur);
        assert_eq!(compteur.valeur, 0, "le compteur doit revenir à 0");
    }
}
