fn construire() -> String {
    let mut s = String::from("Hello");
    let r1 = &mut s;
    let r2 = &mut s;
    r1.push_str(", World");
    r2.push('!');
    s
}

fn main() {
    println!("{}", construire());
}
