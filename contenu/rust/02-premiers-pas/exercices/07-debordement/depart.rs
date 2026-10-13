fn ajouter_prudemment(a: u8, b: u8) -> Option<u8> {
    Some(a + b)
}

fn ajouter_plafonne(a: u8, b: u8) -> u8 {
    a + b
}

fn ajouter_en_boucle(a: u8, b: u8) -> u8 {
    a + b
}

fn main() {
    println!("{:?}", ajouter_prudemment(200, 100));
    println!("{}", ajouter_plafonne(200, 100));
    println!("{}", ajouter_en_boucle(250, 10));
}
