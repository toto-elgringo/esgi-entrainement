fn somme_des_pairs(n: u32) -> u32 {
    let mut somme = 0;
    for i in 1..=n {
        if i % 2 == 0 {
            somme += i;
        }
    }
    somme
}

fn puissance(base: u64, exposant: u32) -> u64 {
    let mut resultat = 1;
    for _ in 0..exposant {
        resultat *= base;
    }
    resultat
}

fn plus_petit_diviseur(n: u32) -> u32 {
    let mut diviseur = 2;
    while n % diviseur != 0 {
        diviseur += 1;
    }
    diviseur
}

fn main() {
    println!("{}", somme_des_pairs(6));
    println!("{}", puissance(2, 10));
    println!("{}", plus_petit_diviseur(15));
}
