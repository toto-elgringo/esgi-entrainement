struct PileFixe3 {
    cases: [u8; 3],
    taille: usize,
}

impl PileFixe3 {
    fn new() -> Self {
        Self {
            cases: [0; 3],
            taille: 0,
        }
    }

    #[must_use]
    fn empiler(&mut self, valeur: u8) -> bool {
        if self.taille == 3 {
            return false;
        }
        self.cases[self.taille] = valeur;
        self.taille += 1;
        true
    }

    fn depiler(&mut self) -> Option<u8> {
        if self.taille == 0 {
            return None;
        }
        self.taille -= 1;
        Some(self.cases[self.taille])
    }

    fn taille(&self) -> usize {
        self.taille
    }
}

fn main() {
    let mut pile = PileFixe3::new();
    let _ = pile.empiler(b'a');
    println!("{:?}", pile.depiler());
}
