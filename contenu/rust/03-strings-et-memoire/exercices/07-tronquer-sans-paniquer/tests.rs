#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn texte_ascii() {
        assert_eq!(tronquer("Hello", 3), "Hel", "tronquer(\"Hello\", 3) doit donner \"Hel\"");
        assert_eq!(tronquer("Hello", 0), "", "tronquer à 0 octet donne un texte vide");
    }

    #[test]
    fn plus_long_que_le_texte() {
        assert_eq!(tronquer("abc", 10), "abc", "si on demande plus que la longueur, on garde tout");
        assert_eq!(tronquer("abc", 3), "abc", "exactement la longueur : on garde tout");
    }

    #[test]
    fn au_milieu_d_un_caractere() {
        assert_eq!(tronquer("Hé", 2), "H", "2 tombe au milieu du é : on recule à 1");
        assert_eq!(tronquer("Hé", 3), "Hé", "3 octets suffisent pour \"Hé\"");
        assert_eq!(tronquer("Hello, 🦀", 8), "Hello, ", "8 tombe au milieu du crabe : on recule à 7");
        assert_eq!(tronquer("Hello, 🦀", 10), "Hello, ", "10 tombe encore dans le crabe");
        assert_eq!(tronquer("🦀", 3), "", "le crabe entier ne rentre pas dans 3 octets");
    }
}
