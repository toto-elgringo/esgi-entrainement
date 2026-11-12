fn lire(x: &i32) -> i32 {
    let p = x as *const i32;
    unsafe { *p }
}

fn ecrire(x: &mut i32, valeur: i32) {
    let p = x as *mut i32;
    unsafe {
        *p = valeur;
    }
}

fn main() {
    let mut n = 5;
    println!("{}", lire(&n));
    ecrire(&mut n, 9);
    println!("{}", n);
}
