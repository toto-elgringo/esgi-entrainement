#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coco_devient_coca() {
        let mut s = String::from("Coco");
        changer_derniere_lettre(&mut s);
        assert_eq!(s, "Coca", "\"Coco\" doit devenir \"Coca\"");
    }

    #[test]
    fn avec_un_emoji() {
        let mut s = String::from("Coc🦀");
        changer_derniere_lettre(&mut s);
        assert_eq!(s, "Coca", "pop retire le crabe entier : \"Coc🦀\" doit devenir \"Coca\"");
    }

    #[test]
    fn texte_vide() {
        let mut s = String::new();
        changer_derniere_lettre(&mut s);
        assert_eq!(s, "", "un texte vide doit rester vide");
    }
}
