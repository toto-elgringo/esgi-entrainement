#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn insuffisant() {
        assert_eq!(mention(0), "insuffisant", "0 : insuffisant");
        assert_eq!(mention(9), "insuffisant", "9 : insuffisant");
    }

    #[test]
    fn passable_et_assez_bien() {
        assert_eq!(mention(10), "passable", "10 : passable");
        assert_eq!(mention(11), "passable", "11 : passable");
        assert_eq!(mention(12), "assez bien", "12 : assez bien");
        assert_eq!(mention(13), "assez bien", "13 : assez bien");
    }

    #[test]
    fn bien_et_tres_bien() {
        assert_eq!(mention(14), "bien", "14 : bien");
        assert_eq!(mention(15), "bien", "15 : bien");
        assert_eq!(mention(16), "très bien", "16 : très bien");
        assert_eq!(mention(20), "très bien", "20 : très bien");
    }

    #[test]
    fn invalide() {
        assert_eq!(mention(21), "note invalide", "21 n'est pas une note sur 20");
        assert_eq!(mention(255), "note invalide", "255 n'est pas une note sur 20");
    }
}
