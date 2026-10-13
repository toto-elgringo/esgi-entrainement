#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn texte_ascii() {
        assert_eq!(nb_octets("Hello"), 5, "\"Hello\" fait 5 octets");
        assert_eq!(nb_caracteres("Hello"), 5, "\"Hello\" fait 5 caractères");
    }

    #[test]
    fn texte_vide() {
        assert_eq!(nb_octets(""), 0, "un texte vide fait 0 octet");
        assert_eq!(nb_caracteres(""), 0, "un texte vide fait 0 caractère");
    }

    #[test]
    fn accents() {
        assert_eq!(nb_octets("Hé"), 3, "\"Hé\" fait 3 octets : é en prend 2");
        assert_eq!(nb_caracteres("Hé"), 2, "\"Hé\" fait 2 caractères");
        assert_eq!(nb_octets("€"), 3, "€ prend 3 octets");
        assert_eq!(nb_caracteres("€"), 1, "€ est un seul caractère");
    }

    #[test]
    fn emojis() {
        assert_eq!(nb_octets("Hello, 🦀"), 11, "\"Hello, 🦀\" fait 11 octets : le crabe en prend 4");
        assert_eq!(nb_caracteres("Hello, 🦀"), 8, "\"Hello, 🦀\" fait 8 caractères");
        assert_eq!(nb_octets("Hé, 🦀 !"), 11, "\"Hé, 🦀 !\" fait 11 octets");
        assert_eq!(nb_caracteres("Hé, 🦀 !"), 7, "\"Hé, 🦀 !\" fait 7 caractères");
    }
}
