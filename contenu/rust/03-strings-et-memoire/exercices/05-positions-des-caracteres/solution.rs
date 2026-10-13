fn positions(s: &str) -> Vec<usize> {
    let mut resultat = Vec::new();
    for (position, _) in s.char_indices() {
        resultat.push(position);
    }
    resultat
}

fn nb_caracteres_speciaux(s: &str) -> usize {
    let mut total = 0;
    for caractere in s.chars() {
        if caractere.len_utf8() > 1 {
            total += 1;
        }
    }
    total
}

fn main() {
    let texte = "Hé, 🦀 !";
    println!("{:?}", positions(texte));
    println!("{}", nb_caracteres_speciaux(texte));
}
