fn augmenter_tous(v: &mut [u32], montant: u32) {
    for x in v.iter_mut() {
        *x += montant;
    }
}

fn en_majuscules(mots: Vec<String>) -> Vec<String> {
    mots.into_iter().map(|mot| mot.to_uppercase()).collect()
}

fn noms_des_majeurs(personnes: Vec<(String, u32)>) -> Vec<String> {
    personnes
        .into_iter()
        .filter(|(_, age)| *age >= 18)
        .map(|(nom, _)| nom)
        .collect()
}

fn main() {
    let mut prix = vec![10, 20];
    augmenter_tous(&mut prix, 5);
    println!("{:?}", prix);
}
