fn contient_negatif(v: &[i32]) -> bool {
    v.iter().any(|x| *x < 0)
}

fn tous_majeurs(ages: &[u32]) -> bool {
    ages.iter().all(|age| *age >= 18)
}

fn premier_multiple(v: &[u32], diviseur: u32) -> Option<u32> {
    v.iter().copied().find(|x| x % diviseur == 0)
}

fn position_premier_mot_long(mots: &[&str], taille: usize) -> Option<usize> {
    mots.iter().position(|mot| mot.len() >= taille)
}

fn main() {
    println!("{}", contient_negatif(&[3, -1, 4]));
    println!("{}", tous_majeurs(&[18, 40, 17]));
    println!("{:?}", premier_multiple(&[5, 9, 12, 18], 3));
    println!("{:?}", position_premier_mot_long(&["a", "abc", "abcd"], 3));
}
