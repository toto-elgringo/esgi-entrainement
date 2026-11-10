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

    fn est_vide(&self) -> bool {
        self.taille == 0
    }

    fn sommet(&self) -> Option<&u8> {
        if self.taille == 0 {
            None
        } else {
            Some(&self.cases[self.taille - 1])
        }
    }
}

fn main() {
    let mut pile = PileFixe3::new();
    let _ = pile.empiler(b'a');
    let _ = pile.empiler(b'b');
    println!("sommet : {:?}", pile.sommet());
    println!("dépilé : {:?}", pile.depiler());
    println!("taille : {}", pile.taille());
}
