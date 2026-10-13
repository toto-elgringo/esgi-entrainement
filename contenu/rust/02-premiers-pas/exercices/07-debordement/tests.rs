#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn prudent() {
        assert_eq!(ajouter_prudemment(100, 50), Some(150), "100 + 50 tient dans un u8");
        assert_eq!(ajouter_prudemment(200, 100), None, "200 + 100 dépasse 255 : None attendu");
    }

    #[test]
    fn plafonne() {
        assert_eq!(ajouter_plafonne(1, 2), 3, "1 + 2 = 3");
        assert_eq!(ajouter_plafonne(200, 100), 255, "200 + 100 est bloqué à 255");
    }

    #[test]
    fn en_boucle() {
        assert_eq!(ajouter_en_boucle(1, 2), 3, "1 + 2 = 3");
        assert_eq!(ajouter_en_boucle(250, 10), 4, "250 + 10 repart de zéro : 4");
    }
}
