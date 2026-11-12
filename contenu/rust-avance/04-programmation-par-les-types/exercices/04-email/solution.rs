#[derive(Debug, PartialEq)]
enum ErreurEmail {
    SansArobase,
    PartieVide,
    DomaineSansPoint,
}

#[derive(Debug, PartialEq)]
struct Email(String);

impl Email {
    fn new(texte: &str) -> Result<Email, ErreurEmail> {
        let (local, domaine) = texte.split_once('@').ok_or(ErreurEmail::SansArobase)?;
        if local.is_empty() || domaine.is_empty() {
            return Err(ErreurEmail::PartieVide);
        }
        if !domaine.contains('.') {
            return Err(ErreurEmail::DomaineSansPoint);
        }
        Ok(Email(texte.to_string()))
    }

    fn adresse(&self) -> &str {
        &self.0
    }

    fn domaine(&self) -> &str {
        self.0.split_once('@').map_or("", |(_, domaine)| domaine)
    }
}

fn main() {
    for texte in ["alice@ecole.fr", "alice.fr", "@ecole.fr", "alice@ecole"] {
        match Email::new(texte) {
            Ok(email) => println!("{} sur {}", email.adresse(), email.domaine()),
            Err(erreur) => println!("{texte} refusé : {erreur:?}"),
        }
    }
}
