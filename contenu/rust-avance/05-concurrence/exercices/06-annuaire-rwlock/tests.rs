#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ajout_simple() {
        let annuaire = Annuaire::new();
        annuaire.ajouter("Alice");
        annuaire.ajouter("Bob");
        assert_eq!(annuaire.nombre(), 2, "deux noms ajoutés");
        assert!(annuaire.contient("Alice"), "Alice est dans l'annuaire");
        assert!(!annuaire.contient("Charlie"), "Charlie n'y est pas");
    }

    #[test]
    fn annuaire_vide() {
        let annuaire = Annuaire::new();
        assert_eq!(annuaire.nombre(), 0, "un annuaire neuf est vide");
        assert!(!annuaire.contient("Alice"), "personne dans un annuaire vide");
    }

    #[test]
    fn ecritures_en_parallele() {
        let annuaire = Arc::new(Annuaire::new());
        let mut handles = Vec::new();
        for t in 0..4 {
            let annuaire = Arc::clone(&annuaire);
            handles.push(thread::spawn(move || {
                for i in 0..50 {
                    annuaire.ajouter(&format!("{t}-{i}"));
                }
            }));
        }
        for handle in handles {
            handle.join().unwrap();
        }
        assert_eq!(annuaire.nombre(), 200, "aucun ajout ne doit être perdu");
        assert!(annuaire.contient("3-49"), "le dernier nom du dernier thread est présent");
    }

    #[test]
    fn lectures_en_parallele() {
        let annuaire = Annuaire::new();
        annuaire.ajouter("Alice");
        let trouves = thread::scope(|s| {
            let handles: Vec<_> = (0..4)
                .map(|_| s.spawn(|| annuaire.contient("Alice")))
                .collect();
            handles
                .into_iter()
                .map(|h| h.join().unwrap())
                .filter(|&trouve| trouve)
                .count()
        });
        assert_eq!(trouves, 4, "les 4 lecteurs trouvent Alice");
    }
}
