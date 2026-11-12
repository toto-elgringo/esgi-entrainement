#[cfg(test)]
mod tests {
    #[test]
    fn une_valeur() {
        assert_eq!(maximum!(7), 7, "le maximum d'une seule valeur est elle-même");
    }

    #[test]
    fn deux_valeurs() {
        assert_eq!(maximum!(3, 8), 8, "le maximum de 3 et 8 est 8");
        assert_eq!(maximum!(8, 3), 8, "l'ordre ne change rien");
    }

    #[test]
    fn plusieurs_valeurs() {
        assert_eq!(maximum!(4, 9, 2, 6), 9, "le maximum de 4, 9, 2, 6 est 9");
        assert_eq!(maximum!(1, 2, 3, 4, 5, 6), 6, "le maximum est la dernière valeur");
    }

    #[test]
    fn decimaux() {
        assert_eq!(maximum!(2.5, 1.5, 9.25), 9.25, "ça marche aussi avec des décimaux");
    }

    #[test]
    fn expressions() {
        let a = 4;
        assert_eq!(maximum!(a * 2, a + 1, 3), 8, "les arguments peuvent être des expressions");
    }
}
