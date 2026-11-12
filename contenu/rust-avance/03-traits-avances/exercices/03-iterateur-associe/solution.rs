struct Decompte {
    reste: u64,
}

impl Decompte {
    fn new(debut: u64) -> Decompte {
        Decompte { reste: debut }
    }
}

struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Fibonacci {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Decompte {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        if self.reste == 0 {
            None
        } else {
            let valeur = self.reste;
            self.reste -= 1;
            Some(valeur)
        }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let courant = self.a;
        self.a = self.b;
        self.b += courant;
        Some(courant)
    }
}

fn main() {
    let decompte: Vec<u64> = Decompte::new(3).collect();
    println!("{:?}", decompte);
    let fibo: Vec<u64> = Fibonacci::new().take(8).collect();
    println!("{:?}", fibo);
}
