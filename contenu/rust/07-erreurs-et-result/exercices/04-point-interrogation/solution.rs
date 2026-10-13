use std::num::ParseIntError;

fn additionner(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn moyenne_de_trois(a: &str, b: &str, c: &str) -> Result<i32, ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    let z = c.parse::<i32>()?;
    Ok((x + y + z) / 3)
}

fn main() {
    println!("{:?}", additionner("2", "40"));
    println!("{:?}", additionner("2", "x"));
    println!("{:?}", moyenne_de_trois("10", "20", "30"));
}
