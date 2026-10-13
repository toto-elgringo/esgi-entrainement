fn doubler(x: Option<i32>) -> Option<i32> {
    todo!()
}

fn valeur_ou_defaut(x: Option<i32>, defaut: i32) -> i32 {
    todo!()
}

fn longueur(texte: Option<&str>) -> usize {
    todo!()
}

fn appliquer_reduction(prix: Option<u32>, reduction: u32) -> Option<u32> {
    todo!()
}

fn main() {
    println!("{:?}", doubler(Some(4)));
    println!("{}", valeur_ou_defaut(None, 10));
    println!("{}", longueur(Some("Rust")));
    println!("{:?}", appliquer_reduction(Some(5), 8));
}
