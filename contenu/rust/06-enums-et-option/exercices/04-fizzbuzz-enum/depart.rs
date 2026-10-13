#[derive(Debug, PartialEq)]
enum FizzBuzz {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}

fn fizz_buzz(n: u32) -> FizzBuzz {
    todo!()
}

fn en_texte(valeur: &FizzBuzz) -> String {
    todo!()
}

fn main() {
    for i in 1..=15 {
        println!("{}", en_texte(&fizz_buzz(i)));
    }
}
