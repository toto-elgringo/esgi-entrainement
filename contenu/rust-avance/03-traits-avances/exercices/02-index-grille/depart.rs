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
}

impl Index<(usize, usize)> for Grille {
    type Output = i32;

    fn index(&self, position: (usize, usize)) -> &i32 {
        todo!()
    }
}

impl IndexMut<(usize, usize)> for Grille {
    fn index_mut(&mut self, position: (usize, usize)) -> &mut i32 {
        todo!()
    }
}

fn main() {
    let mut g = Grille::new(3, 2);
    g[(1, 2)] = 7;
    g[(0, 0)] += 5;
    println!("{} {}", g[(1, 2)], g[(0, 0)]);
}
