use std::io::Read;

const EXEMPLE: &str = "+mul(3,4)*mul(10 ,2)%don't()_mul(5,5)?mul(2,3]
where(do()mul(100,2)from()mul(1234,1)what()mul(7,7)#don't()
xmul(6,6)'do(mul(1,9)do()]mul(4,6)";

fn partie1(entree: &str) -> u64 {
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
