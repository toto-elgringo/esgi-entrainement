struct PileFixe<T, const N: usize> {
    cases: [T; N],
    taille: usize,
}

impl<T, const N: usize> PileFixe<T, N> {
    fn depuis_tableau(cases: [T; N]) -> Self {
        Self { cases, taille: 0 }
    }

    #[must_use]
    fn empiler(&mut self, valeur: T) -> bool {
        if self.taille == N {
            return false;
        }
        self.cases[self.taille] = valeur;
        self.taille += 1;
        true
    }

    fn depiler(&mut self) -> Option<&T> {
        if self.taille == 0 {
            return None;
        }
        self.taille -= 1;
        Some(&self.cases[self.taille])
    }

    fn taille(&self) -> usize {
        self.taille
    }

    fn capacite(&self) -> usize {
        N
    }
}

fn main() {
    let mut octets = PileFixe::depuis_tableau([0u8; 3]);
    let _ = octets.empiler(b'a');
    println!("{:?}", octets.depiler());

    let mut mots = PileFixe::depuis_tableau([""; 4]);
    let _ = mots.empiler("rouille");
    let capacite = mots.capacite();
    println!("{:?} sur {capacite}", mots.depiler());
}
