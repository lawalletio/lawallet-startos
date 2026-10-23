import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG = 'https://github.com/lawalletio/lawallet-nwc/releases'

export const current = VersionInfo.of({
  version: '2.9.0:0',
  releaseNotes: {
    en_US: `Updates LaWallet NWC from 2.8.0 to 2.9.0.

Heads up:
- With an endpoint configured, Nostr (NIP-98) login only works from that exact address. Use your configured URL, not a LAN IP.
- A wallet that does not answer now shows a balance of 0 instead of an error.
- Runs on Node 24.22.1, which no longer trusts the compromised eMudhra emSign ECC Root CA - G3, so the temporary certificate layer from 2.8.0:1 is gone.

**New**

- Recover a whole account with its NFC card at the point of sale
- Make an account's first Lightning Address free, and delete an account from inside the app
- Passkeys and links for the iOS and Android wallets, with single-prompt passkey setup on Android
- Activity remembers who you paid, with their avatar and note, and pays them again in one tap
- Wallet errors translated to Spanish

**Fixes**

- The admin dashboard no longer crashes on the What's New dialog
- Wallet balances no longer wait up to 20 seconds on a silent wallet
- Payment failures that were only logged now reach error reporting

Full release notes: ${CHANGELOG}`,
    es_ES: `Actualiza LaWallet NWC de 2.8.0 a 2.9.0.

Atención:
- Con un endpoint configurado, el inicio de sesión con Nostr (NIP-98) solo funciona desde esa dirección exacta. Usa la URL configurada, no una IP de la red local.
- Un monedero que no responde ahora muestra saldo 0 en lugar de un error.
- Funciona sobre Node 24.22.1, que ya no confía en la raíz comprometida eMudhra emSign ECC Root CA - G3, así que la capa temporal de certificados de 2.8.0:1 se elimina.

**Novedades**

- Recupera una cuenta completa con su tarjeta NFC en el punto de venta
- La primera Lightning Address de una cuenta puede ser gratis, y la cuenta se puede borrar desde la aplicación
- Passkeys y enlaces para los monederos de iOS y Android, con alta de passkey en un solo paso en Android
- La actividad recuerda a quién le pagaste, con su avatar y su nota, y vuelve a pagarle con un toque
- Los errores del monedero, traducidos al español

**Correcciones**

- El panel de administración ya no falla al abrir el diálogo de novedades
- Los saldos ya no esperan hasta 20 segundos a un monedero que no responde
- Los fallos de pago que solo quedaban en el registro ahora llegan al reporte de errores

Notas de la versión completas: ${CHANGELOG}`,
    de_DE: `Aktualisiert LaWallet NWC von 2.8.0 auf 2.9.0.

Achtung:
- Mit konfiguriertem Endpoint funktioniert die Nostr-Anmeldung (NIP-98) nur noch über genau diese Adresse. Verwende die konfigurierte URL, keine LAN-IP.
- Eine Wallet, die nicht antwortet, zeigt jetzt einen Kontostand von 0 statt eines Fehlers.
- Läuft auf Node 24.22.1, das der kompromittierten eMudhra emSign ECC Root CA - G3 nicht mehr vertraut; die vorübergehende Zertifikatsschicht aus 2.8.0:1 entfällt.

**Neu**

- Ein ganzes Konto mit seiner NFC-Karte am Verkaufspunkt wiederherstellen
- Die erste Lightning-Adresse eines Kontos kann kostenlos sein, und Konten lassen sich in der App löschen
- Passkeys und Links für die iOS- und Android-Wallets, mit Passkey-Einrichtung in einem Schritt unter Android
- Die Aktivität merkt sich, wen du bezahlt hast, mit Avatar und Notiz, und bezahlt mit einem Tipp erneut
- Wallet-Fehlermeldungen auf Spanisch

**Fehlerbehebungen**

- Das Admin-Dashboard stürzt beim Dialog „Neuigkeiten" nicht mehr ab
- Kontostände warten nicht mehr bis zu 20 Sekunden auf eine stumme Wallet
- Zahlungsfehler, die nur protokolliert wurden, landen jetzt in der Fehlerberichterstattung

Vollständige Versionshinweise: ${CHANGELOG}`,
    pl_PL: `Aktualizuje LaWallet NWC z 2.8.0 do 2.9.0.

Uwaga:
- Przy skonfigurowanym endpoincie logowanie przez Nostr (NIP-98) działa tylko z tego dokładnego adresu. Używaj skonfigurowanego URL-a, a nie adresu IP w sieci lokalnej.
- Portfel, który nie odpowiada, pokazuje teraz saldo 0 zamiast błędu.
- Działa na Node 24.22.1, który nie ufa już skompromitowanemu certyfikatowi eMudhra emSign ECC Root CA - G3, więc tymczasowa warstwa certyfikatów z 2.8.0:1 zostaje usunięta.

**Nowości**

- Odzyskanie całego konta za pomocą karty NFC w punkcie sprzedaży
- Pierwszy adres Lightning konta może być darmowy, a konto można usunąć z poziomu aplikacji
- Klucze dostępu (passkey) i linki dla portfeli iOS i Android, z konfiguracją passkey w jednym kroku na Androidzie
- Aktywność pamięta, komu zapłaciłeś, z awatarem i notatką, i płaci ponownie jednym dotknięciem
- Komunikaty błędów portfela przetłumaczone na hiszpański

**Poprawki**

- Panel administracyjny nie zawiesza się już przy oknie „Co nowego"
- Salda nie czekają już do 20 sekund na milczący portfel
- Błędy płatności, które trafiały tylko do logów, są teraz zgłaszane

Pełne informacje o wydaniach: ${CHANGELOG}`,
    fr_FR: `Met à jour LaWallet NWC de 2.8.0 vers 2.9.0.

Attention :
- Avec un endpoint configuré, la connexion Nostr (NIP-98) ne fonctionne plus que depuis cette adresse exacte. Utilisez l'URL configurée, pas une IP du réseau local.
- Un portefeuille qui ne répond pas affiche désormais un solde de 0 au lieu d'une erreur.
- Tourne sur Node 24.22.1, qui ne fait plus confiance à la racine compromise eMudhra emSign ECC Root CA - G3 ; la couche de certificats temporaire de 2.8.0:1 disparaît.

**Nouveautés**

- Récupérer un compte entier avec sa carte NFC au point de vente
- La première adresse Lightning d'un compte peut être gratuite, et un compte se supprime depuis l'application
- Passkeys et liens pour les portefeuilles iOS et Android, avec création de passkey en une seule étape sur Android
- L'activité se souvient de qui vous avez payé, avec son avatar et sa note, et le repaie d'un geste
- Erreurs du portefeuille traduites en espagnol

**Corrections**

- Le tableau de bord d'administration ne plante plus sur la fenêtre « Nouveautés »
- Les soldes n'attendent plus jusqu'à 20 secondes un portefeuille muet
- Les échecs de paiement qui n'étaient que journalisés remontent maintenant au suivi des erreurs

Notes de version complètes : ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
