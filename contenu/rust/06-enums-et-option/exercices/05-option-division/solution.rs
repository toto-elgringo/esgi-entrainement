fn diviser(a: i32, b: i32) -> Option<i32> {
    if b == 0 { None } else { Some(a / b) }
}

fn diviser_ou_zero(a: i32, b: i32) -> i32 {
    diviser(a, b).unwrap_or(0)
}

fn premiere_lettre(mot: &str) -> Option<char> {
    mot.chars().next()
}

fn main() {
    println!("{:?}", diviser(10, 2));
    println!("{:?}", diviser(7, 0));
    println!("{}", diviser_ou_zero(7, 0));
    println!("{:?}", premiere_lettre("Rust"));
}
