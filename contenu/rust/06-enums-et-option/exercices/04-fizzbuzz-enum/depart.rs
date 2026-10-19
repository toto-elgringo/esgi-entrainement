#[derive(Debug, PartialEq)]
enum Reponse {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}

fn fizz_buzz(n: u32) -> Reponse {
    todo!()
}

fn en_texte(valeur: &Reponse) -> String {
    todo!()
}

fn main() {
    for i in 1..=15 {
        println!("{}", en_texte(&fizz_buzz(i)));
    }
}
