fn diviser(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err("division par zéro".to_string());
    }
    Ok(a / b)
}

fn main() {
    println!("{:?}", diviser(10, 2));
    println!("{:?}", diviser(1, 0));
}
