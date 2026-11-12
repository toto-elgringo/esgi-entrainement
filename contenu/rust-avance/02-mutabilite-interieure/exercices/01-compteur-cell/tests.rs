#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn depart_a_zero() {
        assert_eq!(Compteur::nouveau().valeur(), 0, "un compteur neuf vaut 0");
    }

    #[test]
    fn incrementer_ajoute_un() {
        let c = Compteur::nouveau();
        c.incrementer();
        c.incrementer();
        c.incrementer();
        assert_eq!(c.valeur(), 3, "trois incréments donnent 3");
    }

    #[test]
    fn remise_a_zero_renvoie_l_ancienne_valeur() {
        let c = Compteur::nouveau();
        c.incrementer();
        c.incrementer();
        assert_eq!(c.remettre_a_zero(), 2, "l'ancienne valeur est renvoyée");
        assert_eq!(c.valeur(), 0, "le compteur repart de 0");
    }
}
