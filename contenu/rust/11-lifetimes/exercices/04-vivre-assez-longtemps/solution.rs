fn plus_long<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn longueur_du_plus_long(texte_1: &str, texte_2: &str) -> usize {
    let premier = texte_1.to_uppercase();
    let second = texte_2.to_uppercase();
    let resultat = plus_long(&premier, &second);
    resultat.len()
}

fn premier_mot_en_majuscules(texte: &str) -> String {
    let majuscules = texte.to_uppercase();
    let mot = majuscules.split_whitespace().next().unwrap_or("");
    mot.to_string()
}

fn main() {
    println!("{}", longueur_du_plus_long("bonjour", "salut"));
    println!("{}", premier_mot_en_majuscules("bonjour le monde"));
}
