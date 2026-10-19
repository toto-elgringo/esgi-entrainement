fn plus_grand<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

fn plus_grand_de_la_liste<T: PartialOrd + Copy>(liste: &[T]) -> Option<T> {
    let mut resultat = *liste.first()?;
    for &element in liste {
        if element > resultat {
            resultat = element;
        }
    }
    Some(resultat)
}

fn main() {
    println!("{}", plus_grand(3, 7));
    println!("{:?}", plus_grand_de_la_liste(&[3, 9, 2]));
}
