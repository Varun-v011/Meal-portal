from PIL import Image
import os

SRC = "Neyon-meal.png"
OUT_DIR = "icons"
os.makedirs(OUT_DIR, exist_ok=True)

img = Image.open(SRC).convert("RGBA")

# Standard icons — just resized, transparent background kept as-is
for size in (192, 512):
    resized = img.resize((size, size), Image.LANCZOS)
    resized.save(os.path.join(OUT_DIR, f"icon-{size}.png"))

# Maskable icon — Android may crop this into a circle/rounded-square, so the
# subject needs safe padding (roughly 80% of the canvas, centered) or parts
# of the mascot could get clipped off on some launchers.
size = 512
canvas = Image.new("RGBA", (size, size), (15, 23, 48, 255))  # matches --navy-950
scale = int(size * 0.8)
resized = img.resize((scale, scale), Image.LANCZOS)
offset = ((size - scale) // 2, (size - scale) // 2)
canvas.paste(resized, offset, resized)
canvas.save(os.path.join(OUT_DIR, "icon-maskable-512.png"))

print("Done — icons/icon-192.png, icon-512.png, icon-maskable-512.png created.")