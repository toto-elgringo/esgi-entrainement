const EXEMPLE: &str = "1000
2000
3000

4000

5000
6000

7000
8000
9000

10000";

fn mettre_a_jour_meilleur(meilleur: &mut u32, total: u32) {
    if *meilleur < total {
        *meilleur = total;
    }
}

fn calories_max(entree: &str) -> u32 {
    let mut meilleur = 0;
    let mut total = 0;
    for ligne in entree.lines() {
        let ligne = ligne.trim();
        if ligne.is_empty() {
            mettre_a_jour_meilleur(&mut meilleur, total);
            total = 0;
        } else {
            total += ligne.parse::<u32>().unwrap_or(0);
        }
    }
    mettre_a_jour_meilleur(&mut meilleur, total);
    meilleur
}

fn main() {
    println!("Partie 1 : {}", calories_max(EXEMPLE));
}
