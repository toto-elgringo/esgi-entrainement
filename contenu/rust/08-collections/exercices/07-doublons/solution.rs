use std::collections::HashSet;

fn a_des_doublons(v: &[i32]) -> bool {
    let mut vus = HashSet::new();
    for x in v {
        if !vus.insert(*x) {
            return true;
        }
    }
    false
}

fn valeurs_uniques(v: &[i32]) -> usize {
    let mut uniques = HashSet::new();
    for x in v {
        uniques.insert(*x);
    }
    uniques.len()
}

fn elements_communs(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut dans_b = HashSet::new();
    for x in b {
        dans_b.insert(*x);
    }

    let mut communs = HashSet::new();
    for x in a {
        if dans_b.contains(x) {
            communs.insert(*x);
        }
    }

    let mut resultat = Vec::new();
    for x in communs {
        resultat.push(x);
    }
    resultat.sort();
    resultat
}

fn main() {
    println!("{}", a_des_doublons(&[1, 2, 3, 2]));
    println!("{}", valeurs_uniques(&[1, 1, 2, 3, 3, 3]));
    println!("{:?}", elements_communs(&[5, 1, 3, 3], &[3, 4, 5]));
}
