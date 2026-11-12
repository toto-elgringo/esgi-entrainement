macro_rules! calculer {
    ($a:tt plus $b:tt) => {
        $a + $b
    };
    ($a:tt moins $b:tt) => {
        $a - $b
    };
    ($a:tt fois $b:tt) => {
        $a * $b
    };
    ($a:tt diviser $b:tt) => {
        if $b == 0 { None } else { Some($a / $b) }
    };
}

fn main() {
    let n = 6;
    println!("{}", calculer!(2 plus 3));
    println!("{}", calculer!(n fois 7));
    println!("{:?}", calculer!(9 diviser 0));
}
