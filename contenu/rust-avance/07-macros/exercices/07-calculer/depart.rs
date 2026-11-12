macro_rules! calculer {
    ($a:tt plus $b:tt) => {
        todo!()
    };
}

fn main() {
    let n = 6;
    println!("{}", calculer!(2 plus 3));
    println!("{}", calculer!(n fois 7));
    println!("{:?}", calculer!(9 diviser 0));
}
