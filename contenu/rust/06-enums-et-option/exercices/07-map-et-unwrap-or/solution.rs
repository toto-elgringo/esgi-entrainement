fn doubler(x: Option<i32>) -> Option<i32> {
    x.map(|v| v * 2)
}

fn valeur_ou_defaut(x: Option<i32>, defaut: i32) -> i32 {
    x.unwrap_or(defaut)
}

fn longueur(texte: Option<&str>) -> usize {
    texte.map(|t| t.len()).unwrap_or(0)
}

fn appliquer_reduction(prix: Option<u32>, reduction: u32) -> Option<u32> {
    prix.map(|p| p.saturating_sub(reduction))
}

fn main() {
    println!("{:?}", doubler(Some(4)));
    println!("{}", valeur_ou_defaut(None, 10));
    println!("{}", longueur(Some("Rust")));
    println!("{:?}", appliquer_reduction(Some(5), 8));
}
