use std::collections::HashMap;

fn ajouter(annuaire: &mut HashMap<String, String>, nom: &str, numero: &str) -> bool {
    todo!()
}

fn chercher(annuaire: &HashMap<String, String>, nom: &str) -> Option<String> {
    todo!()
}

fn supprimer(annuaire: &mut HashMap<String, String>, nom: &str) -> bool {
    todo!()
}

fn main() {
    let mut annuaire = HashMap::new();
    ajouter(&mut annuaire, "Alice", "06 11 22 33 44");
    println!("{:?}", chercher(&annuaire, "Alice"));
}
