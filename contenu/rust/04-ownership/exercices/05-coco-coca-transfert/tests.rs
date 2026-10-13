#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coco_devient_coca() {
        assert_eq!(changer_derniere_lettre(String::from("Coco")), "Coca", "\"Coco\" doit devenir \"Coca\"");
    }

    #[test]
    fn avec_un_emoji() {
        assert_eq!(changer_derniere_lettre(String::from("Coc🦀")), "Coca", "pop retire le crabe entier");
    }

    #[test]
    fn texte_vide() {
        assert_eq!(changer_derniere_lettre(String::new()), "", "un texte vide doit rester vide");
    }

    #[test]
    fn recuperer_la_propriete() {
        let s = String::from("Banane");
        let s = changer_derniere_lettre(s);
        assert_eq!(s, "Banana", "la String rendue doit être utilisable");
    }
}
