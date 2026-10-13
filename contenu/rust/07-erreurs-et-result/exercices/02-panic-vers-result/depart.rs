fn diviser(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("division par zéro");
    }
    a / b
}

fn main() {
    println!("{}", diviser(10, 2));
    println!("{}", diviser(1, 0));
}
