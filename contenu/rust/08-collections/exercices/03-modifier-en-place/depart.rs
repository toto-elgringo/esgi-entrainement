fn doubler(v: &Vec<i32>) {
    for x in v {
        x *= 2;
    }
}

fn plafonner(v: &mut [i32], max: i32) {
    todo!()
}

fn ajouter_fin(v: &mut Vec<i32>, valeurs: &[i32]) {
    todo!()
}

fn main() {
    let mut v = vec![1, 2, 3];
    doubler(&mut v);
    println!("{:?}", v);
}
