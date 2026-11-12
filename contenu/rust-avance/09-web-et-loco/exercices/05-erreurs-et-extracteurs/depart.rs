use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
struct Reponse {
    statut: u16,
    corps: String,
}

impl Reponse {
    fn new(statut: u16, corps: &str) -> Self {
        Reponse {
            statut,
            corps: corps.to_string(),
        }
    }
}

#[derive(Debug, PartialEq)]
enum ErreurWeb {
    Introuvable,
    Invalide(String),
}

#[derive(Debug, PartialEq)]
struct IdUtilisateur(u32);

impl From<ParseIntError> for ErreurWeb {
    fn from(erreur: ParseIntError) -> Self {
        todo!()
    }
}

impl TryFrom<&str> for IdUtilisateur {
    type Error = ErreurWeb;

    fn try_from(texte: &str) -> Result<Self, ErreurWeb> {
        todo!()
    }
}

impl From<ErreurWeb> for Reponse {
    fn from(erreur: ErreurWeb) -> Self {
        todo!()
    }
}

fn afficher_utilisateur(texte: &str, base: &[(u32, &str)]) -> Result<Reponse, ErreurWeb> {
    todo!()
}

fn repondre(resultat: Result<Reponse, ErreurWeb>) -> Reponse {
    todo!()
}

fn main() {
    let base = [(1, "Alice"), (2, "Bob")];
    for entree in ["1", "9", "abc"] {
        println!("{:?}", repondre(afficher_utilisateur(entree, &base)));
    }
}
