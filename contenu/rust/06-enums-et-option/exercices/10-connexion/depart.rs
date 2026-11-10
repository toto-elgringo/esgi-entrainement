#[derive(Debug, PartialEq)]
enum Connexion {
    Deconnecte,
    EnCours { depuis_ms: u64 },
    Connecte { session: u64, pseudo: String },
}

impl Connexion {
    fn demarrer(self, maintenant_ms: u64) -> Connexion {
        todo!()
    }

    fn accepter(self, session: u64, pseudo: &str) -> Connexion {
        todo!()
    }

    fn deconnecter(self) -> Connexion {
        todo!()
    }

    fn pseudo(&self) -> Option<&str> {
        todo!()
    }

    fn trop_longue(&self, maintenant_ms: u64, limite_ms: u64) -> bool {
        todo!()
    }
}

fn main() {
    let c = Connexion::Deconnecte.demarrer(1_000);
    println!("{c:?}, trop longue ? {}", c.trop_longue(7_000, 5_000));
    let c = c.accepter(42, "ferris");
    println!("{c:?}, pseudo : {:?}", c.pseudo());
    println!("{:?}", c.deconnecter());
}
