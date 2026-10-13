fn changer_derniere_lettre(s: &mut String) {
    if s.pop().is_some() {
        s.push('a');
    }
}

fn main() {
    let mut s = String::from("Coco");
    changer_derniere_lettre(&mut s);
    println!("{s}");
}
