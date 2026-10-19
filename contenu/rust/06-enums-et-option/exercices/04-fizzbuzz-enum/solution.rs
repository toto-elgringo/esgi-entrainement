#[derive(Debug, PartialEq)]
enum Reponse {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}

fn fizz_buzz(n: u32) -> Reponse {
    match n {
        i if i % 15 == 0 => Reponse::FizzBuzz,
        i if i % 3 == 0 => Reponse::Fizz,
        i if i % 5 == 0 => Reponse::Buzz,
        i => Reponse::Nombre(i),
    }
}

fn en_texte(valeur: &Reponse) -> String {
    match valeur {
        Reponse::Fizz => "Fizz".to_string(),
        Reponse::Buzz => "Buzz".to_string(),
        Reponse::FizzBuzz => "FizzBuzz".to_string(),
        Reponse::Nombre(n) => n.to_string(),
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", en_texte(&fizz_buzz(i)));
    }
}
