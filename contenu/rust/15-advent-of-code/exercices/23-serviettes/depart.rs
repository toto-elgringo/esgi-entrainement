use std::io::Read;

const EXEMPLE: &str = "w, u, g, bw, rg, ub, gru, wr, bwu

bwrg
ubwu
grub
wrgu
ugrug
bbw
ubwrgu
gwubwu
wrgruwbw";

fn partie1(entree: &str) -> usize {
    todo!()
}

fn partie2(entree: &str) -> u64 {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
