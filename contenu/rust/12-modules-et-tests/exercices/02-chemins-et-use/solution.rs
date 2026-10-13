mod restaurant {
    pub mod entrees {
        pub fn du_jour() -> &'static str {
            "salade"
        }
    }

    pub mod plats {
        pub fn du_jour() -> &'static str {
            "steak"
        }
    }

    pub mod desserts {
        pub fn du_jour() -> &'static str {
            "tarte"
        }
    }
}

use restaurant::{desserts, entrees, plats};

fn menu() -> String {
    format!("{} puis {}", entrees::du_jour(), desserts::du_jour())
}

fn menu_complet() -> String {
    format!("{}, {} puis {}", entrees::du_jour(), plats::du_jour(), desserts::du_jour())
}

fn main() {
    println!("{}", menu());
    println!("{}", menu_complet());
}
