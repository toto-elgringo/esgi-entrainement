use std::slice;

fn couper_en_deux(t: &mut [i32], milieu: usize) -> (&mut [i32], &mut [i32]) {
    let longueur = t.len();
    let p = t.as_mut_ptr();
    assert!(milieu <= longueur);

    unsafe {
        (
            slice::from_raw_parts_mut(p, milieu),
            slice::from_raw_parts_mut(p.add(milieu), longueur - milieu),
        )
    }
}

fn main() {
    let mut t = [1, 2, 3, 4, 5];
    let (a, b) = couper_en_deux(&mut t, 2);
    a[0] = 10;
    b[0] = 30;
    println!("{:?}", t);
}
