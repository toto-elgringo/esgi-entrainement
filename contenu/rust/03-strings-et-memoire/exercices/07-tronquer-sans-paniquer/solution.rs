fn tronquer(s: &str, octets: usize) -> &str {
    if octets >= s.len() {
        return s;
    }
    let mut fin = octets;
    while !s.is_char_boundary(fin) {
        fin -= 1;
    }
    &s[..fin]
}

fn main() {
    println!("{}", tronquer("Hello, 🦀", 8));
}
