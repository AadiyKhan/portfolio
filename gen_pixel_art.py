import os
import random

svg_template = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="512" height="512" shape-rendering="crispEdges">
  <rect width="16" height="16" fill="#030305"/>
{rects}
</svg>'''

def generate_symmetric_pixels(seed_str):
    random.seed(seed_str)
    half = []
    for y in range(16):
        row = []
        for x in range(8):
            if random.random() > 0.45:
                color = random.choice(['#333333', '#777777', '#aaaaaa', '#ffffff', '#ffffff'])
                row.append(color)
            else:
                row.append(None)
        half.append(row)
    
    full = []
    for row in half:
        full.append(row + row[::-1])
    return full

def make_svg(pixels, filename):
    rects = []
    for y, row in enumerate(pixels):
        for x, color in enumerate(row):
            if color:
                rects.append(f'  <rect x="{x}" y="{y}" width="1" height="1" fill="{color}"/>')
    
    with open(filename, 'w') as f:
        f.write(svg_template.format(rects='\n'.join(rects)))

out_dir = r"c:\projects\portfolio\src\assets\images"
make_svg(generate_symmetric_pixels("transformer_from_scratch_v5"), os.path.join(out_dir, "transformer.svg"))
make_svg(generate_symmetric_pixels("nads_anomaly_detection_v5"), os.path.join(out_dir, "nads.svg"))
make_svg(generate_symmetric_pixels("flowbert_v5"), os.path.join(out_dir, "flowbert.svg"))
