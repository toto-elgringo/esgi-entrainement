use std::num::ParseIntError;

fn additionner(a: &str, b: &str) -> Result<i32, ParseIntError> {
    todo!()
}

fn moyenne_de_trois(a: &str, b: &str, c: &str) -> Result<i32, ParseIntError> {
    todo!()
}

fn main() {
    println!("{:?}", additionner("2", "40"));
    println!("{:?}", additionner("2", "x"));
    println!("{:?}", moyenne_de_trois("10", "20", "30"));
}
