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
    fn from(_: ParseIntError) -> Self {
        ErreurWeb::Invalide("identifiant invalide".to_string())
    }
}

impl TryFrom<&str> for IdUtilisateur {
    type Error = ErreurWeb;

    fn try_from(texte: &str) -> Result<Self, ErreurWeb> {
        let numero = texte.parse::<u32>()?;
        Ok(IdUtilisateur(numero))
    }
}

impl From<ErreurWeb> for Reponse {
    fn from(erreur: ErreurWeb) -> Self {
        match erreur {
            ErreurWeb::Introuvable => Reponse::new(404, "introuvable"),
            ErreurWeb::Invalide(message) => Reponse::new(400, &message),
        }
    }
}

fn afficher_utilisateur(texte: &str, base: &[(u32, &str)]) -> Result<Reponse, ErreurWeb> {
    let id = IdUtilisateur::try_from(texte)?;
    let (_, nom) = base
        .iter()
        .find(|(numero, _)| *numero == id.0)
        .ok_or(ErreurWeb::Introuvable)?;
    Ok(Reponse::new(200, &format!("utilisateur {nom}")))
}

fn repondre(resultat: Result<Reponse, ErreurWeb>) -> Reponse {
    resultat.unwrap_or_else(Reponse::from)
}

fn main() {
    let base = [(1, "Alice"), (2, "Bob")];
    for entree in ["1", "9", "abc"] {
        println!("{:?}", repondre(afficher_utilisateur(entree, &base)));
    }
}
