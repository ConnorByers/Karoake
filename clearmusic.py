import os
import glob
import shutil

for folder in ('./music/merged/**', './music/upload/**'):
    files = glob.glob(folder)
    for f in files:
        os.remove(f)

for root, dirs, files in os.walk('./music/split'):
    for f in files:
        os.unlink(os.path.join(root, f))
    for d in dirs:
        shutil.rmtree(os.path.join(root, d))