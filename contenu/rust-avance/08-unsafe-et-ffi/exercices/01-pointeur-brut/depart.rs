fn lire(x: &i32) -> i32 {
    todo!()
}

fn ecrire(x: &mut i32, valeur: i32) {
    todo!()
}

fn main() {
    let mut n = 5;
    println!("{}", lire(&n));
    ecrire(&mut n, 9);
    println!("{}", n);
}
