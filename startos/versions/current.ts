import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG = 'https://github.com/lawalletio/lawallet-nwc/releases'

export const current = VersionInfo.of({
  version: '2.10.0:0',
  releaseNotes: {
    en_US: `Updates LaWallet NWC from 2.9.0 to 2.10.1. (2.10.1 only fixes the Umbrel package; on StartOS it is the same as 2.10.0.)

Heads up:
- Card scans now always advertise up to 10,000,000 sats; an empty wallet refuses the payment at checkout instead.
- A card tap can answer OK before the payment settles when the balance clearly covers it. Owners can hide their balance from the terminal in card settings.
- Connected MCP apps now keep their sign-in for 24 hours between refreshes.

**New**

- Sign in with just an email address, with SMTP, AWS SES or Resend configured in Settings
- Sell sats for Argentine pesos to a CBU, CVU or alias through Bull Bitcoin or Wapu, with PDF receipts
- Limit each connected MCP app to chosen wallets
- The wallet opens instantly from its last session and shows an "Offline mode" badge without a connection
- Admin Tools page with a Lightning invoice lookup, and preference polls for users

**Fixes**

- A wallet that may hold funds is never archived automatically
- MCP clients such as Claude Code no longer lose their session on token refresh
- Fewer database round-trips on payments and balances, and lighter page loads

Full release notes: ${CHANGELOG}`,
    es_ES: `Actualiza LaWallet NWC de 2.9.0 a 2.10.1. (2.10.1 solo corrige el paquete de Umbrel; en StartOS es igual a 2.10.0.)

Atención:
- El escaneo de tarjetas ahora siempre anuncia hasta 10.000.000 sats; un monedero vacío rechaza el pago al cobrar.
- Un toque de tarjeta puede responder OK antes de que se liquide el pago cuando el saldo lo cubre de sobra. Los dueños pueden ocultar su saldo a la terminal en la configuración de tarjetas.
- Las aplicaciones MCP conectadas ahora mantienen la sesión 24 horas entre renovaciones.

**Novedades**

- Inicio de sesión con solo una dirección de email, con SMTP, AWS SES o Resend configurados en Ajustes
- Vende sats por pesos argentinos a un CBU, CVU o alias con Bull Bitcoin o Wapu, con comprobantes en PDF
- Limita cada aplicación MCP conectada a los monederos que elijas
- El monedero abre al instante con los datos de la última sesión y muestra "Modo sin conexión" cuando no hay red
- Página de Herramientas con búsqueda de facturas Lightning, y encuestas de preferencias para los usuarios

**Correcciones**

- Un monedero que puede tener fondos nunca se archiva automáticamente
- Clientes MCP como Claude Code ya no pierden la sesión al renovar el token
- Menos consultas a la base de datos en pagos y saldos, y páginas más livianas

Notas de la versión completas: ${CHANGELOG}`,
    de_DE: `Aktualisiert LaWallet NWC von 2.9.0 auf 2.10.1. (2.10.1 behebt nur das Umbrel-Paket; unter StartOS ist es identisch mit 2.10.0.)

Achtung:
- Karten-Scans bieten jetzt immer bis zu 10.000.000 Sats an; eine leere Wallet lehnt die Zahlung erst an der Kasse ab.
- Ein Karten-Tap kann OK melden, bevor die Zahlung abgeschlossen ist, wenn das Guthaben sie klar deckt. Besitzer können ihr Guthaben in den Karteneinstellungen vor dem Terminal verbergen.
- Verbundene MCP-Apps bleiben jetzt 24 Stunden zwischen Erneuerungen angemeldet.

**Neu**

- Anmeldung nur mit einer E-Mail-Adresse, mit SMTP, AWS SES oder Resend in den Einstellungen
- Sats gegen argentinische Pesos an ein CBU, CVU oder Alias verkaufen, über Bull Bitcoin oder Wapu, mit PDF-Belegen
- Jede verbundene MCP-App auf ausgewählte Wallets beschränken
- Die Wallet öffnet sofort mit den Daten der letzten Sitzung und zeigt ohne Verbindung „Offline-Modus"
- Admin-Seite „Tools" mit Lightning-Rechnungssuche und Umfragen für Nutzer

**Fehlerbehebungen**

- Eine Wallet, die Guthaben haben könnte, wird nie automatisch archiviert
- MCP-Clients wie Claude Code verlieren beim Token-Refresh nicht mehr ihre Sitzung
- Weniger Datenbankabfragen bei Zahlungen und Kontoständen, leichtere Seiten

Vollständige Versionshinweise: ${CHANGELOG}`,
    pl_PL: `Aktualizuje LaWallet NWC z 2.9.0 do 2.10.1. (2.10.1 naprawia tylko pakiet Umbrel; na StartOS jest taka sama jak 2.10.0.)

Uwaga:
- Skanowanie karty zawsze oferuje teraz do 10 000 000 satów; pusty portfel odrzuca płatność dopiero przy kasie.
- Dotknięcie karty może zwrócić OK przed rozliczeniem płatności, gdy saldo wyraźnie ją pokrywa. Właściciele mogą ukryć saldo przed terminalem w ustawieniach karty.
- Połączone aplikacje MCP pozostają teraz zalogowane 24 godziny między odświeżeniami.

**Nowości**

- Logowanie samym adresem e-mail, z SMTP, AWS SES lub Resend skonfigurowanym w Ustawieniach
- Sprzedaż satów za argentyńskie pesos na CBU, CVU lub alias przez Bull Bitcoin lub Wapu, z potwierdzeniami PDF
- Ograniczenie każdej połączonej aplikacji MCP do wybranych portfeli
- Portfel otwiera się od razu z danymi z ostatniej sesji i pokazuje „Tryb offline" bez połączenia
- Strona Narzędzia z wyszukiwaniem faktur Lightning oraz ankiety dla użytkowników

**Poprawki**

- Portfel, który może zawierać środki, nigdy nie jest archiwizowany automatycznie
- Klienci MCP, tacy jak Claude Code, nie tracą już sesji przy odświeżaniu tokenu
- Mniej zapytań do bazy danych przy płatnościach i saldach, lżejsze strony

Pełne informacje o wydaniach: ${CHANGELOG}`,
    fr_FR: `Met à jour LaWallet NWC de 2.9.0 vers 2.10.1. (2.10.1 corrige uniquement le paquet Umbrel ; sur StartOS, elle est identique à 2.10.0.)

Attention :
- Le scan d'une carte annonce désormais toujours jusqu'à 10 000 000 sats ; un portefeuille vide refuse le paiement à l'encaissement.
- Un passage de carte peut répondre OK avant le règlement du paiement quand le solde le couvre largement. Les propriétaires peuvent masquer leur solde au terminal dans les réglages des cartes.
- Les applications MCP connectées restent désormais connectées 24 heures entre deux renouvellements.

**Nouveautés**

- Connexion avec une simple adresse e-mail, via SMTP, AWS SES ou Resend configurés dans les Réglages
- Vendre des sats contre des pesos argentins vers un CBU, CVU ou alias via Bull Bitcoin ou Wapu, avec reçus PDF
- Limiter chaque application MCP connectée aux portefeuilles choisis
- Le portefeuille s'ouvre instantanément avec la dernière session et affiche « Mode hors ligne » sans connexion
- Page Outils avec recherche de factures Lightning, et sondages pour les utilisateurs

**Corrections**

- Un portefeuille susceptible de contenir des fonds n'est jamais archivé automatiquement
- Les clients MCP comme Claude Code ne perdent plus leur session au renouvellement du jeton
- Moins d'allers-retours avec la base de données pour les paiements et les soldes, pages plus légères

Notes de version complètes : ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
