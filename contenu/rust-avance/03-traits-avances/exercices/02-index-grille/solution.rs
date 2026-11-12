use std::ops::{Index, IndexMut};

struct Grille {
    largeur: usize,
    hauteur: usize,
    cases: Vec<i32>,
}

impl Grille {
    fn new(largeur: usize, hauteur: usize) -> Grille {
        Grille { largeur, hauteur, cases: vec![0; largeur * hauteur] }
    }

    fn position(&self, (ligne, colonne): (usize, usize)) -> usize {
        assert!(ligne < self.hauteur && colonne < self.largeur, "hors de la grille");
        ligne * self.largeur + colonne
    }
}

impl Index<(usize, usize)> for Grille {
    type Output = i32;

    fn index(&self, position: (usize, usize)) -> &i32 {
        &self.cases[self.position(position)]
    }
}

impl IndexMut<(usize, usize)> for Grille {
    fn index_mut(&mut self, position: (usize, usize)) -> &mut i32 {
        let p = self.position(position);
        &mut self.cases[p]
    }
}

fn main() {
    let mut g = Grille::new(3, 2);
    g[(1, 2)] = 7;
    g[(0, 0)] += 5;
    println!("{} {}", g[(1, 2)], g[(0, 0)]);
}
