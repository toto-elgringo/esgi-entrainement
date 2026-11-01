use std::io::Read;

const EXEMPLE: &str = "noop
addx 5
noop
addx 1
addx 4
addx -1
addx 3
addx 3
addx 4
addx -3
addx 8
addx -3
addx 6
addx -1
addx 4
addx -2
addx 5
addx 2
addx 1
noop
addx -36
addx 3
addx -2
addx 5
addx 3
addx 1
addx 3
addx -3
addx 4
addx 4
addx 10
addx -2
addx -5
addx 2
addx 5
addx 2
addx -3
addx 4
addx 2
addx 1
noop
addx -35
addx 1
addx 1
addx 3
noop
addx 6
addx 1
addx -1
addx 4
addx 4
addx 3
addx -4
addx 4
addx 2
addx 5
addx 2
addx 3
addx -2
addx 4
noop
addx -5
addx -32
addx 5
addx -4
addx 5
addx 1
addx 3
noop
noop
addx 7
addx 2
addx -1
addx 1
noop
addx 4
addx 2
addx 5
addx 2
addx -4
addx 5
addx 2
addx 1
noop
addx -36
addx 5
addx -2
addx 3
addx 1
addx 3
noop
addx 7
noop
addx 2
noop
addx 3
addx -2
addx 3
addx 2
addx 5
addx 2
addx -2
addx 3
addx 2
addx 1
addx -36
addx 3
addx 6
addx -3
addx 1
noop
addx 4
addx 2
noop
addx 2
addx 5
addx 3
addx -1
addx 5
addx 1
addx -1
addx 8
addx -2
addx -1
addx 4
addx 2
addx -1
noop";

fn partie1(entree: &str) -> i32 {
    todo!()
}

fn partie2(entree: &str) -> String {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 :\n{}", partie2(entree));
}
