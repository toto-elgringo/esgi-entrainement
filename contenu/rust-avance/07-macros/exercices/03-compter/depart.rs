macro_rules! compter {
    () => {
        todo!()
    };
}

fn main() {
    println!("{}", compter!());
    println!("{}", compter!(a b c));
}
