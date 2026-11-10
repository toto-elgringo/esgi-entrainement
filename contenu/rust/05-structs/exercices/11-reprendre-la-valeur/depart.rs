struct PileFixe<T, const N: usize> {
    cases: [Option<T>; N],
    taille: usize,
}

impl<T, const N: usize> PileFixe<T, N> {
    fn new() -> Self {
        todo!()
    }

    #[must_use]
    fn empiler(&mut self, valeur: T) -> bool {
        todo!()
    }

    fn depiler(&mut self) -> Option<T> {
        todo!()
    }

    fn sommet(&self) -> Option<&T> {
        todo!()
    }

    fn taille(&self) -> usize {
        todo!()
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
