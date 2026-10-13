fn somme_jusqua(n: u32) -> u32 {
    let total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}

fn main() {
    println!("Somme de 1 à 10 : {}", somme_jusqua(10));
}
