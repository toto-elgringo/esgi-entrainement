fn additionneur(x: i32) -> impl Fn(i32) -> i32 {
    todo!()
}

fn multiplieur(x: i32) -> impl Fn(i32) -> i32 {
    todo!()
}

fn main() {
    let ajouter_dix = additionneur(10);
    let fois_trois = multiplieur(3);
    println!("{}", ajouter_dix(5));
    println!("{}", fois_trois(5));
}
