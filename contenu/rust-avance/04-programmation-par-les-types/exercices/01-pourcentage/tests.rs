#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valeurs_valides() {
        assert_eq!(Pourcentage::new(0).unwrap().valeur(), 0, "0 est valide");
        assert_eq!(Pourcentage::new(100).unwrap().valeur(), 100, "100 est valide");
    }

    #[test]
    fn valeur_trop_grande() {
        assert_eq!(Pourcentage::new(101), Err("101 dépasse 100".to_string()), "101 est refusé");
        assert_eq!(Pourcentage::new(250), Err("250 dépasse 100".to_string()), "250 est refusé");
    }

    #[test]
    fn remise() {
        assert_eq!(appliquer_remise(200, Pourcentage::new(25).unwrap()), 150, "25 % de 200");
        assert_eq!(appliquer_remise(80, Pourcentage::new(0).unwrap()), 80, "0 % ne change rien");
        assert_eq!(appliquer_remise(80, Pourcentage::new(100).unwrap()), 0, "100 % rend gratuit");
    }
}
