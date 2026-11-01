use std::iter::successors;

fn soldes(depart: i32, mouvements: &[i32]) -> Vec<i32> {
    todo!()
}

fn soldes_avant_decouvert(depart: i32, mouvements: &[i32]) -> Vec<i32> {
    todo!()
}

fn sans_zeros_au_debut(chiffres: &[u32]) -> Vec<u32> {
    todo!()
}

fn collatz(n: u64) -> Vec<u64> {
    todo!()
}

fn puissances_jusqu_a(base: u64, limite: u64) -> Vec<u64> {
    todo!()
}

fn main() {
    println!("{:?}", soldes(100, &[-20, 50, -10]));
    println!("{:?}", soldes_avant_decouvert(50, &[-20, -40, 100]));
    println!("{:?}", sans_zeros_au_debut(&[0, 0, 4, 0, 7]));
    println!("{:?}", collatz(6));
    println!("{:?}", puissances_jusqu_a(3, 100));
}
