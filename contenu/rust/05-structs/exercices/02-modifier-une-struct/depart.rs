struct Compteur {
    valeur: u32,
}

fn compter_jusqua(n: u32) -> u32 {
    let compteur = Compteur { valeur: 0 };
    for _ in 0..n {
        compteur.valeur += 1;
    }
    compteur.valeur
}

fn remettre_a_zero(compteur: &Compteur) {
    compteur.valeur = 0;
}

fn main() {
    let mut compteur = Compteur { valeur: 5 };
    remettre_a_zero(&mut compteur);
    println!("Après remise à zéro : {}", compteur.valeur);
    println!("Compter jusqu'à 3 : {}", compter_jusqua(3));
}
