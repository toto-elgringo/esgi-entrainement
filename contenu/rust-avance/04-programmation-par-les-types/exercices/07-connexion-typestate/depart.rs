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
        todo!()
    }

    fn ouvrir(self) -> Connexion<Ouverte> {
        todo!()
    }
}

impl Connexion<Ouverte> {
    fn envoyer(&mut self, message: &str) -> usize {
        todo!()
    }

    fn fermer(self) -> Connexion<Fermee> {
        todo!()
    }
}

impl<Etat> Connexion<Etat> {
    fn adresse(&self) -> &str {
        todo!()
    }

    fn nombre_envoyes(&self) -> usize {
        todo!()
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
