fn doubler(v: &mut [i32]) {
    for x in v {
        *x *= 2;
    }
}

fn plafonner(v: &mut [i32], max: i32) {
    for x in v {
        if *x > max {
            *x = max;
        }
    }
}

fn ajouter_fin(v: &mut Vec<i32>, valeurs: &[i32]) {
    for x in valeurs {
        v.push(*x);
    }
}

fn main() {
    let mut v = vec![1, 2, 3];
    doubler(&mut v);
    println!("{:?}", v);
}
