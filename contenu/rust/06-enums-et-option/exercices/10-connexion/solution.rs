#[derive(Debug, PartialEq)]
enum Connexion {
    Deconnecte,
    EnCours { depuis_ms: u64 },
    Connecte { session: u64, pseudo: String },
}

impl Connexion {
    fn demarrer(self, maintenant_ms: u64) -> Connexion {
        match self {
            Connexion::Deconnecte => Connexion::EnCours {
                depuis_ms: maintenant_ms,
            },
            autre => autre,
        }
    }

    fn accepter(self, session: u64, pseudo: &str) -> Connexion {
        match self {
            Connexion::EnCours { .. } => Connexion::Connecte {
                session,
                pseudo: pseudo.to_string(),
            },
            autre => autre,
        }
    }

    fn deconnecter(self) -> Connexion {
        Connexion::Deconnecte
    }

    fn pseudo(&self) -> Option<&str> {
        match self {
            Connexion::Connecte { pseudo, .. } => Some(pseudo.as_str()),
            Connexion::Deconnecte | Connexion::EnCours { .. } => None,
        }
    }

    fn trop_longue(&self, maintenant_ms: u64, limite_ms: u64) -> bool {
        match self {
            Connexion::EnCours { depuis_ms } => maintenant_ms - *depuis_ms > limite_ms,
            Connexion::Deconnecte | Connexion::Connecte { .. } => false,
        }
    }
}

fn main() {
    let c = Connexion::Deconnecte.demarrer(1_000);
    println!("{c:?}, trop longue ? {}", c.trop_longue(7_000, 5_000));
    let c = c.accepter(42, "ferris");
    println!("{c:?}, pseudo : {:?}", c.pseudo());
    println!("{:?}", c.deconnecter());
}
