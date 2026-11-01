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
        todo!()
    }
}

fn fibonacci_premiers(n: usize) -> Vec<u64> {
    todo!()
}

fn fibonacci_pairs(n: usize) -> Vec<u64> {
    todo!()
}

fn fibonacci_sous(limite: u64) -> Vec<u64> {
    todo!()
}

fn chiffres(n: u64) -> impl Iterator<Item = u64> {
    std::iter::empty()
}

fn main() {
    println!("{:?}", fibonacci_premiers(7));
    println!("{:?}", fibonacci_pairs(4));
    println!("{:?}", fibonacci_sous(20));
    println!("{:?}", chiffres(4072).collect::<Vec<u64>>());
}
