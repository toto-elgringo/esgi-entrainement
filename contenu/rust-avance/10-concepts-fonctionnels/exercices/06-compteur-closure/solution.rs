fn compteur(depart: i32, pas: i32) -> impl FnMut() -> i32 {
    let mut courant = depart;
    move || {
        let valeur = courant;
        courant += pas;
        valeur
    }
}

fn main() {
    let mut c = compteur(10, 5);
    println!("{}", c());
    println!("{}", c());
    println!("{}", c());

    let mut d = compteur(0, 1);
    println!("{}", d());
    println!("{}", c());
}
