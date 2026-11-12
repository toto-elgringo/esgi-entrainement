struct Noeud {
    valeur: i32,
    gauche: Arbre,
    droite: Arbre,
}

type Arbre = Option<Box<Noeud>>;

fn inserer(arbre: Arbre, valeur: i32) -> Arbre {
    match arbre {
        None => Some(Box::new(Noeud {
            valeur,
            gauche: None,
            droite: None,
        })),
        Some(mut noeud) => {
            if valeur < noeud.valeur {
                noeud.gauche = inserer(noeud.gauche.take(), valeur);
            } else if valeur > noeud.valeur {
                noeud.droite = inserer(noeud.droite.take(), valeur);
            }
            Some(noeud)
        }
    }
}

fn contient(arbre: &Arbre, valeur: i32) -> bool {
    match arbre {
        None => false,
        Some(noeud) => {
            if valeur == noeud.valeur {
                true
            } else if valeur < noeud.valeur {
                contient(&noeud.gauche, valeur)
            } else {
                contient(&noeud.droite, valeur)
            }
        }
    }
}

fn hauteur(arbre: &Arbre) -> usize {
    match arbre {
        None => 0,
        Some(noeud) => 1 + hauteur(&noeud.gauche).max(hauteur(&noeud.droite)),
    }
}

fn en_ordre(arbre: &Arbre) -> Vec<i32> {
    match arbre {
        None => Vec::new(),
        Some(noeud) => {
            let mut resultat = en_ordre(&noeud.gauche);
            resultat.push(noeud.valeur);
            resultat.extend(en_ordre(&noeud.droite));
            resultat
        }
    }
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
