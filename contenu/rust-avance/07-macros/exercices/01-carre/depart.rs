macro_rules! carre {
    ($x:expr) => {
        todo!()
    };
}

fn main() {
    let cote = 7;
    println!("Le carré de {} vaut {}", cote, carre!(cote));
    println!("{}", carre!(2 + 3));
}
