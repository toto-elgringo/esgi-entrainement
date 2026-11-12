#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn vide() {
        let h: HashMap<&str, i32> = hashmap!();
        assert_eq!(h.len(), 0, "une table sans paire est vide");
    }

    #[test]
    fn une_paire() {
        let h = hashmap!("a" => 1);
        assert_eq!(h.len(), 1, "une paire dans la table");
        assert_eq!(h["a"], 1, "la clé a vaut 1");
    }

    #[test]
    fn plusieurs_paires() {
        let h = hashmap! { "un" => 1, "deux" => 2, "trois" => 3 };
        assert_eq!(h.len(), 3, "trois paires dans la table");
        assert_eq!(h["deux"], 2, "la clé deux vaut 2");
    }

    #[test]
    fn virgule_finale() {
        let h = hashmap! {
            "x" => 10,
            "y" => 20,
        };
        assert_eq!(h.len(), 2, "la virgule finale est acceptée");
    }

    #[test]
    fn expressions() {
        let base = 5;
        let h = hashmap! { String::from("somme") => base + 1, "double".to_string() => base * 2 };
        assert_eq!(h["somme"], 6, "les valeurs peuvent être des expressions");
        assert_eq!(h["double"], 10, "les clés aussi");
    }
}
