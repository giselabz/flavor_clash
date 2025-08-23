# Sistema de torns i gestió de cartes

## CU4.1 - Gestionar torn
**Actor principal:** Usuari autenticat, sistema
**Disparador:** És el torn de l’usuari durant la partida.
**Precondicions:** El joc està en marxa i és el torn actiu de l’usuari.
**Requisits:** RF4.1, RF4.2, RF4.3, RF4.4

**Escenari principal**
1. L’usuari inicia el seu torn.
2. Realitza les fases de robatori, acció i finalització.
3. El sistema valida i tanca el torn.

**Extensions**
3a. Error en validar la jugada.
   3a.1. El sistema mostra un missatge d’error i retorna a l’última acció vàlida.

_Taula: Descripció cas d’ús CU4.1 - Gestionar torn (Elaboració pròpia)_

## CU4.2 - Robar cartes
**Actor principal:** Usuari autenticat
**Disparador:** L’usuari inicia la fase de robatori.
**Precondicions:** El torn ha començat i la mà de l’usuari té menys de 5 cartes.
**Requisits:** RF4.2

**Escenari principal**
1. L’usuari roba cartes de la pila de robatori fins a tenir-ne 5.

**Extensions**
1a. La pila està buida.
   1a.1. El sistema barreja la pila de descart per formar una nova pila de robatori.

_Taula: Descripció cas d’ús CU4.2 - Robar cartes (Elaboració pròpia)_

## CU4.3 - Crear plat
**Actor principal:** Usuari autenticat
**Disparador:** L’usuari vol combinar cartes per crear un plat.
**Precondicions:** El torn està actiu i l’usuari disposa d’energia culinària suficient.
**Requisits:** RF4.3, RF6.1, RF6.2

**Escenari principal**
1. L’usuari juga cartes d’ingredients i condiments.
2. El sistema resta energia i valida el plat creat.

**Extensions**
2a. Combinació invàlida o energia insuficient.
   2a.1. El sistema avisa l’usuari i cancela la jugada.

_Taula: Descripció cas d’ús CU4.3 - Crear plat (Elaboració pròpia)_

## CU4.4 - Utilitzar carta d'acció
**Actor principal:** Usuari autenticat
**Disparador:** L’usuari vol jugar una carta d’acció.
**Precondicions:** L’usuari té una carta d’acció a la mà i no n’ha jugat cap aquest torn.
**Requisits:** RF4.3, RF6.1

**Escenari principal**
1. L’usuari selecciona una carta d’acció i la juga.
2. El sistema aplica l’efecte de la carta.

**Extensions**
2a. Efecte invàlid o condicions no complertes.
   2a.1. El sistema bloqueja l’acció i retorna la carta a la mà.

_Taula: Descripció cas d’ús CU4.4 - Utilitzar carta d'acció (Elaboració pròpia)_

## CU4.5 - Descartar cartes
**Actor principal:** Usuari autenticat
**Disparador:** L’usuari vol desfer-se de cartes innecessàries.
**Precondicions:** És el torn de l’usuari.
**Requisits:** RF4.3, RF4.5

**Escenari principal**
1. L’usuari tria cartes per descartar.
2. El sistema les envia a la pila de descart.
3. Es sumen punts si són cartes prohibides.

**Extensions**
3a. No es poden descartar cartes protegides.
   3a.1. El sistema mostra un missatge i anul·la la selecció.

_Taula: Descripció cas d’ús CU4.5 - Descartar cartes (Elaboració pròpia)_

## CU4.6 - Afegir carta de beguda
**Actor principal:** Usuari autenticat
**Disparador:** L’usuari vol afegir una beguda al plat creat.
**Precondicions:** L’usuari ha creat un plat i té una carta de beguda disponible.
**Requisits:** RF4.6, RF6.1

**Escenari principal**
1. L’usuari col·loca una carta de beguda sobre el plat.
2. El sistema comprova la compatibilitat i aplica els efectes.

**Extensions**
2a. La carta no és compatible amb el plat.
   2a.1. El sistema aplica una penalització o ignora l’efecte.

_Taula: Descripció cas d’ús CU4.6 - Afegir carta de beguda (Elaboració pròpia)_

## CU4.7 - Verificar cartes objectiu
**Actor principal:** Sistema
**Disparador:** Finalitza el torn de l’usuari.
**Precondicions:** L’usuari ha completat la fase d’acció.
**Requisits:** RF4.4, RF6.3

**Escenari principal**
1. El sistema revisa si els plats compleixen les condicions de les cartes objectiu actives.
2. Es marca si alguna carta objectiu ha estat assolida.

**Extensions**
2a. No hi ha coincidències.
   2a.1. El sistema continua sense aplicar canvis.

_Taula: Descripció cas d’ús CU4.7 - Verificar cartes objectiu (Elaboració pròpia)_

