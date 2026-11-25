"""
Generates every app icon, splash and Play Store graphic from one design, so they always match.

    python scripts/generate-brand-assets.py

Design: a white leaf (kheti / dhara) above a gold chevron (the stripe on a soldier's sleeve),
on the app's olive green. Colors come from src/shared/theme/palette.js.

Outputs
  assets/icon.png                     1024  app icon (iOS / fallback), full square
  assets/android-icon-foreground.png  1024  adaptive icon foreground (transparent)
  assets/android-icon-background.png  1024  adaptive icon background (solid olive)
  assets/android-icon-monochrome.png  1024  Android 13+ themed icon (white glyph)
  assets/splash-icon.png              1024  splash logo (glyph only, on olive splash bg)
  assets/favicon.png                    48  web
  store/play-icon-512.png              512  Play Console "App icon"
  store/feature-graphic.png       1024x500  Play Console "Feature graphic"
"""

import os
from math import cos, radians, sin

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLIVE = (85, 107, 47, 255)  # primary-600 #556B2F
OLIVE_DARK = (69, 86, 31, 255)  # primary-700
WHITE = (255, 255, 255, 255)
GOLD = (224, 185, 74, 255)  # wheat-400 #E0B94A
SS = 4  # supersampling: draw 4x bigger, then shrink, for smooth edges


def leaf_polygon(cx, cy, length, width, angle_deg, steps=160):
    """A leaf with a rounded belly and sharp tip, rotated by angle_deg (0 = tip to the right)."""
    from math import pi

    pts = []
    for i in range(steps + 1):  # upper edge, base -> tip
        u = i / steps
        y = width / 2 * sin(pi * u) ** 0.9 * (1 - 0.35 * u)  # fuller near the base
        pts.append((-length / 2 + length * u, -y))
    for i in range(steps + 1):  # lower edge, tip -> base
        u = 1 - i / steps
        y = width / 2 * sin(pi * u) ** 0.9 * (1 - 0.35 * u)
        pts.append((-length / 2 + length * u, y))
    return rotate(pts, cx, cy, angle_deg)


def rotate(pts, cx, cy, angle_deg):
    a = radians(angle_deg)
    return [(cx + x * cos(a) - y * sin(a), cy + x * sin(a) + y * cos(a)) for x, y in pts]


def draw_glyph(draw, cx, cy, size, leaf_color, vein_color, chevron_color):
    """Leaf (tip pointing up-right, short stem bottom-left) above a chevron, centred on (cx, cy)."""
    angle = -45
    leaf_len = size * 0.80
    leaf_w = size * 0.46
    leaf_cx, leaf_cy = cx + size * 0.03, cy - size * 0.12

    # Stem: continues past the leaf base, bottom-left.
    stem = rotate([(-leaf_len * 0.62, 0), (-leaf_len * 0.40, 0)], leaf_cx, leaf_cy, angle)
    draw.line(stem, fill=leaf_color, width=max(2, int(size * 0.05)))

    draw.polygon(leaf_polygon(leaf_cx, leaf_cy, leaf_len, leaf_w, angle), fill=leaf_color)

    # Midrib that thins out before the tip, plus two pairs of side veins.
    vw = max(2, int(size * 0.028))
    midrib = rotate([(-leaf_len * 0.40, 0), (leaf_len * 0.30, 0)], leaf_cx, leaf_cy, angle)
    draw.line(midrib, fill=vein_color, width=vw)
    for x in (-0.12, 0.08):
        for side in (-1, 1):
            vein = rotate(
                [(leaf_len * x, 0), (leaf_len * (x + 0.13), side * leaf_w * 0.24)],
                leaf_cx,
                leaf_cy,
                angle,
            )
            draw.line(vein, fill=vein_color, width=max(2, int(vw * 0.7)))

    # Chevron below the leaf.
    w = size * 0.50
    h = size * 0.15
    t = size * 0.075  # thickness
    top = cy + size * 0.33
    draw.polygon(
        [
            (cx - w / 2, top),
            (cx, top + h),
            (cx + w / 2, top),
            (cx + w / 2, top + t),
            (cx, top + h + t),
            (cx - w / 2, top + t),
        ],
        fill=chevron_color,
    )


def canvas(w, h, bg):
    img = Image.new('RGBA', (w * SS, h * SS), bg)
    return img, ImageDraw.Draw(img)


def save(img, rel, size, mode='RGBA'):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.resize(size, Image.LANCZOS).convert(mode).save(path, optimize=True)
    print('wrote', rel, size)


def glyph_image(px, bg, glyph_fraction, leaf, vein, chevron):
    img, d = canvas(px, px, bg)
    c = px * SS / 2
    draw_glyph(d, c, c, px * SS * glyph_fraction, leaf, vein, chevron)
    return img


TRANSPARENT = (0, 0, 0, 0)

# Full-square icons: glyph fills ~62% of the square.
full = glyph_image(1024, OLIVE, 0.62, WHITE, OLIVE, GOLD)
save(full, 'assets/icon.png', (1024, 1024), 'RGB')
save(full, 'store/play-icon-512.png', (512, 512), 'RGBA')
save(full, 'assets/favicon.png', (48, 48))

# Adaptive icon: Android crops to a circle/squircle using the centre ~66%, so keep the
# glyph inside ~46% to survive every launcher mask.
save(glyph_image(1024, TRANSPARENT, 0.46, WHITE, OLIVE, GOLD), 'assets/android-icon-foreground.png', (1024, 1024))
save(Image.new('RGBA', (1024, 1024), OLIVE), 'assets/android-icon-background.png', (1024, 1024))
save(glyph_image(1024, TRANSPARENT, 0.46, WHITE, TRANSPARENT, WHITE), 'assets/android-icon-monochrome.png', (1024, 1024))

# Splash: glyph only; the olive background comes from the splash config in app.json.
save(glyph_image(1024, TRANSPARENT, 0.9, WHITE, OLIVE, GOLD), 'assets/splash-icon.png', (1024, 1024))

# Play Store feature graphic 1024x500: glyph on the left, name + tagline on the right.
W, H = 1024, 500
fg, d = canvas(W, H, OLIVE)
d.rectangle([0, H * SS * 0.86, W * SS, H * SS], fill=OLIVE_DARK)
draw_glyph(d, 215 * SS, 225 * SS, 300 * SS, WHITE, OLIVE, GOLD)


def font(names, px):
    for n in names:
        for base in ('C:/Windows/Fonts', '/usr/share/fonts/truetype/dejavu', '/Library/Fonts'):
            p = os.path.join(base, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, px * SS)
    return ImageFont.load_default()


title = font(['segoeuib.ttf', 'DejaVuSans-Bold.ttf', 'Arial Bold.ttf'], 80)
sub = font(['segoeui.ttf', 'DejaVuSans.ttf', 'Arial.ttf'], 28)
d.text((410 * SS, 140 * SS), 'FaujiDhara', font=title, fill=WHITE)
d.text((414 * SS, 250 * SS), 'Har rajya ki fasal, mausam ke hisaab se', font=sub, fill=(244, 246, 236, 255))
d.text((414 * SS, 296 * SS), 'Paudhon ka asli naap 3D mein', font=sub, fill=GOLD)
save(fg, 'store/feature-graphic.png', (W, H), 'RGB')
