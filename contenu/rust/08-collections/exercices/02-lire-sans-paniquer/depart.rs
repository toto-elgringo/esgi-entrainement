fn element_ou_zero(v: &[i32], i: usize) -> i32 {
    v[i]
}

fn premier_et_dernier(v: &[i32]) -> Option<(i32, i32)> {
    Some((v[0], v[v.len() - 1]))
}

fn main() {
    println!("{}", element_ou_zero(&[10, 20, 30], 1));
    println!("{:?}", premier_et_dernier(&[5, 6, 7]));
}
