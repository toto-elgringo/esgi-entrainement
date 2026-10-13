#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn deplacer(point: &Point, dx: i32, dy: i32) -> Point {
    Point {
        x: point.x + dx,
        y: point.y + dy,
    }
}

fn main() {
    let depart = Point { x: 0, y: 0 };
    let copie = depart.clone();
    let arrivee = deplacer(&depart, 3, -2);
    println!("{:?} -> {:?}", copie, arrivee);
    println!("Même point ? {}", depart == copie);
}
