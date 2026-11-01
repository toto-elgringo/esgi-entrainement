use std::iter::successors;

struct Fibonacci {
    actuel: u64,
    suivant: u64,
}

impl Fibonacci {
    fn new() -> Self {
        Fibonacci {
            actuel: 0,
            suivant: 1,
        }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let valeur = self.actuel;
        (self.actuel, self.suivant) = (self.suivant, self.actuel + self.suivant);
        Some(valeur)
    }
}

fn fibonacci_premiers(n: usize) -> Vec<u64> {
    Fibonacci::new().take(n).collect()
}

fn fibonacci_pairs(n: usize) -> Vec<u64> {
    Fibonacci::new().filter(|f| f % 2 == 0).take(n).collect()
}

fn fibonacci_sous(limite: u64) -> Vec<u64> {
    Fibonacci::new().take_while(|&f| f < limite).collect()
}

fn chiffres(n: u64) -> impl Iterator<Item = u64> {
    successors(Some(n), |&reste| (reste >= 10).then_some(reste / 10)).map(|reste| reste % 10)
}

fn main() {
    println!("{:?}", fibonacci_premiers(7));
    println!("{:?}", fibonacci_pairs(4));
    println!("{:?}", fibonacci_sous(20));
    println!("{:?}", chiffres(4072).collect::<Vec<u64>>());
}
