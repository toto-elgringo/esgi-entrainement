fn compter_si(v: &[i32], condition: impl Fn(i32) -> bool) -> usize {
    let mut total = 0;
    for &x in v {
        if condition(x) {
            total += 1;
        }
    }
    total
}

fn nombre_de_positifs(v: &[i32]) -> usize {
    compter_si(v, |x| todo!())
}

fn nombre_de_pairs(v: &[i32]) -> usize {
    compter_si(v, |x| todo!())
}

fn nombre_superieurs_a(v: &[i32], seuil: i32) -> usize {
    compter_si(v, |x| todo!())
}

fn main() {
    println!("{}", nombre_de_positifs(&[-2, 0, 3, 5]));
    println!("{}", nombre_de_pairs(&[1, 2, 4, 7]));
    println!("{}", nombre_superieurs_a(&[1, 5, 10, 20], 6));
}
