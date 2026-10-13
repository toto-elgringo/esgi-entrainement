fn contient_negatif(v: &[i32]) -> bool {
    todo!()
}

fn tous_majeurs(ages: &[u32]) -> bool {
    todo!()
}

fn premier_multiple(v: &[u32], diviseur: u32) -> Option<u32> {
    todo!()
}

fn position_premier_mot_long(mots: &[&str], taille: usize) -> Option<usize> {
    todo!()
}

fn main() {
    println!("{}", contient_negatif(&[3, -1, 4]));
    println!("{}", tous_majeurs(&[18, 40, 17]));
    println!("{:?}", premier_multiple(&[5, 9, 12, 18], 3));
    println!("{:?}", position_premier_mot_long(&["a", "abc", "abcd"], 3));
}
