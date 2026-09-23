import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const pasta = 'public/img';
const larguras = [400, 800, 1200];

const arquivos = (await readdir(pasta)).filter((arquivo) =>
  /\.(jpe?g|png)$/i.test(arquivo)
);

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name;

  for (const largura of larguras) {
    await sharp(path.join(pasta, arquivo))
      .resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(pasta, `${nome}-${largura}.webp`));

    console.log(`✔ ${nome}-${largura}.webp`);
  }
}