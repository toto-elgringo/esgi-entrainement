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

fn partie1(entree: &str) -> u64 {
    todo!()
}

fn partie2(entree: &str) -> u64 {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
