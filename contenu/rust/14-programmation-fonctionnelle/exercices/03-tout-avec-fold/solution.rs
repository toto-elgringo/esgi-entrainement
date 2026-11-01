fn somme_des_carres(nombres: &[i32]) -> i32 {
    nombres.iter().fold(0, |total, &x| total + x * x)
}

fn compter_voyelles(texte: &str) -> usize {
    texte
        .chars()
        .fold(0, |total, c| if "aeiouy".contains(c) { total + 1 } else { total })
}

fn inverser(texte: &str) -> String {
    texte.chars().fold(String::new(), |envers, c| format!("{c}{envers}"))
}

fn maximum(nombres: &[i32]) -> Option<i32> {
    nombres.iter().fold(None, |plus_grand, &x| match plus_grand {
        None => Some(x),
        Some(m) => Some(m.max(x)),
    })
}

fn moyenne(notes: &[f64]) -> Option<f64> {
    let (somme, nombre) = notes
        .iter()
        .fold((0.0, 0), |(somme, nombre), &note| (somme + note, nombre + 1));
    if nombre == 0 {
        None
    } else {
        Some(somme / f64::from(nombre))
    }
}

fn main() {
    println!("{}", somme_des_carres(&[1, 2, 3]));
    println!("{}", compter_voyelles("programmation"));
    println!("{}", inverser("rust"));
    println!("{:?}", maximum(&[3, -1, 8]));
    println!("{:?}", moyenne(&[12.0, 15.0, 9.0]));
}
