fn carres(v: &[i32]) -> Vec<i32> {
    v.iter().map(|x| x * x).collect()
}

fn seulement_pairs(v: &[i32]) -> Vec<i32> {
    v.iter().copied().filter(|x| x % 2 == 0).collect()
}

fn longueurs(mots: &[&str]) -> Vec<usize> {
    mots.iter().map(|mot| mot.len()).collect()
}

fn main() {
    println!("{:?}", carres(&[1, 2, 3]));
    println!("{:?}", seulement_pairs(&[1, 2, 3, 4, 6]));
    println!("{:?}", longueurs(&["a", "rust", "ok"]));
}
