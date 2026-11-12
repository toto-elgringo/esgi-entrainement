use std::fmt::{self, Display};

struct Liste(Vec<String>);

trait Resumer {
    fn resume(&self) -> String;
}

impl Display for Liste {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

impl<T: Display> Resumer for T {
    fn resume(&self) -> String {
        format!("<{}>", self)
    }
}

fn main() {
    let liste = Liste(vec!["a".to_string(), "b".to_string()]);
    println!("{}", liste);
    println!("{}", liste.resume());
    println!("{}", 42_i32.resume());
}
