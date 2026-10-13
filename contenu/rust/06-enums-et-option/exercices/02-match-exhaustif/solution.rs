#[derive(Debug, PartialEq)]
enum Direction {
    Nord,
    Est,
    Sud,
    Ouest,
}

fn tourner_a_droite(direction: Direction) -> Direction {
    match direction {
        Direction::Nord => Direction::Est,
        Direction::Est => Direction::Sud,
        Direction::Sud => Direction::Ouest,
        Direction::Ouest => Direction::Nord,
    }
}

fn en_degres(direction: &Direction) -> u32 {
    match direction {
        Direction::Nord => 0,
        Direction::Est => 90,
        Direction::Sud => 180,
        Direction::Ouest => 270,
    }
}

fn main() {
    let direction = tourner_a_droite(Direction::Sud);
    println!("{:?} = {} degrés", direction, en_degres(&direction));
}
