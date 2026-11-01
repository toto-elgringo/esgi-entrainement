fn mots_longs_en_majuscules(phrase: &str, taille_min: usize) -> Vec<String> {
    todo!()
}

fn indice_du_premier_negatif(nombres: &[i32]) -> Option<usize> {
    todo!()
}

fn plus_forte_hausse(mesures: &[i32]) -> i32 {
    todo!()
}

fn paires_de_somme(nombres: &[i32], cible: i32) -> Vec<(i32, i32)> {
    todo!()
}

fn main() {
    println!("{:?}", mots_longs_en_majuscules("le petit chat dort", 4));
    println!("{:?}", indice_du_premier_negatif(&[3, 7, -2, 5, -8]));
    println!("{}", plus_forte_hausse(&[10, 12, 11, 15, 20]));
    println!("{:?}", paires_de_somme(&[1, 4, 3, 2, 5], 5));
}
