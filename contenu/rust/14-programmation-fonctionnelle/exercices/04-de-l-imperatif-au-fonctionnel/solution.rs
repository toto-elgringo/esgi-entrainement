fn mots_longs_en_majuscules(phrase: &str, taille_min: usize) -> Vec<String> {
    phrase
        .split_whitespace()
        .filter(|mot| mot.chars().count() >= taille_min)
        .map(str::to_uppercase)
        .collect()
}

fn indice_du_premier_negatif(nombres: &[i32]) -> Option<usize> {
    nombres.iter().position(|&n| n < 0)
}

fn plus_forte_hausse(mesures: &[i32]) -> i32 {
    mesures
        .windows(2)
        .map(|paire| paire[1] - paire[0])
        .fold(0, i32::max)
}

fn paires_de_somme(nombres: &[i32], cible: i32) -> Vec<(i32, i32)> {
    nombres
        .iter()
        .enumerate()
        .flat_map(|(i, &a)| nombres[i + 1..].iter().map(move |&b| (a, b)))
        .filter(|&(a, b)| a + b == cible)
        .collect()
}

fn main() {
    println!("{:?}", mots_longs_en_majuscules("le petit chat dort", 4));
    println!("{:?}", indice_du_premier_negatif(&[3, 7, -2, 5, -8]));
    println!("{}", plus_forte_hausse(&[10, 12, 11, 15, 20]));
    println!("{:?}", paires_de_somme(&[1, 4, 3, 2, 5], 5));
}
