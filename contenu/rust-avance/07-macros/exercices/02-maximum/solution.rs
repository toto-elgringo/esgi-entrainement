macro_rules! maximum {
    ($x:expr) => {
        $x
    };
    ($x:expr, $($reste:expr),+) => {{
        let a = $x;
        let b = maximum!($($reste),+);
        if a > b { a } else { b }
    }};
}

fn main() {
    println!("{}", maximum!(7));
    println!("{}", maximum!(4, 9, 2, 6));
}
