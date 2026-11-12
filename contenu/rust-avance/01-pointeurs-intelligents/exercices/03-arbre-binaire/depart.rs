struct Noeud {
    valeur: i32,
    gauche: Arbre,
    droite: Arbre,
}

type Arbre = Option<Box<Noeud>>;

fn inserer(arbre: Arbre, valeur: i32) -> Arbre {
    todo!()
}

fn contient(arbre: &Arbre, valeur: i32) -> bool {
    todo!()
}

fn hauteur(arbre: &Arbre) -> usize {
    todo!()
}

fn en_ordre(arbre: &Arbre) -> Vec<i32> {
    todo!()
}

fn main() {
    let mut arbre: Arbre = None;
    for valeur in [50, 30, 70, 20, 40] {
        arbre = inserer(arbre, valeur);
    }
    println!("hauteur : {}", hauteur(&arbre));
    println!("en ordre : {:?}", en_ordre(&arbre));
    println!("contient 40 : {}", contient(&arbre, 40));
}
