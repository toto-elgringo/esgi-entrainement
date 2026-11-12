struct Celsius(f64);

struct Fahrenheit(f64);

#[derive(Debug, PartialEq)]
struct Note(u8);

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Fahrenheit {
        todo!()
    }
}

impl TryFrom<i32> for Note {
    type Error = String;

    fn try_from(n: i32) -> Result<Note, String> {
        todo!()
    }
}

fn en_fahrenheit(c: Celsius) -> f64 {
    todo!()
}

fn main() {
    println!("{}", en_fahrenheit(Celsius(100.0)));
    println!("{:?}", Note::try_from(15));
    println!("{:?}", Note::try_from(25));
}
