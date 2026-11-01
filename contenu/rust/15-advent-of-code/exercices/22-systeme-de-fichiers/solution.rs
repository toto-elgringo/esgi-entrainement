use std::collections::HashMap;
use std::io::Read;

const EXEMPLE: &str = "$ cd /
$ ls
dir docs
21534770 film.mkv
dir jeux
1200 lisezmoi.txt
dir musique
$ cd docs
$ ls
dir archives
45210 cv.pdf
8320 lettre.odt
$ cd archives
$ ls
12002 budget.ods
30125 notes.md
$ cd ..
$ cd ..
$ cd jeux
$ ls
dir archives
4321987 course.iso
9876543 echecs.bin
$ cd archives
$ ls
64000 partie.sav
$ cd ..
$ cd ..
$ cd musique
$ ls
6214775 album.flac
3210440 radio.mp3";

fn tailles_des_dossiers(entree: &str) -> HashMap<String, u64> {
    let mut chemin: Vec<&str> = Vec::new();
    let mut tailles: HashMap<String, u64> = HashMap::new();
    for ligne in entree.lines() {
        let mots: Vec<&str> = ligne.split_whitespace().collect();
        match mots.as_slice() {
            ["$", "cd", "/"] => chemin.clear(),
            ["$", "cd", ".."] => {
                chemin.pop();
            }
            ["$", "cd", nom] => chemin.push(nom),
            [taille, _] => {
                if let Ok(taille) = taille.parse::<u64>() {
                    for profondeur in 0..=chemin.len() {
                        let dossier = format!("/{}", chemin[..profondeur].join("/"));
                        *tailles.entry(dossier).or_default() += taille;
                    }
                }
            }
            _ => {}
        }
    }
    tailles
}

fn partie1(entree: &str) -> u64 {
    tailles_des_dossiers(entree).values().filter(|&&taille| taille <= 100_000).sum()
}

fn partie2(entree: &str) -> u64 {
    let tailles = tailles_des_dossiers(entree);
    let occupe = tailles.get("/").copied().unwrap_or(0);
    let libre = 70_000_000u64.saturating_sub(occupe);
    let a_liberer = 30_000_000u64.saturating_sub(libre);
    tailles.values().copied().filter(|&taille| taille >= a_liberer).min().unwrap_or(0)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
