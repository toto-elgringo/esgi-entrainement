fn main() {
    for texte in ["12", "abc", "-5", ""] {
        let nombre: i32 = texte.parse().unwrap();
        println!("{:?} -> nombre {}", texte, nombre);
    }
}
