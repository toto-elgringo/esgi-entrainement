fn total(prix: &[u32]) -> u32 {
    prix.iter().sum()
}

fn nombre_de_mots_longs(mots: &[&str], taille_min: usize) -> usize {
    mots.iter().filter(|mot| mot.len() >= taille_min).count()
}

fn plus_grand(v: &[i32]) -> Option<i32> {
    v.iter().max().copied()
}

fn produit(v: &[u64]) -> u64 {
    v.iter().fold(1, |acc, x| acc * x)
}

fn moyenne(notes: &[f64]) -> Option<f64> {
    if notes.is_empty() {
        None
    } else {
        Some(notes.iter().sum::<f64>() / notes.len() as f64)
    }
}

fn main() {
    println!("{}", total(&[10, 25, 5]));
    println!("{:?}", plus_grand(&[3, -1, 8]));
    println!("{:?}", moyenne(&[10.0, 15.0]));
}
