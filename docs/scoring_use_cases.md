# Sistema de puntuació (CU5.x)

## CU5.1 - Calcular puntuació de plat
- **Actor principal:** Sistema
- **Disparador:** L'usuari ha creat un plat complet.
- **Precondicions:** El plat ha estat validat com a vàlid.
- **Requisits:** RF5.1, RF4.4, RF4.5, RF4.6
- **Escenari principal:**
  1. El sistema analitza la composició del plat.
  2. Calcula els punts tenint en compte sinergies, compatibilitat i penalitzacions.
- **Extensions:**
  - 2a. El plat no compleix cap criteri de puntuació.
    - 2a.1. El sistema assigna puntuació mínima.

## CU5.2 - Mostrar puntuació final
- **Actors principals:** Sistema, usuari autenticat
- **Disparador:** La partida ha finalitzat.
- **Precondicions:** L'usuari ha completat tots els torns o objectius.
- **Requisits:** RF5.2, RF5.3, RF9.1, RF9.2
- **Escenari principal:**
  1. El sistema mostra la puntuació final amb desglossament de punts i objectius.
  2. Es mostra el rang obtingut per l'usuari.
- **Extensions:**
  - 1a. Error en el càlcul de puntuació.
    - 1a.1. El sistema ho comunica i ofereix repetir el càlcul.

## CU5.3 - Guardar puntuació
- **Actor principal:** Sistema
- **Disparador:** S'ha mostrat la puntuació final.
- **Precondicions:** L'usuari ha acabat la partida i ha vist la puntuació.
- **Requisits:** RF5.2, RF9.3
- **Escenari principal:**
  1. El sistema guarda els punts de sabor obtinguts al perfil de l'usuari.
- **Extensions:**
  - 1a. Fallada en la connexió amb la base de dades.
    - 1a.1. El sistema emmagatzema temporalment la puntuació i intenta guardar-la més tard.
