fn tronquer(s: &str, octets: usize) -> &str {
    &s[..octets]
}

fn main() {
    println!("{}", tronquer("Hello, 🦀", 8));
}
