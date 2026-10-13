fn element_ou_zero(v: &[i32], i: usize) -> i32 {
    match v.get(i) {
        Some(x) => *x,
        None => 0,
    }
}

fn premier_et_dernier(v: &[i32]) -> Option<(i32, i32)> {
    match (v.first(), v.last()) {
        (Some(premier), Some(dernier)) => Some((*premier, *dernier)),
        _ => None,
    }
}

fn main() {
    println!("{}", element_ou_zero(&[10, 20, 30], 1));
    println!("{:?}", premier_et_dernier(&[5, 6, 7]));
}
