fn main() {
    for texte in ["12", "abc", "-5", ""] {
        match texte.parse::<i32>() {
            Ok(nombre) => println!("{texte:?} -> nombre {nombre}"),
            Err(erreur) => println!("{texte:?} -> erreur : {erreur}"),
        }
    }
}
