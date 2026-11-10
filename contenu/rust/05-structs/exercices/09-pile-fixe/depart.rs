struct PileFixe3 {
    cases: [u8; 3],
    taille: usize,
}

impl PileFixe3 {
    fn new() -> Self {
        todo!()
    }

    #[must_use]
    fn empiler(&mut self, valeur: u8) -> bool {
        todo!()
    }

    fn depiler(&mut self) -> Option<u8> {
        todo!()
    }

    fn taille(&self) -> usize {
        todo!()
    }

    fn est_vide(&self) -> bool {
        todo!()
    }

    fn sommet(&self) -> Option<&u8> {
        todo!()
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
