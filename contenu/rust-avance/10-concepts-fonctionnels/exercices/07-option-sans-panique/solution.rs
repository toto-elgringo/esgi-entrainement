fn initiale(mots: &[&str], position: usize) -> String {
    mots.get(position)
        .and_then(|mot| mot.chars().next())
        .map(|lettre| lettre.to_uppercase().to_string())
        .unwrap_or_else(|| "?".to_string())
}

fn inverse(x: f64) -> Option<f64> {
    if x == 0.0 { None } else { Some(1.0 / x) }
}

fn inverse_de_inverse_plus_un(x: f64) -> Option<f64> {
    inverse(x).and_then(inverse).map(|y| y + 1.0)
}

fn main() {
    println!("{}", initiale(&["rust", "cargo"], 1));
    println!("{}", initiale(&["rust"], 5));
    println!("{:?}", inverse_de_inverse_plus_un(4.0));
    println!("{:?}", inverse_de_inverse_plus_un(0.0));
}
