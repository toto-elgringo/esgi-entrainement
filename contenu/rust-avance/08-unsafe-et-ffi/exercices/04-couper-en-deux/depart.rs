use std::slice;

fn couper_en_deux(t: &mut [i32], milieu: usize) -> (&mut [i32], &mut [i32]) {
    todo!()
}

fn main() {
    let mut t = [1, 2, 3, 4, 5];
    let (a, b) = couper_en_deux(&mut t, 2);
    a[0] = 10;
    b[0] = 30;
    println!("{:?}", t);
}
