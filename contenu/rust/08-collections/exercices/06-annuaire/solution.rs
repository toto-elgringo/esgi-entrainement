use std::collections::HashMap;

fn ajouter(annuaire: &mut HashMap<String, String>, nom: &str, numero: &str) -> bool {
    annuaire.insert(nom.to_string(), numero.to_string()).is_none()
}

fn chercher(annuaire: &HashMap<String, String>, nom: &str) -> Option<String> {
    annuaire.get(nom).cloned()
}

fn supprimer(annuaire: &mut HashMap<String, String>, nom: &str) -> bool {
    annuaire.remove(nom).is_some()
}

fn main() {
    let mut annuaire = HashMap::new();
    ajouter(&mut annuaire, "Alice", "06 11 22 33 44");
    println!("{:?}", chercher(&annuaire, "Alice"));
}
