nom = "Ada"
age = 36
taille = 1.65
poids = 57

if __name__ == "__main__":
    print(f"{nom} a {age} ans et mesure {taille:.2f} m.")
    print(f"Dans 5 ans, {nom} aura {age + 5} ans.")
    print(f"En majuscules : {nom.upper()}")
    print(f"IMC : {poids / taille ** 2:.1f}")
