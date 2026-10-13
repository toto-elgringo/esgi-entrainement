fn premier_qui_commence_par<'a>(mots: &[&'a str], prefixe: &str) -> Option<&'a str> {
    mots.iter().find(|mot| mot.starts_with(prefixe)).copied()
}

fn main() {
    let mots = ["pomme", "poire", "banane"];
    println!("{:?}", premier_qui_commence_par(&mots, "po"));
    println!("{:?}", premier_qui_commence_par(&mots, "ki"));
}
