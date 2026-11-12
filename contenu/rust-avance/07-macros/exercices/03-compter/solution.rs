macro_rules! compter {
    () => {
        0usize
    };
    ($premier:tt $($reste:tt)*) => {
        1usize + compter!($($reste)*)
    };
}

fn main() {
    println!("{}", compter!());
    println!("{}", compter!(a b c));
}
