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
        todo!()
    }

    fn adresse(&self) -> &str {
        todo!()
    }

    fn domaine(&self) -> &str {
        todo!()
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
