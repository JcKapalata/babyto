import { Produit } from "../Models/produits";

export const PRODUITS: Produit[] = [
  // Produit 1
  { 
    id: 1, 
    code: 'BBI-VET-001', // Bébé-Vêtement-001
    nom: 'Body bébé coton', 
    prix: 9.99, 
    devise: 'USD',
    region: 'Goma',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Body',
    taille: ['6-9 mois'],
    couleur: ['rose', 'bleu'],
    description: 'Body confortable 100% coton pour bébé.', 
    imagesParCouleur: {
      'rose':'/assets/imagesProduits/bbi-vet-001/rose.jpeg',
      'bleu':'/assets/imagesProduits/bbi-vet-001/bleu.jpeg',
    }
  },
  // Produit 2
  { 
    id: 2, 
    code: 'BBI-VET-002', 
    nom: 'Pyjama bébé', 
    prix: 12.99, 
    devise: 'USD',
    region: 'Beni',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Pyjama',
    taille: ['12-18 mois'],
    couleur: ['glauque', 'chocolat'],
    description: 'Pyjama doux et chaud en velours.', 
    imagesParCouleur: {
      'glauque': '/assets/imagesProduits/bbi-vet-002/glauque.jpeg',
      'chocolat': '/assets/imagesProduits/bbi-vet-002/chocolat.jpeg'
    }
  },
  // // Produit 3
  { 
    id: 3, 
    code: 'BBI-ACC-003', // Bébé-Accessoire-003
    nom: 'Chaussettes', 
    prix: 2000, 
    devise: 'CDF',
    region: 'Butembo',
    classement: 'Vêtements & Mode',
    categorie: 'Accessoire',
    type: 'Chaussette',
    taille: ['Taille unique'],
    couleur: ['rose','multicolore', 'bleu', 'blanc'],
    description: 'Lot de 5 paires de chaussettes en coton.', 
    imagesParCouleur: {
      'rose' : '/assets/imagesProduits/bbi-acc-003/rose.jpeg',
      'multicolore' : '/assets/imagesProduits/bbi-acc-003/multicolore.png',
      'bleu' : '/assets/imagesProduits/bbi-acc-003/bleu.jpeg',
      'blanc' : '/assets/imagesProduits/bbi-acc-003/blanc.jpeg'
    }
  },
  // // Produit 4
  { 
    id: 4, 
    code: 'BBI-JOU-004', // Bébé-Jouet-004
    nom: 'Jouet en peluche', 
    prix: 15.99, 
    devise: 'USD',
    region: 'Goma',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Peluche',
    taille: ['30 cm', '40 cm'],
    couleur: ['lin','chocolat', 'rose'],
    description: 'Peluche douce en forme d\'ours pour câlins.', 
    imagesParCouleur: {
      'lin' : '/assets/imagesProduits/bbi-jou-004/lin.jpeg',
      'chocolat' : '/assets/imagesProduits/bbi-jou-004/chocolat.jpeg',
      'rose' : '/assets/imagesProduits/bbi-jou-004/rose.jpeg'
    }
  }, 
  // // Produit 5
  { 
    id: 5, 
    code: 'BBI-JOU-005', 
    nom: 'Cube d’éveil', 
    prix: 18.99, 
    devise: 'USD',
    region: 'Beni',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Éveil',
    taille: ['15 cm', '20 cm'],
    couleur: ['bois','rouge', 'jaune', 'bleu'],
    description: 'Cube sensoriel avec couleurs, textures et sons.', 
    imagesParCouleur: {
      'bois' : '/assets/imagesProduits/bbi-jou-005/bois.jpeg',
      'rouge' : '/assets/imagesProduits/bbi-jou-005/rouge.jpeg',
      'jaune' : '/assets/imagesProduits/bbi-jou-005/jaune.jpeg',
      'bleu' : '/assets/imagesProduits/bbi-jou-005/bleu.jpeg',
    }
  },
  // // Produit 6
  { 
    id: 6, 
    code: 'BBI-JOU-006', 
    nom: 'Hochet', 
    prix: 7.99, 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Éveil',
    taille: ['10 cm'],
    couleur: ['bisque', 'vert', 'bleu', 'rose'],
    description: 'Hochet facile à tenir, sans BPA.', 
    imagesParCouleur: {
      'bisque' : '/assets/imagesProduits/bbi-jou-006/bisque.jpeg',
      'vert' : '/assets/imagesProduits/bbi-jou-006/vert.jpeg',
      'bleu' : '/assets/imagesProduits/bbi-jou-006/bleu.jpeg',
      'rose' : '/assets/imagesProduits/bbi-jou-006/rose.jpeg',
    }
  },
  // // Produit 7
  { 
    id: 7, 
    code: 'BBI-VET-007', 
    nom: 'T-shirt enfant', 
    prix: 8.99, 
    devise: 'USD',
    region: 'Goma',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'T-shirt',
    taille: ['2 ans'],
    couleur: ['noire', 'rose', 'jaune', 'bleu'],
    description: 'T-shirt coton avec motif dinosaure fun.', 
    imagesParCouleur: {
      'noire' : '/assets/imagesProduits/bbi-vet-007/noire.jpeg',
      'rose' : '/assets/imagesProduits/bbi-vet-007/rose.jpeg',
      'jaune' : '/assets/imagesProduits/bbi-vet-007/jaune.jpeg',
      'bleu' : '/assets/imagesProduits/bbi-vet-007/bleu.jpeg',
    }
  },
  // // Produit 8
  { 
    id: 8, 
    code: 'BBI-VET-008', 
    nom: 'Short bébé', 
    prix: 6.99, 
    devise: 'USD',
    region: 'Beni',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Short',
    taille: ['6 mois'],
    couleur: ['gris', 'bleu ciel', 'rouge'],
    description: 'Short léger en coton idéal pour l\'été.', 
    imagesParCouleur: {
      'gris' : '/assets/imagesProduits/bbi-vet-008/gris.jpeg',
      'bleu ciel' : '/assets/imagesProduits/bbi-vet-008/bleu-ciel.jpeg',
      'rouge' : '/assets/imagesProduits/bbi-vet-008/rouge.jpeg',
    }
  },
  // // Produit 9
  // { 
  //   id: 9, 
  //   code: 'BBI-ALI-009', // Bébé-Alimentation-009
  //   nom: 'Biberon', 
  //   prix: 7.99, 
  //   devise: 'USD',
  //   region: 'Butembo',
  //   classement: 'Repas & Alimentation',
  //   categorie: 'Alimentation',
  //   type: 'Biberon',
  //   taille: ['240 ml', '350 ml'],
  //   couleur: ['Transparent', 'Bleu'],
  //   description: 'Biberon en plastique sans BPA, anti-colique.', 
  //   imageUrl: ['/assets/imagesProduits/009.jpeg']
  // },
  // // Produit 10
  // { 
  //   id: 10, 
  //   code: 'BBI-ALI-010', 
  //   nom: 'Tasse apprentissage', 
  //   prix: 4.99, 
  //   devise: 'USD',
  //   region: 'Goma',
  //   classement: 'Repas & Alimentation',
  //   categorie: 'Alimentation',
  //   type: 'Tasse',
  //   taille: ['150 ml'],
  //   couleur: ['Rose'],
  //   description: 'Tasse avec poignées pour apprendre à boire.', 
  //   imageUrl: ['/assets/imagesProduits/010.jpeg']
  // },
  // // Produit 11
  // { 
  //   id: 11, 
  //   code: 'BBI-JOU-011', 
  //   nom: 'Jouet à empiler', 
  //   prix: 9.99, 
  //   devise: 'USD',
  //   region: 'Beni',
  //   classement: 'Jouets & Éveil',
  //   categorie: 'Jouet',
  //   type: 'Construction',
  //   taille: ['20cm'],
  //   couleur: ['Multicolore'],
  //   description: 'Anneaux colorés en plastique résistant à empiler.', 
  //   imageUrl: ['/assets/imagesProduits/011.jpeg']
  // },
  // // Produit 12
  // {
  //   id: 12, 
  //   code: 'BBI-JOU-012', 
  //   nom: 'Puzzle en bois', 
  //   prix: 14.99,
  //   devise: 'USD',
  //   region: 'Butembo',
  //   classement: 'Jouets & Éveil',
  //   categorie: 'Jouet',
  //   type: 'Puzzle',
  //   taille: ['20x20cm'],
  //   couleur: ['Bois', 'Couleurs'],
  //   description: 'Puzzle éducatif en bois 12 pièces pour enfant.', 
  //   imageUrl: ['/assets/imagesProduits/012.jpeg']
  // },
  // // Produit 13
  // { 
  //   id: 13, 
  //   code: 'BBI-ACC-013', 
  //   nom: 'Casquette enfant', 
  //   prix: 15000, 
  //   devise: 'CDF',
  //   region: 'Goma',
  //   classement: 'Vêtements & Mode',
  //   categorie: 'Accessoire',
  //   type: 'Chapeau',
  //   taille: ['48 cm'],
  //   couleur: ['Rouge', 'Blanc'],
  //   description: 'Casquette légère et colorée, protection UV.', 
  //   imageUrl: ['/assets/imagesProduits/013.jpeg']
  // },
  // // Produit 14
  // { 
  //   id: 14, 
  //   code: 'BBI-VET-014', 
  //   nom: 'Veste bébé', 
  //   prix: 19.99, 
  //   devise: 'USD',
  //   region: 'Beni',
  //   classement: 'Vêtements & Mode',
  //   categorie: 'Vêtement',
  //   type: 'Veste',
  //   taille: ['9-12 mois'],
  //   couleur: ['Gris anthracite'],
  //   description: 'Veste chaude en polaire, avec capuche.', 
  //   imageUrl: ['/assets/imagesProduits/014.jpeg']
  // },
  // // Produit 15
  // { 
  //   id: 15, 
  //   code: 'BBI-JOU-015', 
  //   nom: 'Jouet musical', 
  //   prix: 16.99, 
  //   devise: 'USD',
  //   region: 'Butembo',
  //   classement: 'Jouets & Éveil',
  //   categorie: 'Jouet',
  //   type: 'Musical',
  //   taille: ['Taille unique'],
  //   couleur: ['Bois', 'Métal'],
  //   description: 'Petit xylophone en bois pour débuter la musique.', 
  //   imageUrl: ['/assets/imagesProduits/015.jpeg']
  // },
  // // Produit 16
  // { 
  //   id: 16, 
  //   code: 'BBI-JOU-016', 
  //   nom: 'Doudou', 
  //   prix: 12.99,
  //   devise: 'USD',
  //   region: 'Goma',
  //   classement: 'Jouets & Éveil',
  //   categorie: 'Jouet',
  //   type: 'Doudou',
  //   taille: ['25x25cm'],
  //   couleur: ['Crème'],
  //   description: 'Doudou plat en forme de lapin, très doux.', 
  //   imageUrl: ['/assets/imagesProduits/016.jpeg']
  // },
  // // Produit 17
  // { 
  //   id: 17, 
  //   code: 'BBI-JOU-017', 
  //   nom: 'Balle sensorielle', 
  //   prix: 8.99,
  //   devise: 'USD',
  //   region: 'Beni',
  //   classement: 'Jouets & Éveil',
  //   categorie: 'Jouet',
  //   type: 'Éveil',
  //   taille: ['10 cm', '15 cm'],
  //   couleur: ['Orange' ,'Bleu'],
  //   description: 'Balle colorée avec différentes textures pour la préhension.', 
  //   imageUrl: ['/assets/imagesProduits/017.jpeg']
  // },
  // // Produit 18
  // { 
  //   id: 18, 
  //   code: 'BBI-EQP-018', // Bébé-Équipement-018
  //   nom: 'Tapis d’éveil', 
  //   prix: 24.99,
  //   devise: 'USD',
  //   region: 'Butembo',
  //   classement: 'Chambre & Déco',
  //   categorie: 'Équipement',
  //   type: 'Tapis',
  //   taille: ['80x80cm'],
  //   couleur: ['Motifs jungle'],
  //   description: 'Tapis d\'éveil rembourré avec arches et jouets amovibles.', 
  //   imageUrl: ['/assets/imagesProduits/018.jpeg']
  // }
];