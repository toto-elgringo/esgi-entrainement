macro_rules! voir {
    ($($e:expr),+ $(,)?) => {
        $(
            println!("{} = {:?}", stringify!($e), $e);
        )+
    };
}

fn main() {
    let x = 5;
    let nom = "Ada";
    voir!(x, x * 2 + 1, nom, x > 3);
}
