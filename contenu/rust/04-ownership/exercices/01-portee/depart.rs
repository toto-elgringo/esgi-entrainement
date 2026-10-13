fn total_panier(prix: u32, quantite: u32) -> u32 {
    if quantite >= 10 {
        let remise = 10;
    } else {
        let remise = 0;
    }
    prix * quantite - remise
}

fn main() {
    println!("{}", total_panier(2, 10));
}
