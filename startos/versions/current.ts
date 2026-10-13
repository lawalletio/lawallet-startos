import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG = 'https://github.com/lawalletio/lawallet-nwc/releases'

export const current = VersionInfo.of({
  version: '2.8.0:0',
  releaseNotes: {
    en_US: `Updates LaWallet NWC from 2.7.1 to 2.8.0.

Heads up:
- Data retention is on: activity log entries, forwarding hops and finished notification deliveries older than 90 days are deleted.
- Unpaid invoices more than an hour past their expiry are marked expired.
- Browser page translation is disabled, because it crashed the app.

**Features (2.7.2)**

- New cardholders can start with a passkey or a Nostr key, get their first Lightning Address free, and are led into the wallet
- BoltCard top-up through a LUD-19 payLink, receive invoices charged by a card tap, payer notes on send, and no more 10,000 sat card ceiling
- Simpler NWC wallet setup, receive from the home screen, a payment sound picker, and currency preferences saved to the account
- Remote MCP server with OAuth 2.1 for AI agents

**Speed and stability (2.8.0)**

- Every wallet and admin screen has its own error boundary, so one failing screen no longer takes the app down
- Faster wallet start with a 19% smaller bundle; profiles and NIP-05 no longer wait on relays
- Fewer database queries, new indexes, a cheaper Lightning Address lookup, and a listener that idles when there is nothing to do

Full release notes: ${CHANGELOG}`,
    es_ES: `Actualiza LaWallet NWC de 2.7.1 a 2.8.0.

Atención:
- La retención de datos está activada: se borran las entradas del registro de actividad, los tramos de reenvío y las notificaciones finalizadas con más de 90 días.
- Las facturas impagas que llevan más de una hora vencidas se marcan como expiradas.
- La traducción de páginas del navegador está desactivada, porque hacía fallar la aplicación.

**Novedades (2.7.2)**

- Los nuevos titulares de tarjeta pueden empezar con una passkey o una clave Nostr, reciben su primera Lightning Address gratis y se les guía hasta el monedero
- Recarga de BoltCard mediante payLink LUD-19, facturas de cobro pagadas acercando la tarjeta, notas del pagador al enviar y sin el límite de 10.000 sats por tarjeta
- Alta de monederos NWC más sencilla, cobrar desde la pantalla de inicio, selector de sonido de pago y preferencias de moneda guardadas en la cuenta
- Servidor MCP remoto con OAuth 2.1 para agentes de IA

**Velocidad y estabilidad (2.8.0)**

- Cada pantalla del monedero y de administración tiene su propio límite de errores, así que una pantalla que falla ya no tumba la aplicación
- Arranque del monedero más rápido con un paquete un 19% más pequeño; los perfiles y NIP-05 ya no esperan a los relés
- Menos consultas a la base de datos, índices nuevos, una búsqueda de Lightning Address más barata y un listener que reposa cuando no hay nada que hacer

Notas de la versión completas: ${CHANGELOG}`,
    de_DE: `Aktualisiert LaWallet NWC von 2.7.1 auf 2.8.0.

Achtung:
- Datenaufbewahrung ist aktiv: Aktivitätsprotokoll-Einträge, Weiterleitungs-Teilstrecken und abgeschlossene Benachrichtigungen, die älter als 90 Tage sind, werden gelöscht.
- Unbezahlte Rechnungen, die seit mehr als einer Stunde abgelaufen sind, werden als abgelaufen markiert.
- Die Seitenübersetzung des Browsers ist deaktiviert, weil sie die App abstürzen ließ.

**Funktionen (2.7.2)**

- Neue Karteninhaber können mit einem Passkey oder einem Nostr-Schlüssel starten, erhalten ihre erste Lightning-Adresse kostenlos und werden in die Wallet geführt
- BoltCard-Aufladung per LUD-19-payLink, Empfangsrechnungen per Kartentipp bezahlt, Zahlernotizen beim Senden und keine 10.000-Sat-Obergrenze pro Karte mehr
- Einfachere Einrichtung von NWC-Wallets, Empfangen vom Startbildschirm, Auswahl des Zahlungstons und Währungseinstellungen im Konto gespeichert
- Remote-MCP-Server mit OAuth 2.1 für KI-Agenten

**Geschwindigkeit und Stabilität (2.8.0)**

- Jeder Wallet- und Admin-Bildschirm hat eine eigene Fehlergrenze, ein fehlerhafter Bildschirm legt die App nicht mehr lahm
- Schnellerer Wallet-Start mit 19% kleinerem Bundle; Profile und NIP-05 warten nicht mehr auf Relays
- Weniger Datenbankabfragen, neue Indizes, eine günstigere Lightning-Adress-Abfrage und ein Listener, der ruht, wenn nichts zu tun ist

Vollständige Versionshinweise: ${CHANGELOG}`,
    pl_PL: `Aktualizuje LaWallet NWC z 2.7.1 do 2.8.0.

Uwaga:
- Retencja danych jest włączona: wpisy dziennika aktywności, odcinki przekazywania i zakończone powiadomienia starsze niż 90 dni są usuwane.
- Nieopłacone faktury przeterminowane o ponad godzinę są oznaczane jako wygasłe.
- Tłumaczenie stron w przeglądarce jest wyłączone, bo powodowało awarie aplikacji.

**Nowości (2.7.2)**

- Nowi posiadacze kart mogą zacząć z kluczem dostępu (passkey) lub kluczem Nostr, dostają pierwszy adres Lightning za darmo i są prowadzeni do portfela
- Doładowanie BoltCard przez payLink LUD-19, faktury odbioru opłacane zbliżeniem karty, notatki płatnika przy wysyłce i brak limitu 10 000 satów na kartę
- Prostsze dodawanie portfela NWC, odbiór z ekranu głównego, wybór dźwięku płatności i preferencje waluty zapisane na koncie
- Zdalny serwer MCP z OAuth 2.1 dla agentów AI

**Szybkość i stabilność (2.8.0)**

- Każdy ekran portfela i administracji ma własną granicę błędów, więc jeden wadliwy ekran nie wyłącza już całej aplikacji
- Szybszy start portfela z pakietem mniejszym o 19%; profile i NIP-05 nie czekają już na przekaźniki
- Mniej zapytań do bazy danych, nowe indeksy, tańsze wyszukiwanie adresu Lightning i listener, który odpoczywa, gdy nie ma nic do zrobienia

Pełne informacje o wydaniach: ${CHANGELOG}`,
    fr_FR: `Met à jour LaWallet NWC de 2.7.1 vers 2.8.0.

Attention :
- La rétention des données est active : les entrées du journal d'activité, les tronçons de transfert et les notifications terminées de plus de 90 jours sont supprimés.
- Les factures impayées expirées depuis plus d'une heure sont marquées comme expirées.
- La traduction de pages du navigateur est désactivée, car elle faisait planter l'application.

**Fonctionnalités (2.7.2)**

- Les nouveaux titulaires de carte peuvent démarrer avec une passkey ou une clé Nostr, reçoivent leur première adresse Lightning gratuitement et sont guidés jusqu'au portefeuille
- Recharge BoltCard via un payLink LUD-19, factures de réception réglées d'un geste de la carte, notes du payeur à l'envoi, et plus de plafond de 10 000 sats par carte
- Ajout d'un portefeuille NWC simplifié, réception depuis l'écran d'accueil, choix du son de paiement et préférences de devise enregistrées sur le compte
- Serveur MCP distant avec OAuth 2.1 pour les agents IA

**Vitesse et stabilité (2.8.0)**

- Chaque écran du portefeuille et de l'administration a sa propre barrière d'erreur : un écran en échec ne fait plus tomber l'application
- Démarrage du portefeuille plus rapide avec un bundle 19 % plus léger ; les profils et NIP-05 n'attendent plus les relais
- Moins de requêtes en base, de nouveaux index, une recherche d'adresse Lightning moins coûteuse et un listener qui se met en veille quand il n'a rien à faire

Notes de version complètes : ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
