#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn addition() {
        assert_eq!(additionner(200, 100_000), 100_200, "200 + 100 000 = 100 200");
        assert_eq!(additionner(255, 1), 256, "255 + 1 = 256 (le résultat est un u32, pas un u8)");
    }

    #[test]
    fn conversion_sure() {
        assert_eq!(vers_u8(200), Some(200), "200 tient dans un u8");
        assert_eq!(vers_u8(255), Some(255), "255 est le maximum d'un u8");
        assert_eq!(vers_u8(256), None, "256 ne tient pas dans un u8");
        assert_eq!(vers_u8(100_000), None, "100 000 ne tient pas dans un u8");
    }

    #[test]
    fn troncature() {
        assert_eq!(garder_octet_bas(300), 44, "300 - 256 = 44");
        assert_eq!(garder_octet_bas(256), 0, "256 donne 0");
        assert_eq!(garder_octet_bas(100_000), 160, "100 000 donne 160");
    }
}
