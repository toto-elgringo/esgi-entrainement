import argparse
import hashlib
import io
import subprocess
import sys
import tempfile
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops, ImageDraw, ImageFont


CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CACHE_SVG = Path(tempfile.gettempdir()) / "esgi-entrainement-captures"


class PageSvg:
    def __init__(self, fichier):
        self.fichier = fichier
        self.rect = pymupdf.Rect(0, 0, 1600, 900)

    def image_complete(self):
        CACHE_SVG.mkdir(exist_ok=True)
        cle = hashlib.sha1(str(self.fichier).encode()).hexdigest()[:16]
        png = CACHE_SVG / f"{cle}.png"
        if not png.exists():
            html = CACHE_SVG / f"{cle}.html"
            html.write_text(f'<html><body style="margin:0"><img src="{self.fichier.as_uri()}" style="width:1600px;height:900px;object-fit:contain"></body></html>', encoding="utf-8")
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=8000", f"--screenshot={png}", "--window-size=1600,900", html.as_uri()], capture_output=True, timeout=60)
        return Image.open(png).convert("RGB")

    def get_text(self):
        return ""


def ouvrir_pages(source):
    chemin = Path(source)
    if chemin.is_dir():
        return [(f.name, PageSvg(f.resolve())) for f in sorted(chemin.glob("*.svg"))]
    document = pymupdf.open(str(chemin))
    return [(str(i + 1), page) for i, page in enumerate(document)]


def rendre(page, largeur, clip=None):
    if isinstance(page, PageSvg):
        image = page.image_complete()
        if clip:
            image = image.crop((round(clip.x0), round(clip.y0), round(clip.x1), round(clip.y1)))
        return image.resize((largeur, round(image.height * largeur / image.width)), Image.LANCZOS)
    rect = clip or page.rect
    zoom = largeur / rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def police(taille):
    for nom in ("arialbd.ttf", "arial.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(nom, taille)
        except OSError:
            continue
    return ImageFont.load_default()


def commande_texte(args):
    for nom, page in ouvrir_pages(args.source):
        texte = " ".join(page.get_text().split())
        print(f"[{nom}] {texte[: args.longueur]}")


def commande_planche(args):
    pages = ouvrir_pages(args.source)
    sortie = Path(args.sortie)
    sortie.mkdir(parents=True, exist_ok=True)
    colonnes = args.colonnes
    vignette = args.vignette
    fonte = police(22)
    for debut in range(0, len(pages), args.par):
        lot = pages[debut : debut + args.par]
        images = [(nom, rendre(page, vignette)) for nom, page in lot]
        hauteur = max(im.height for _, im in images)
        lignes = (len(images) + colonnes - 1) // colonnes
        planche = Image.new("RGB", (colonnes * (vignette + 10) + 10, lignes * (hauteur + 40) + 10), (60, 60, 60))
        dessin = ImageDraw.Draw(planche)
        for i, (nom, im) in enumerate(images):
            x = 10 + (i % colonnes) * (vignette + 10)
            y = 10 + (i // colonnes) * (hauteur + 40)
            dessin.text((x, y), f"p. {nom}", fill=(255, 220, 80), font=fonte)
            planche.paste(im, (x, y + 30))
        fichier = sortie / f"planche-{debut + 1:03d}.jpg"
        planche.save(fichier, quality=70)
        print(fichier)


def commande_page(args):
    pages = dict(ouvrir_pages(args.source))
    image = rendre(pages[args.page], args.largeur)
    dessin = ImageDraw.Draw(image)
    fonte = police(max(14, args.largeur // 80))
    for i in range(1, 10):
        x = image.width * i / 10
        y = image.height * i / 10
        dessin.line([(x, 0), (x, image.height)], fill=(255, 0, 200), width=1)
        dessin.line([(0, y), (image.width, y)], fill=(255, 0, 200), width=1)
        dessin.text((x + 3, 3), f".{i}", fill=(255, 0, 200), font=fonte)
        dessin.text((3, y + 3), f".{i}", fill=(255, 0, 200), font=fonte)
    image.save(args.sortie, quality=80)
    print(args.sortie, image.size)


def rogner_marges(image, marge):
    fond = Image.new(image.mode, image.size, image.getpixel((0, 0)))
    boite = ImageChops.difference(image, fond).convert("L").point(lambda v: 255 if v > 18 else 0).getbbox()
    if not boite:
        return image
    x0, y0, x1, y1 = boite
    return image.crop((max(0, x0 - marge), max(0, y0 - marge), min(image.width, x1 + marge), min(image.height, y1 + marge)))


def commande_capture(args):
    pages = dict(ouvrir_pages(args.source))
    page = pages[args.page]
    r = page.rect
    clip = pymupdf.Rect(r.x0 + r.width * args.x0, r.y0 + r.height * args.y0, r.x0 + r.width * args.x1, r.y0 + r.height * args.y1)
    image = rendre(page, args.largeur * 2, clip)
    if not args.sans_rognage:
        image = rogner_marges(image, 16)
    if image.width > args.largeur:
        image = image.resize((args.largeur, round(image.height * args.largeur / image.width)), Image.LANCZOS)
    sortie = Path(args.sortie)
    sortie.parent.mkdir(parents=True, exist_ok=True)
    image.save(sortie, "WEBP", quality=args.qualite, method=6)
    print(sortie, image.size, f"{sortie.stat().st_size // 1024} Ko")


def principal():
    analyse = argparse.ArgumentParser(description="Captures des supports PDF / SVG")
    sous = analyse.add_subparsers(dest="commande", required=True)

    t = sous.add_parser("texte", help="texte de chaque page (repérage)")
    t.add_argument("source")
    t.add_argument("--longueur", type=int, default=220)
    t.set_defaults(fonction=commande_texte)

    p = sous.add_parser("planche", help="planches de vignettes numérotées")
    p.add_argument("source")
    p.add_argument("sortie")
    p.add_argument("--par", type=int, default=12)
    p.add_argument("--colonnes", type=int, default=4)
    p.add_argument("--vignette", type=int, default=360)
    p.set_defaults(fonction=commande_planche)

    g = sous.add_parser("page", help="une page avec une grille au dixième")
    g.add_argument("source")
    g.add_argument("page")
    g.add_argument("sortie")
    g.add_argument("--largeur", type=int, default=1100)
    g.set_defaults(fonction=commande_page)

    c = sous.add_parser("capture", help="découpe une zone (fractions 0-1) en .webp")
    c.add_argument("source")
    c.add_argument("page")
    c.add_argument("x0", type=float)
    c.add_argument("y0", type=float)
    c.add_argument("x1", type=float)
    c.add_argument("y1", type=float)
    c.add_argument("sortie")
    c.add_argument("--largeur", type=int, default=1200)
    c.add_argument("--qualite", type=int, default=82)
    c.add_argument("--sans-rognage", action="store_true")
    c.set_defaults(fonction=commande_capture)

    args = analyse.parse_args()
    args.fonction(args)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    principal()
