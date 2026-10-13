#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn positions_ascii() {
        assert_eq!(positions("abc"), vec![0, 1, 2], "en ASCII, chaque caractère fait 1 octet");
        assert!(positions("").is_empty(), "un texte vide n'a aucune position");
    }

    #[test]
    fn positions_multi_octets() {
        assert_eq!(positions("Hé, 🦀 !"), vec![0, 1, 3, 4, 5, 9, 10], "é prend 2 octets et le crabe 4");
        assert_eq!(positions("€€"), vec![0, 3], "€ prend 3 octets");
    }

    #[test]
    fn caracteres_speciaux() {
        assert_eq!(nb_caracteres_speciaux("abc"), 0, "aucun caractère spécial dans \"abc\"");
        assert_eq!(nb_caracteres_speciaux("Hé, 🦀 !"), 2, "é et le crabe prennent plus d'un octet");
        assert_eq!(nb_caracteres_speciaux("€€"), 2, "deux symboles € de 3 octets");
        assert_eq!(nb_caracteres_speciaux(""), 0, "texte vide : 0");
    }
}
