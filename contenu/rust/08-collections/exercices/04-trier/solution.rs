fn trier_sans_doublons(mut v: Vec<i32>) -> Vec<i32> {
    v.sort();
    v.dedup();
    v
}

fn trois_plus_grands(v: &[u32]) -> Vec<u32> {
    let mut copie = v.to_vec();
    copie.sort();
    copie.reverse();
    copie.truncate(3);
    copie
}

fn ordre_alphabetique(mut mots: Vec<&str>) -> Vec<&str> {
    mots.sort();
    mots
}

fn main() {
    println!("{:?}", trier_sans_doublons(vec![3, 1, 3, 2, 1]));
    println!("{:?}", trois_plus_grands(&[5, 1, 9, 7, 3]));
    println!("{:?}", ordre_alphabetique(vec!["poire", "abricot", "mangue"]));
}
