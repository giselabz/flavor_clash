# Interfície del joc

## CU3.1 - Visualitzar tauler de joc
**Actor principal:** Usuari autenticat  
**Disparador:** L’usuari comença una partida.  
**Precondicions:** La partida ha estat iniciada amb èxit.  
**Requisits:** RF3.1, RF3.2, RF3.3, RF3.4, RF3.5  

**Escenari principal**  
1. El sistema mostra el tauler de joc amb tots els seus elements visibles:
   - Mà de cartes, pila de robatori/descart, puntuació, torns, objectius.

**Extensions**  
1a. Hi ha un error de càrrega gràfica.  
   1a.1. El sistema mostra un missatge i torna a intentar-ho.

_Taula: Descripció cas d’ús CU3.1 - Visualitzar tauler de joc (Elaboració pròpia)_

## CU3.2 - Arrossegar i deixar anar cartes
**Actor principal:** Usuari autenticat  
**Disparador:** L’usuari vol jugar cartes al tauler per crear plats.  
**Precondicions:** El tauler de joc està carregat i és el torn de l’usuari.  
**Requisits:** RF3.1, RF4.3  

**Escenari principal**  
1. L’usuari arrossega una carta des de la mà fins a la zona de creació de plats.  
2. El sistema valida la jugada i col·loca la carta.  

**Extensions**  
2a. La carta no es pot jugar en aquell moment.  
   2a.1. El sistema retorna la carta a la mà i mostra un missatge.

_Taula: Descripció cas d’ús CU3.2 - Arrossegar i deixar anar cartes (Elaboració pròpia)_

## CU3.3 - Consultar explicació de plats
**Actor principal:** Usuari autenticat, sistema  
**Disparador:** L’usuari ha creat un plat jugant cartes.  
**Precondicions:** S’ha creat un plat vàlid amb diverses cartes.  
**Requisits:** RF3.6  

**Escenari principal**  
1. El sistema detecta que l’usuari ha format un plat.  
2. El sistema mostra una explicació breu sobre la combinació de cartes utilitzada.  

**Extensions**  
2a. No hi ha dades per a la combinació.  
   2a.1. El sistema indica que no es pot mostrar informació.

_Taula: Descripció cas d’ús CU3.3 - Consultar explicació de plats (Elaboració pròpia)_

