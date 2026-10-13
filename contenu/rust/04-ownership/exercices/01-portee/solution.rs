fn total_panier(prix: u32, quantite: u32) -> u32 {
    let remise = if quantite >= 10 { 10 } else { 0 };
    prix * quantite - remise
}

fn main() {
    println!("{}", total_panier(2, 10));
}
