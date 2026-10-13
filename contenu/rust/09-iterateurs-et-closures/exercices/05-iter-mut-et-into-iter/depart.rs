fn augmenter_tous(v: &mut [u32], montant: u32) {
    for x in v.iter() {
        *x += montant;
    }
}

fn en_majuscules(mots: Vec<String>) -> Vec<String> {
    todo!()
}

fn noms_des_majeurs(personnes: Vec<(String, u32)>) -> Vec<String> {
    todo!()
}

fn main() {
    let mut prix = vec![10, 20];
    augmenter_tous(&mut prix, 5);
    println!("{:?}", prix);
}
