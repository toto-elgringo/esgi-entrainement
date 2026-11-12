use std::marker::PhantomData;

struct Fermee;
struct Ouverte;

struct Connexion<Etat> {
    adresse: String,
    envoyes: Vec<String>,
    etat: PhantomData<Etat>,
}

impl Connexion<Fermee> {
    fn nouvelle(adresse: &str) -> Connexion<Fermee> {
        Connexion {
            adresse: adresse.to_string(),
            envoyes: Vec::new(),
            etat: PhantomData,
        }
    }

    fn ouvrir(self) -> Connexion<Ouverte> {
        Connexion {
            adresse: self.adresse,
            envoyes: self.envoyes,
            etat: PhantomData,
        }
    }
}

impl Connexion<Ouverte> {
    fn envoyer(&mut self, message: &str) -> usize {
        self.envoyes.push(message.to_string());
        self.envoyes.len()
    }

    fn fermer(self) -> Connexion<Fermee> {
        Connexion {
            adresse: self.adresse,
            envoyes: self.envoyes,
            etat: PhantomData,
        }
    }
}

impl<Etat> Connexion<Etat> {
    fn adresse(&self) -> &str {
        &self.adresse
    }

    fn nombre_envoyes(&self) -> usize {
        self.envoyes.len()
    }
}

fn main() {
    let connexion = Connexion::nouvelle("serveur:80");
    println!("{} : {} message(s)", connexion.adresse(), connexion.nombre_envoyes());
    let mut connexion = connexion.ouvrir();
    println!("envoyés : {}", connexion.envoyer("salut"));
    println!("envoyés : {}", connexion.envoyer("au revoir"));
    let connexion = connexion.fermer();
    println!("{} : {} message(s)", connexion.adresse(), connexion.nombre_envoyes());
}
