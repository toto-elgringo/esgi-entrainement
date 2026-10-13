fn main() {
    let mut v = vec![3, 1, 4];
    println!("Départ : {:?}", v);

    v.push(1);
    println!("Après push(1) : {:?}", v);

    let retire = v.pop();
    println!("pop() renvoie : {:?}", retire);

    v.sort();
    println!("Après sort() : {:?}", v);

    println!("Taille : {}", v.len());
    println!("get(0) : {:?}", v.get(0));
    println!("get(9) : {:?}", v.get(9));
}
