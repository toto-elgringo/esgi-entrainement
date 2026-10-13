fn encadrer(mot: &str) -> String {
    let mut resultat = String::new();
    resultat.push('[');
    resultat.push_str(mot);
    resultat.push(']');
    resultat
}

fn repeter(mot: &str, n: usize) -> String {
    let mut resultat = String::new();
    for i in 0..n {
        if i > 0 {
            resultat.push('-');
        }
        resultat.push_str(mot);
    }
    resultat
}

fn presenter(nom: &str, age: u32) -> String {
    format!("{nom} a {age} ans")
}

fn main() {
    println!("{}", encadrer("rust"));
    println!("{}", repeter("ab", 3));
    println!("{}", presenter("Alice", 20));
}
