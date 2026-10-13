fn premier_qui_commence_par(mots: &[&str], prefixe: &str) -> Option<&str> {
    todo!()
}

fn main() {
    let mots = ["pomme", "poire", "banane"];
    println!("{:?}", premier_qui_commence_par(&mots, "po"));
    println!("{:?}", premier_qui_commence_par(&mots, "ki"));
}
