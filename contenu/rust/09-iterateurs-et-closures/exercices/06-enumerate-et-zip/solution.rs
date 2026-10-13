fn positions_de(v: &[i32], cible: i32) -> Vec<usize> {
    v.iter()
        .enumerate()
        .filter(|(_, x)| **x == cible)
        .map(|(i, _)| i)
        .collect()
}

fn produit_scalaire(a: &[i32], b: &[i32]) -> i32 {
    a.iter().zip(b).map(|(x, y)| x * y).sum()
}

fn numeroter(mots: &[&str]) -> Vec<String> {
    mots.iter()
        .enumerate()
        .map(|(i, mot)| format!("{}. {}", i + 1, mot))
        .collect()
}

fn main() {
    println!("{:?}", positions_de(&[7, 3, 7, 1], 7));
    println!("{}", produit_scalaire(&[1, 2, 3], &[4, 5, 6]));
    println!("{:?}", numeroter(&["pain", "lait"]));
}
