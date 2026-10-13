fn dupliquer_le_premier(v: &mut Vec<i32>) -> i32 {
    let premier = v[0];
    v.push(premier);
    premier
}

fn ajouter_les_doubles(v: &mut Vec<i32>) {
    let n = v.len();
    for i in 0..n {
        let x = v[i];
        v.push(x * 2);
    }
}

fn main() {
    let mut nombres = vec![1, 2, 3];
    let premier = dupliquer_le_premier(&mut nombres);
    println!("{premier} {nombres:?}");

    let mut autres = vec![1, 2, 3];
    ajouter_les_doubles(&mut autres);
    println!("{autres:?}");
}
