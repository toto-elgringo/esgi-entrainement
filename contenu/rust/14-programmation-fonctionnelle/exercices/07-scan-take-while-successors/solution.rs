use std::iter::successors;

fn soldes(depart: i32, mouvements: &[i32]) -> Vec<i32> {
    mouvements
        .iter()
        .scan(depart, |solde, &mouvement| {
            *solde += mouvement;
            Some(*solde)
        })
        .collect()
}

fn soldes_avant_decouvert(depart: i32, mouvements: &[i32]) -> Vec<i32> {
    soldes(depart, mouvements)
        .into_iter()
        .take_while(|&solde| solde >= 0)
        .collect()
}

fn sans_zeros_au_debut(chiffres: &[u32]) -> Vec<u32> {
    chiffres.iter().copied().skip_while(|&c| c == 0).collect()
}

fn collatz(n: u64) -> Vec<u64> {
    successors(Some(n), |&x| match x {
        1 => None,
        pair if pair % 2 == 0 => Some(pair / 2),
        impair => Some(3 * impair + 1),
    })
    .collect()
}

fn puissances_jusqu_a(base: u64, limite: u64) -> Vec<u64> {
    successors(Some(1_u64), |&x| x.checked_mul(base))
        .take_while(|&x| x <= limite)
        .collect()
}

fn main() {
    println!("{:?}", soldes(100, &[-20, 50, -10]));
    println!("{:?}", soldes_avant_decouvert(50, &[-20, -40, 100]));
    println!("{:?}", sans_zeros_au_debut(&[0, 0, 4, 0, 7]));
    println!("{:?}", collatz(6));
    println!("{:?}", puissances_jusqu_a(3, 100));
}
