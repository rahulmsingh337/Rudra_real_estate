#!/usr/bin/env python3
"""Resize and convert photos to web-ready WebP.
Usage: python3 scripts/optimize-photos.py path/to/originals  ->  writes assets/photos/*.webp
Needs: pip install pillow"""
import sys, os, re
from PIL import Image, ImageOps
src = sys.argv[1] if len(sys.argv) > 1 else 'originals'
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'photos'); os.makedirs(out, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')): continue
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert('RGB')
    im.thumbnail((1400, 1750), Image.LANCZOS)
    name = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(f)[0].lower()).strip('-') + '.webp'
    im.save(os.path.join(out, name), 'WEBP', quality=80, method=6)
    print(name, im.size, os.path.getsize(os.path.join(out, name)) // 1024, 'KB')
