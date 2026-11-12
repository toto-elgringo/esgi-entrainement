use std::fmt::{self, Display};

struct Liste(Vec<String>);

trait Resumer {
    fn resume(&self) -> String;
}

impl Display for Liste {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

fn main() {
    let liste = Liste(vec!["a".to_string(), "b".to_string()]);
    println!("{}", liste);
}
