import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG = 'https://github.com/lawalletio/lawallet-nwc/releases'

export const current = VersionInfo.of({
  version: '2.7.1:1',
  releaseNotes: {
    en_US: `Updates LaWallet NWC from 2.0.0 to 2.7.1.

Heads up:
- A backup made before this version cannot be restored into it. Take a new backup after updating.
- The DEFAULT_NWC address mode was removed in 2.3.0. An address now names its wallet explicitly instead of inheriting whichever wallet your primary address pointed at. Check that each address is bound to the wallet you expect after updating.
- The Alby Hub sub-account integration is removed, and its settings are deleted on update. The legacy "subdomain" setting is folded into "domain"; a blank public endpoint now defaults to https://<domain>.

**Features**

- Receive forwarding: an NWC wallet can forward everything it receives to one or more Lightning Addresses, split by weight, with per-leg fee and routing-reserve accounting (2.3.0), and recovery for payments left stranded mid-forward (2.5.0)
- NIP-57 zap receipts and LUD-21 payment verification for wallet-backed invoices, plus per-wallet notifications (2.3.0); receipts now settle for every NWC wallet, including ones that send no payment notifications (2.7.0)
- Vouchers: a coupon stash compatible with the lacrypta/coupons protocol, with a deposit policy and sender allowlist (2.7.0)
- A protocol capability view showing which of LUD-16, NIP-05, LUD-21, NIP-57 and LUD-12 each address actually speaks (2.3.0)
- MASTER account-recovery cards, which follow the account rather than the physical card (2.2.0); first activation of a never-paired card binds a working wallet and reserves one free Lightning Address (2.7.0)
- Deferred Lightning Address proxy settlement and a full-screen claim flow (2.1.0)
- One shared Lightning Address input across the app, with saved-recipient suggestions and avatars (2.6.0)
- NWC wallets idle for more than 48 hours are archived automatically (2.7.0)
- Wallet: keyboard input on the keypad, a shared payment receipt on send and receive, and mobile PWA sessions that stay logged in (2.7.0)
- Realtime payment cue and balance animation when a settlement lands; activity rows open that same receipt; receive amount reuses send's currency switch (2.7.1)
- Admin: a Verify Protocols scan that finds stale alias chips (2.7.0)

**Security**

- Hardening across rate limiting, JWT sessions, settings secrets and webhook intake, plus optional Sentry monitoring (2.4.0)
- BoltCard write-token consumption is atomic, closing a window that could leak card keys (2.7.0)
- Closed a pubkey-existence oracle on the user relays endpoint and stopped logging a bearer token in cleartext (2.7.0)
- Sentry reports are scrubbed of event tags and bearer-token path segments; Next.js updated to 16.3.4 (2.7.0)

**Fixes**

- Residual routing-reserve legs survive a receive-config edit; revoked and dead wallets are hidden from the forwarding map
- Webhook delivery times out DNS lookups and no longer overlaps inline retries
- Stale RECEIVE mode no longer blocks card spends permanently

Full release notes: ${CHANGELOG}`,
    es_ES: `Actualiza LaWallet NWC de 2.0.0 a 2.7.1.

Atención:
- Una copia de seguridad hecha antes de esta versión no se puede restaurar en ella. Haz una nueva copia después de actualizar.
- El modo de dirección DEFAULT_NWC se eliminó en 2.3.0. Ahora cada dirección indica explícitamente su monedero en lugar de heredar el de la dirección principal. Comprueba que cada dirección quede vinculada al monedero que esperas después de actualizar.
- Se elimina la integración de subcuentas de Alby Hub y sus ajustes se borran al actualizar. El ajuste heredado "subdomain" se integra en "domain"; un endpoint público vacío ahora toma por defecto https://<domain>.

**Novedades**

- Reenvío de cobros: un monedero NWC puede reenviar todo lo que recibe a una o varias Lightning Address, repartido por peso, con contabilidad de comisiones y reserva de enrutamiento por tramo (2.3.0), y recuperación de pagos que quedaron a medio reenviar (2.5.0)
- Recibos de zaps NIP-57 y verificación de pagos LUD-21 para facturas respaldadas por monedero, además de notificaciones por monedero (2.3.0); los recibos ahora se liquidan con cualquier monedero NWC, incluso los que no envían notificaciones de pago (2.7.0)
- Vales: un depósito de cupones compatible con el protocolo lacrypta/coupons, con política de depósito y lista de remitentes permitidos (2.7.0)
- Una vista de capacidades de protocolo que muestra cuáles de LUD-16, NIP-05, LUD-21, NIP-57 y LUD-12 habla cada dirección (2.3.0)
- Tarjetas MASTER de recuperación de cuenta, que siguen a la cuenta y no a la tarjeta física (2.2.0); la primera activación de una tarjeta nunca emparejada vincula un monedero operativo y reserva una Lightning Address gratuita (2.7.0)
- Liquidación diferida del proxy de Lightning Address y un flujo de reclamo a pantalla completa (2.1.0)
- Un único campo de Lightning Address compartido en toda la aplicación, con sugerencias de destinatarios guardados y avatares (2.6.0)
- Los monederos NWC inactivos más de 48 horas se archivan automáticamente (2.7.0)
- Monedero: entrada por teclado en el teclado numérico, un recibo de pago compartido al enviar y recibir, y sesiones PWA móviles que permanecen iniciadas (2.7.0)
- Aviso de pago en tiempo real y animación del saldo cuando entra un cobro; las filas de actividad abren ese mismo recibo; el importe a cobrar reutiliza el selector de moneda del envío (2.7.1)
- Administración: un análisis Verify Protocols que detecta alias obsoletos (2.7.0)

**Seguridad**

- Refuerzo en límites de tasa, sesiones JWT, secretos de configuración y recepción de webhooks, además de monitorización opcional con Sentry (2.4.0)
- El consumo del token de escritura de BoltCard es atómico, cerrando una ventana que podía filtrar claves de tarjeta (2.7.0)
- Cerrado un oráculo de existencia de pubkey en el endpoint de relés del usuario y eliminado el registro en claro de un token bearer (2.7.0)
- Los informes de Sentry se limpian de etiquetas de eventos y segmentos de ruta con tokens bearer; Next.js actualizado a 16.3.4 (2.7.0)

**Correcciones**

- Los tramos residuales de reserva de enrutamiento sobreviven a la edición de la configuración de cobro; los monederos revocados o muertos se ocultan del mapa de reenvío
- La entrega de webhooks aplica tiempo de espera a las consultas DNS y ya no se solapa con los reintentos en línea
- Un modo RECEIVE obsoleto ya no bloquea permanentemente los gastos con tarjeta

Notas de la versión completas: ${CHANGELOG}`,
    de_DE: `Aktualisiert LaWallet NWC von 2.0.0 auf 2.7.1.

Achtung:
- Eine Sicherung, die vor dieser Version erstellt wurde, lässt sich nicht darin wiederherstellen. Erstelle nach dem Update eine neue Sicherung.
- Der Adressmodus DEFAULT_NWC wurde in 2.3.0 entfernt. Eine Adresse benennt ihre Wallet jetzt ausdrücklich, statt die der primären Adresse zu übernehmen. Prüfe nach dem Update, ob jede Adresse mit der erwarteten Wallet verknüpft ist.
- Die Alby-Hub-Unterkonto-Integration wurde entfernt, ihre Einstellungen werden beim Update gelöscht. Die veraltete Einstellung „subdomain“ geht in „domain“ auf; ein leerer öffentlicher Endpunkt lautet jetzt standardmäßig https://<domain>.

**Funktionen**

- Weiterleitung von Eingängen: Eine NWC-Wallet kann alles Empfangene an eine oder mehrere Lightning-Adressen weiterleiten, gewichtet aufgeteilt, mit Abrechnung von Gebühren und Routing-Reserve pro Teilstrecke (2.3.0), sowie Wiederherstellung für mitten in der Weiterleitung hängen gebliebene Zahlungen (2.5.0)
- NIP-57-Zap-Belege und LUD-21-Zahlungsprüfung für Wallet-gedeckte Rechnungen, dazu Benachrichtigungen pro Wallet (2.3.0); Belege werden jetzt für jede NWC-Wallet abgewickelt, auch für solche ohne Zahlungsbenachrichtigungen (2.7.0)
- Gutscheine: ein Coupon-Depot, kompatibel mit dem lacrypta/coupons-Protokoll, mit Einzahlungsregel und Absender-Freigabeliste (2.7.0)
- Eine Protokollübersicht, die zeigt, welche von LUD-16, NIP-05, LUD-21, NIP-57 und LUD-12 jede Adresse tatsächlich beherrscht (2.3.0)
- MASTER-Karten zur Kontowiederherstellung, die dem Konto statt der physischen Karte folgen (2.2.0); die erste Aktivierung einer nie gekoppelten Karte bindet eine funktionierende Wallet und reserviert eine kostenlose Lightning-Adresse (2.7.0)
- Aufgeschobene Abwicklung des Lightning-Adress-Proxys und ein Vollbild-Einlöseablauf (2.1.0)
- Ein gemeinsames Lightning-Adress-Eingabefeld in der ganzen App, mit Vorschlägen gespeicherter Empfänger und Avataren (2.6.0)
- NWC-Wallets, die länger als 48 Stunden inaktiv sind, werden automatisch archiviert (2.7.0)
- Wallet: Tastatureingabe auf dem Ziffernblock, ein gemeinsamer Zahlungsbeleg beim Senden und Empfangen sowie mobile PWA-Sitzungen, die angemeldet bleiben (2.7.0)
- Echtzeit-Zahlungshinweis und Saldoanimation, wenn eine Zahlung eingeht; Aktivitätszeilen öffnen denselben Beleg; der Empfangsbetrag verwendet denselben Währungsschalter wie das Senden (2.7.1)
- Admin: ein Verify-Protocols-Scan, der veraltete Alias-Chips findet (2.7.0)

**Sicherheit**

- Härtung bei Rate-Limits, JWT-Sitzungen, Einstellungsgeheimnissen und Webhook-Annahme, dazu optionales Sentry-Monitoring (2.4.0)
- Der Verbrauch des BoltCard-Schreibtokens ist atomar; das schließt ein Zeitfenster, in dem Kartenschlüssel abfließen konnten (2.7.0)
- Ein Pubkey-Existenz-Orakel am Relays-Endpunkt des Nutzers geschlossen und die Klartext-Protokollierung eines Bearer-Tokens beendet (2.7.0)
- Sentry-Berichte werden um Event-Tags und Bearer-Token-Pfadsegmente bereinigt; Next.js auf 16.3.4 aktualisiert (2.7.0)

**Korrekturen**

- Verbleibende Routing-Reserve-Teilstrecken überstehen das Bearbeiten der Empfangskonfiguration; widerrufene und tote Wallets werden in der Weiterleitungskarte ausgeblendet
- Die Webhook-Zustellung begrenzt DNS-Abfragen zeitlich und überschneidet sich nicht mehr mit Inline-Wiederholungen
- Ein veralteter RECEIVE-Modus blockiert Kartenzahlungen nicht mehr dauerhaft

Vollständige Versionshinweise: ${CHANGELOG}`,
    pl_PL: `Aktualizuje LaWallet NWC z 2.0.0 do 2.7.1.

Uwaga:
- Kopia zapasowa zrobiona przed tą wersją nie da się przywrócić do niej. Po aktualizacji zrób nową kopię.
- Tryb adresu DEFAULT_NWC został usunięty w 2.3.0. Adres wskazuje teraz swój portfel wprost, zamiast dziedziczyć portfel adresu głównego. Po aktualizacji sprawdź, czy każdy adres jest powiązany z oczekiwanym portfelem.
- Integracja subkont Alby Hub została usunięta, a jej ustawienia są kasowane przy aktualizacji. Stare ustawienie „subdomain” zostaje scalone z „domain”; pusty publiczny endpoint domyślnie przyjmuje teraz https://<domain>.

**Nowości**

- Przekazywanie wpłat: portfel NWC może przekazywać wszystko, co otrzyma, na jeden lub więcej adresów Lightning, dzieląc według wag, z rozliczeniem opłat i rezerwy routingu dla każdego odcinka (2.3.0), oraz odzyskiwanie płatności zawieszonych w trakcie przekazywania (2.5.0)
- Pokwitowania zapów NIP-57 i weryfikacja płatności LUD-21 dla faktur obsługiwanych portfelem, a także powiadomienia dla każdego portfela (2.3.0); pokwitowania rozliczają się teraz dla każdego portfela NWC, także tych, które nie wysyłają powiadomień o płatności (2.7.0)
- Vouchery: skarbonka kuponów zgodna z protokołem lacrypta/coupons, z polityką wpłat i listą dozwolonych nadawców (2.7.0)
- Widok możliwości protokołów pokazujący, które z LUD-16, NIP-05, LUD-21, NIP-57 i LUD-12 obsługuje dany adres (2.3.0)
- Karty MASTER do odzyskiwania konta, przypisane do konta, a nie do fizycznej karty (2.2.0); pierwsza aktywacja nigdy niesparowanej karty wiąże działający portfel i rezerwuje jeden darmowy adres Lightning (2.7.0)
- Odroczone rozliczenie proxy adresu Lightning i pełnoekranowy proces odbioru (2.1.0)
- Jedno wspólne pole adresu Lightning w całej aplikacji, z podpowiedziami zapisanych odbiorców i awatarami (2.6.0)
- Portfele NWC bezczynne ponad 48 godzin są archiwizowane automatycznie (2.7.0)
- Portfel: wprowadzanie z klawiatury na klawiaturze numerycznej, wspólne pokwitowanie płatności przy wysyłaniu i odbieraniu oraz mobilne sesje PWA, które pozostają zalogowane (2.7.0)
- Podpowiedź o płatności na żywo i animacja salda, gdy wpłata się rozliczy; wiersze aktywności otwierają to samo pokwitowanie; kwota odbioru korzysta z przełącznika waluty używanego przy wysyłce (2.7.1)
- Administracja: skan Verify Protocols wykrywający nieaktualne aliasy (2.7.0)

**Bezpieczeństwo**

- Wzmocnienie w limitach zapytań, sesjach JWT, sekretach ustawień i przyjmowaniu webhooków, plus opcjonalny monitoring Sentry (2.4.0)
- Zużycie tokenu zapisu BoltCard jest atomowe, co zamyka okno, w którym mogły wyciec klucze karty (2.7.0)
- Zamknięto wyrocznię istnienia pubkey na endpoincie przekaźników użytkownika i zaprzestano logowania tokenu bearer w postaci jawnej (2.7.0)
- Raporty Sentry są oczyszczane z tagów zdarzeń i segmentów ścieżek z tokenami bearer; Next.js zaktualizowany do 16.3.4 (2.7.0)

**Poprawki**

- Pozostałe odcinki rezerwy routingu przetrwają edycję konfiguracji odbioru; odwołane i martwe portfele są ukrywane na mapie przekazywania
- Dostarczanie webhooków ma limit czasu na zapytania DNS i nie nakłada się już na ponowienia inline
- Nieaktualny tryb RECEIVE nie blokuje już na stałe płatności kartą

Pełne informacje o wydaniach: ${CHANGELOG}`,
    fr_FR: `Met à jour LaWallet NWC de 2.0.0 vers 2.7.1.

Attention :
- Une sauvegarde faite avant cette version ne peut pas y être restaurée. Faites une nouvelle sauvegarde après la mise à jour.
- Le mode d'adresse DEFAULT_NWC a été supprimé en 2.3.0. Une adresse désigne désormais explicitement son portefeuille au lieu d'hériter de celui de l'adresse principale. Après la mise à jour, vérifiez que chaque adresse est liée au portefeuille attendu.
- L'intégration des sous-comptes Alby Hub est supprimée et ses réglages sont effacés à la mise à jour. L'ancien réglage « subdomain » est fusionné dans « domain » ; un point de terminaison public vide vaut désormais https://<domain> par défaut.

**Fonctionnalités**

- Transfert des encaissements : un portefeuille NWC peut transférer tout ce qu'il reçoit vers une ou plusieurs adresses Lightning, réparti par poids, avec comptabilité des frais et de la réserve de routage par tronçon (2.3.0), et récupération des paiements bloqués en cours de transfert (2.5.0)
- Reçus de zaps NIP-57 et vérification de paiement LUD-21 pour les factures adossées à un portefeuille, ainsi que des notifications par portefeuille (2.3.0) ; les reçus se règlent désormais pour tout portefeuille NWC, y compris ceux qui n'envoient aucune notification de paiement (2.7.0)
- Bons : une réserve de coupons compatible avec le protocole lacrypta/coupons, avec politique de dépôt et liste d'expéditeurs autorisés (2.7.0)
- Une vue des capacités de protocole indiquant lesquelles de LUD-16, NIP-05, LUD-21, NIP-57 et LUD-12 chaque adresse parle réellement (2.3.0)
- Cartes MASTER de récupération de compte, rattachées au compte plutôt qu'à la carte physique (2.2.0) ; la première activation d'une carte jamais appairée lie un portefeuille opérationnel et réserve une adresse Lightning gratuite (2.7.0)
- Règlement différé du proxy d'adresse Lightning et un parcours de réclamation en plein écran (2.1.0)
- Un champ d'adresse Lightning unique partagé dans toute l'application, avec suggestions de destinataires enregistrés et avatars (2.6.0)
- Les portefeuilles NWC inactifs depuis plus de 48 heures sont archivés automatiquement (2.7.0)
- Portefeuille : saisie au clavier sur le pavé numérique, un reçu de paiement commun à l'envoi et à la réception, et des sessions PWA mobiles qui restent connectées (2.7.0)
- Indicateur de paiement en temps réel et animation du solde à l'arrivée d'un règlement ; les lignes d'activité ouvrent ce même reçu ; le montant à recevoir réutilise le sélecteur de devise de l'envoi (2.7.1)
- Administration : une analyse Verify Protocols qui repère les alias obsolètes (2.7.0)

**Sécurité**

- Renforcement sur les limites de débit, les sessions JWT, les secrets de configuration et la réception des webhooks, plus une surveillance Sentry optionnelle (2.4.0)
- La consommation du jeton d'écriture BoltCard est atomique, ce qui ferme une fenêtre pouvant divulguer des clés de carte (2.7.0)
- Fermeture d'un oracle d'existence de pubkey sur le point de terminaison des relais utilisateur et fin de la journalisation en clair d'un jeton bearer (2.7.0)
- Les rapports Sentry sont expurgés des tags d'événements et des segments de chemin contenant des jetons bearer ; Next.js mis à jour en 16.3.4 (2.7.0)

**Correctifs**

- Les tronçons résiduels de réserve de routage survivent à la modification de la configuration de réception ; les portefeuilles révoqués ou morts sont masqués de la carte de transfert
- La livraison des webhooks limite la durée des résolutions DNS et ne chevauche plus les nouvelles tentatives en ligne
- Un mode RECEIVE obsolète ne bloque plus définitivement les dépenses par carte

Notes de version complètes : ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
