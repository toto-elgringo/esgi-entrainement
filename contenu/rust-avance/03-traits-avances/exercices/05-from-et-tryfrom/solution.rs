struct Celsius(f64);

struct Fahrenheit(f64);

#[derive(Debug, PartialEq)]
struct Note(u8);

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Fahrenheit {
        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
    }
}

impl TryFrom<i32> for Note {
    type Error = String;

    fn try_from(n: i32) -> Result<Note, String> {
        if (0..=20).contains(&n) {
            Ok(Note(n as u8))
        } else {
            Err(format!("note invalide : {}", n))
        }
    }
}

fn en_fahrenheit(c: Celsius) -> f64 {
    let f: Fahrenheit = c.into();
    f.0
}

fn main() {
    println!("{}", en_fahrenheit(Celsius(100.0)));
    println!("{:?}", Note::try_from(15));
    println!("{:?}", Note::try_from(25));
}
