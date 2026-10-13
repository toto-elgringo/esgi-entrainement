#[derive(Debug, PartialEq)]
enum FizzBuzz {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}

fn fizz_buzz(n: u32) -> FizzBuzz {
    match n {
        i if i % 15 == 0 => FizzBuzz::FizzBuzz,
        i if i % 3 == 0 => FizzBuzz::Fizz,
        i if i % 5 == 0 => FizzBuzz::Buzz,
        i => FizzBuzz::Nombre(i),
    }
}

fn en_texte(valeur: &FizzBuzz) -> String {
    match valeur {
        FizzBuzz::Fizz => "Fizz".to_string(),
        FizzBuzz::Buzz => "Buzz".to_string(),
        FizzBuzz::FizzBuzz => "FizzBuzz".to_string(),
        FizzBuzz::Nombre(n) => n.to_string(),
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", en_texte(&fizz_buzz(i)));
    }
}
