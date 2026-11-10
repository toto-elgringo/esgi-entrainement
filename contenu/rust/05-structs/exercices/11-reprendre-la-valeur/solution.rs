struct PileFixe<T, const N: usize> {
    cases: [Option<T>; N],
    taille: usize,
}

impl<T, const N: usize> PileFixe<T, N> {
    fn new() -> Self {
        Self {
            cases: std::array::from_fn(|_| None),
            taille: 0,
        }
    }

    #[must_use]
    fn empiler(&mut self, valeur: T) -> bool {
        if self.taille == N {
            return false;
        }
        self.cases[self.taille] = Some(valeur);
        self.taille += 1;
        true
    }

    fn depiler(&mut self) -> Option<T> {
        if self.taille == 0 {
            return None;
        }
        self.taille -= 1;
        self.cases[self.taille].take()
    }

    fn sommet(&self) -> Option<&T> {
        if self.taille == 0 {
            return None;
        }
        self.cases[self.taille - 1].as_ref()
    }

    fn taille(&self) -> usize {
        self.taille
    }
}

fn main() {
    let mut pile: PileFixe<String, 3> = PileFixe::new();
    let _ = pile.empiler("crabe".to_string());
    let _ = pile.empiler("ferris".to_string());
    println!("sommet : {:?}", pile.sommet());
    let mot = pile.depiler();
    println!("récupéré : {mot:?}, il reste {}", pile.taille());
}
