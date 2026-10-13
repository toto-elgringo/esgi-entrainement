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

fn totaux_par_lutin(entree: &str) -> Vec<u32> {
    let mut totaux = Vec::new();
    let mut total = 0;
    for ligne in entree.lines() {
        let ligne = ligne.trim();
        if ligne.is_empty() {
            totaux.push(total);
            total = 0;
        } else {
            total += ligne.parse::<u32>().unwrap_or(0);
        }
    }
    totaux.push(total);
    totaux
}

fn top3_calories(entree: &str) -> u32 {
    let mut totaux = totaux_par_lutin(entree);
    totaux.sort_unstable_by(|a, b| b.cmp(a));
    totaux.iter().take(3).sum()
}

fn main() {
    println!("Totaux : {:?}", totaux_par_lutin(EXEMPLE));
    println!("Partie 2 : {}", top3_calories(EXEMPLE));
}
