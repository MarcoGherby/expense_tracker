"use strict";

// Italian text is the key (and the Italian version). Each entry is [English, German, Spanish].
// Text that is not in this table is shown as written (for example user descriptions).
const LOCALES = { it: "it-IT", en: "en-GB", de: "de-DE", es: "es-ES" };
const LANG_INDEX = { en: 0, de: 1, es: 2 };
const KEY_LANGUAGE = "expense_tracker_language";

const FREQ = {
  it: { one: ["ogni settimana", "ogni mese", "ogni anno"], many: ["ogni {0} settimane", "ogni {0} mesi", "ogni {0} anni"] },
  en: { one: ["every week", "every month", "every year"], many: ["every {0} weeks", "every {0} months", "every {0} years"] },
  de: { one: ["jede Woche", "jeden Monat", "jedes Jahr"], many: ["alle {0} Wochen", "alle {0} Monate", "alle {0} Jahre"] },
  es: { one: ["cada semana", "cada mes", "cada año"], many: ["cada {0} semanas", "cada {0} meses", "cada {0} años"] },
};

const DICT = {
  // Navigation and headings
  "Lingua": ["Language", "Sprache", "Idioma"],
  "Sezioni": ["Sections", "Bereiche", "Secciones"],
  "Mese": ["Month", "Monat", "Mes"],
  "Anno": ["Year", "Jahr", "Año"],
  "Piani": ["Plans", "Pläne", "Planes"],
  "Impostazioni": ["Settings", "Einstellungen", "Ajustes"],
  "Entrate": ["Income", "Einnahmen", "Ingresos"],
  "Uscite": ["Expenses", "Ausgaben", "Gastos"],
  "Saldo": ["Balance", "Saldo", "Saldo"],
  "Entrata": ["Income", "Einnahme", "Ingreso"],
  "Uscita": ["Expense", "Ausgabe", "Gasto"],

  // Budgets
  "Budget mensile": ["Monthly budget", "Monatsbudget", "Presupuesto mensual"],
  "Budget annuale": ["Annual budget", "Jahresbudget", "Presupuesto anual"],
  "Importo budget mensile": ["Monthly budget amount", "Betrag des Monatsbudgets", "Importe del presupuesto mensual"],
  "Importo budget annuale": ["Annual budget amount", "Betrag des Jahresbudgets", "Importe del presupuesto anual"],
  "Per tutti i mesi": ["For all months", "Für alle Monate", "Para todos los meses"],
  "Solo questo mese": ["This month only", "Nur dieser Monat", "Solo este mes"],
  "Torna al budget standard": ["Back to the standard budget", "Zurück zum Standardbudget", "Volver al presupuesto estándar"],
  "Rimuovi budget": ["Remove budget", "Budget entfernen", "Quitar presupuesto"],
  "Imposta budget annuale": ["Set annual budget", "Jahresbudget festlegen", "Definir presupuesto anual"],
  "Usa la somma dei budget mensili": ["Use the sum of the monthly budgets", "Summe der Monatsbudgets verwenden", "Usar la suma de los presupuestos mensuales"],
  "Nessun budget impostato (facoltativo)": ["No budget set (optional)", "Kein Budget festgelegt (optional)", "Sin presupuesto (opcional)"],
  "Il budget è facoltativo: se lo imposti, vedrai accanto alle uscite la percentuale rispetto al budget.": [
    "The budget is optional: if you set one, you will see the percentage of it next to your expenses.",
    "Das Budget ist optional: Wenn du eines festlegst, siehst du neben den Ausgaben den Prozentsatz davon.",
    "El presupuesto es opcional: si lo defines, verás junto a los gastos el porcentaje respecto al presupuesto."],
  "del budget": ["of budget", "des Budgets", "del presupuesto"],
  "Budget: {0}": ["Budget: {0}", "Budget: {0}", "Presupuesto: {0}"],
  " (solo questo mese)": [" (this month only)", " (nur dieser Monat)", " (solo este mes)"],
  "Restano {0}": ["{0} left", "{0} übrig", "Quedan {0}"],
  "Sforato di {0}": ["Over by {0}", "Überschritten um {0}", "Excedido en {0}"],
  "Calcolato come somma dei budget dei 12 mesi.": ["Calculated as the sum of the 12 monthly budgets.", "Berechnet als Summe der 12 Monatsbudgets.", "Calculado como la suma de los 12 presupuestos mensuales."],
  "Impostato a mano (vale per ogni anno).": ["Set manually (applies to every year).", "Manuell festgelegt (gilt für jedes Jahr).", "Definido a mano (vale para todos los años)."],
  "Budget impostato solo per questo mese.": ["Budget set for this month only.", "Budget nur für diesen Monat festgelegt.", "Presupuesto definido solo para este mes."],
  "Questo mese usa di nuovo il budget standard.": ["This month uses the standard budget again.", "Dieser Monat nutzt wieder das Standardbudget.", "Este mes vuelve a usar el presupuesto estándar."],
  "Budget mensile aggiornato.": ["Monthly budget updated.", "Monatsbudget aktualisiert.", "Presupuesto mensual actualizado."],
  "Budget rimosso.": ["Budget removed.", "Budget entfernt.", "Presupuesto eliminado."],
  "Budget annuale aggiornato.": ["Annual budget updated.", "Jahresbudget aktualisiert.", "Presupuesto anual actualizado."],
  "Budget annuale = somma dei budget mensili.": ["Annual budget = sum of the monthly budgets.", "Jahresbudget = Summe der Monatsbudgets.", "Presupuesto anual = suma de los presupuestos mensuales."],
  "Inserisci un budget valido.": ["Enter a valid budget.", "Gib ein gültiges Budget ein.", "Introduce un presupuesto válido."],
  "Inserisci un budget annuale valido.": ["Enter a valid annual budget.", "Gib ein gültiges Jahresbudget ein.", "Introduce un presupuesto anual válido."],
  "oltre budget": ["over budget", "über Budget", "excede el presupuesto"],

  // Transactions
  "Nuova transazione": ["New transaction", "Neue Buchung", "Nueva transacción"],
  "Modifica transazione": ["Edit transaction", "Buchung bearbeiten", "Editar transacción"],
  "Scatta scontrino": ["Scan receipt", "Beleg fotografieren", "Escanear ticket"],
  "Scegli foto": ["Choose photo", "Foto wählen", "Elegir foto"],
  "Testo letto dallo scontrino": ["Text read from the receipt", "Vom Beleg gelesener Text", "Texto leído del ticket"],
  "Tipo": ["Type", "Art", "Tipo"],
  "Categoria": ["Category", "Kategorie", "Categoría"],
  "Descrizione": ["Description", "Beschreibung", "Descripción"],
  "Importo": ["Amount", "Betrag", "Importe"],
  "Data": ["Date", "Datum", "Fecha"],
  "Aggiungi transazione": ["Add transaction", "Buchung hinzufügen", "Añadir transacción"],
  "Salva modifiche": ["Save changes", "Änderungen speichern", "Guardar cambios"],
  "Annulla modifica": ["Cancel editing", "Bearbeitung abbrechen", "Cancelar edición"],
  "Uscite per categoria": ["Expenses by category", "Ausgaben nach Kategorie", "Gastos por categoría"],
  "Transazioni del mese": ["Transactions this month", "Buchungen des Monats", "Transacciones del mes"],
  "Modifica": ["Edit", "Bearbeiten", "Editar"],
  "Elimina": ["Delete", "Löschen", "Eliminar"],
  "Nessuna uscita in questo mese.": ["No expenses this month.", "Keine Ausgaben in diesem Monat.", "Sin gastos este mes."],
  "Nessuna transazione. Aggiungine una con il modulo qui sopra.": ["No transactions. Add one with the form above.", "Keine Buchungen. Füge mit dem Formular oben eine hinzu.", "Sin transacciones. Añade una con el formulario de arriba."],
  "in programma": ["scheduled", "geplant", "programado"],
  "(abbonamento)": ["(subscription)", "(Abo)", "(suscripción)"],
  "(rata {0}/{1})": ["(payment {0}/{1})", "(Rate {0}/{1})", "(cuota {0}/{1})"],
  "Transazione aggiunta.": ["Transaction added.", "Buchung hinzugefügt.", "Transacción añadida."],
  "Transazione aggiornata.": ["Transaction updated.", "Buchung aktualisiert.", "Transacción actualizada."],
  "Transazione eliminata.": ["Transaction deleted.", "Buchung gelöscht.", "Transacción eliminada."],
  "Eliminare questa transazione?": ["Delete this transaction?", "Diese Buchung löschen?", "¿Eliminar esta transacción?"],
  "Controlla tipo, descrizione e categoria.": ["Check type, description and category.", "Prüfe Art, Beschreibung und Kategorie.", "Revisa el tipo, la descripción y la categoría."],
  "Inserisci un importo positivo e una data valida.": ["Enter a positive amount and a valid date.", "Gib einen positiven Betrag und ein gültiges Datum ein.", "Introduce un importe positivo y una fecha válida."],
  "Impossibile salvare i dati su questo dispositivo.": ["Could not save the data on this device.", "Die Daten konnten auf diesem Gerät nicht gespeichert werden.", "No se pudieron guardar los datos en este dispositivo."],

  // Receipt scan
  "Preparo la foto...": ["Preparing the photo...", "Foto wird vorbereitet...", "Preparando la foto..."],
  "Carico il lettore di testo (la prima volta serve internet)...": ["Loading the text reader (internet is needed the first time)...", "Texterkennung wird geladen (beim ersten Mal ist Internet nötig)...", "Cargando el lector de texto (la primera vez hace falta internet)..."],
  "Leggo lo scontrino... {0}%": ["Reading the receipt... {0}%", "Beleg wird gelesen... {0}%", "Leyendo el ticket... {0}%"],
  "Controlla importo, categoria e data, poi premi Aggiungi.": ["Check amount, category and date, then press Add.", "Prüfe Betrag, Kategorie und Datum und tippe dann auf Hinzufügen.", "Revisa importe, categoría y fecha y pulsa Añadir."],
  "Non sono riuscito a leggere {0}: completa a mano e controlla i campi.": ["Could not read {0}: fill it in by hand and check the fields.", "{0} konnte nicht gelesen werden: bitte von Hand ergänzen und die Felder prüfen.", "No pude leer {0}: complétalo a mano y revisa los campos."],
  "il totale": ["the total", "die Summe", "el total"],
  "la categoria": ["the category", "die Kategorie", "la categoría"],
  "la data": ["the date", "das Datum", "la fecha"],
  "Scansione non riuscita. Controlla la connessione e riprova con una foto più nitida.": ["Scan failed. Check your connection and try again with a sharper photo.", "Scan fehlgeschlagen. Prüfe die Verbindung und versuche es mit einem schärferen Foto erneut.", "El escaneo falló. Revisa la conexión y prueba con una foto más nítida."],

  // Year view
  "Anno precedente": ["Previous year", "Vorheriges Jahr", "Año anterior"],
  "Anno successivo": ["Next year", "Nächstes Jahr", "Año siguiente"],
  "Mese per mese": ["Month by month", "Monat für Monat", "Mes a mes"],
  "Verde = entrate, rosso = uscite. Tocca un mese per aprirlo.": ["Green = income, red = expenses. Tap a month to open it.", "Grün = Einnahmen, Rot = Ausgaben. Tippe auf einen Monat, um ihn zu öffnen.", "Verde = ingresos, rojo = gastos. Toca un mes para abrirlo."],
  "Spesa media mensile: {0} (su {1} mese con movimenti)": ["Average monthly spending: {0} (over {1} month with activity)", "Durchschnittliche Monatsausgaben: {0} (über {1} Monat mit Buchungen)", "Gasto medio mensual: {0} (en {1} mes con movimientos)"],
  "Spesa media mensile: {0} (su {1} mesi con movimenti)": ["Average monthly spending: {0} (over {1} months with activity)", "Durchschnittliche Monatsausgaben: {0} (über {1} Monate mit Buchungen)", "Gasto medio mensual: {0} (en {1} meses con movimientos)"],
  "Nessun movimento in quest'anno.": ["No activity this year.", "Keine Buchungen in diesem Jahr.", "Sin movimientos este año."],
  "Nessuna uscita in quest'anno.": ["No expenses this year.", "Keine Ausgaben in diesem Jahr.", "Sin gastos este año."],

  // Settings: theme, categories, backup
  "Tema": ["Theme", "Design", "Tema"],
  "Automatico": ["Automatic", "Automatisch", "Automático"],
  "Chiaro": ["Light", "Hell", "Claro"],
  "Scuro": ["Dark", "Dunkel", "Oscuro"],
  "Categorie": ["Categories", "Kategorien", "Categorías"],
  "\"Altro\" è fissa. Se elimini una categoria, le sue transazioni passano ad \"Altro\".": [
    "\"Other\" is fixed. If you delete a category, its transactions move to \"Other\".",
    "\"Sonstiges\" ist fest. Wenn du eine Kategorie löschst, wandern ihre Buchungen zu \"Sonstiges\".",
    "\"Otros\" es fija. Si eliminas una categoría, sus transacciones pasan a \"Otros\"."],
  "Nuova categoria": ["New category", "Neue Kategorie", "Nueva categoría"],
  "Nuova categoria di uscita": ["New expense category", "Neue Ausgabenkategorie", "Nueva categoría de gasto"],
  "Nuova categoria di entrata": ["New income category", "Neue Einnahmenkategorie", "Nueva categoría de ingreso"],
  "Aggiungi": ["Add", "Hinzufügen", "Añadir"],
  "fissa": ["fixed", "fest", "fija"],
  "Rinomina": ["Rename", "Umbenennen", "Renombrar"],
  "Nuovo nome per \"{0}\":": ["New name for \"{0}\":", "Neuer Name für \"{0}\":", "Nuevo nombre para \"{0}\":"],
  "Eliminare \"{0}\"? Le sue transazioni passeranno ad \"Altro\".": ["Delete \"{0}\"? Its transactions will move to \"Other\".", "\"{0}\" löschen? Die Buchungen wandern zu \"Sonstiges\".", "¿Eliminar \"{0}\"? Sus transacciones pasarán a \"Otros\"."],
  "Categoria aggiunta.": ["Category added.", "Kategorie hinzugefügt.", "Categoría añadida."],
  "Categoria rinominata.": ["Category renamed.", "Kategorie umbenannt.", "Categoría renombrada."],
  "Categoria eliminata.": ["Category deleted.", "Kategorie gelöscht.", "Categoría eliminada."],
  "Scrivi il nome della categoria.": ["Type the category name.", "Gib den Namen der Kategorie ein.", "Escribe el nombre de la categoría."],
  "Il nome è troppo lungo (massimo 30 caratteri).": ["The name is too long (30 characters max).", "Der Name ist zu lang (maximal 30 Zeichen).", "El nombre es demasiado largo (máximo 30 caracteres)."],
  "Esiste già una categoria con questo nome.": ["A category with this name already exists.", "Eine Kategorie mit diesem Namen gibt es schon.", "Ya existe una categoría con este nombre."],
  "Backup": ["Backup", "Backup", "Copia de seguridad"],
  "I dati sono salvati solo su questo telefono. Esporta un backup ogni tanto.": ["Your data is saved only on this phone. Export a backup now and then.", "Die Daten werden nur auf diesem Handy gespeichert. Exportiere ab und zu ein Backup.", "Los datos se guardan solo en este teléfono. Exporta una copia de seguridad de vez en cuando."],
  "Esporta backup": ["Export backup", "Backup exportieren", "Exportar copia"],
  "Importa backup": ["Import backup", "Backup importieren", "Importar copia"],
  "Trovate {0} transazioni valide.\n\nOK = sostituisci i dati attuali\nAnnulla = aggiungi a quelli esistenti": [
    "Found {0} valid transactions.\n\nOK = replace the current data\nCancel = add to the existing data",
    "{0} gültige Buchungen gefunden.\n\nOK = aktuelle Daten ersetzen\nAbbrechen = zu den vorhandenen hinzufügen",
    "Se encontraron {0} transacciones válidas.\n\nAceptar = reemplazar los datos actuales\nCancelar = añadir a los existentes"],
  "Backup importato.": ["Backup imported.", "Backup importiert.", "Copia importada."],
  "File non valido: scegli un backup in formato JSON.": ["Invalid file: choose a backup in JSON format.", "Ungültige Datei: Wähle ein Backup im JSON-Format.", "Archivo no válido: elige una copia en formato JSON."],

  // Plans: installments and subscriptions
  "Nuovo pagamento a rate o abbonamento": ["New installment plan or subscription", "Neuer Ratenkauf oder neues Abo", "Nuevo pago a plazos o suscripción"],
  "Pagamento a rate": ["Installment plan", "Ratenzahlung", "Pago a plazos"],
  "Abbonamento (es. Netflix)": ["Subscription (e.g. Netflix)", "Abo (z. B. Netflix)", "Suscripción (p. ej. Netflix)"],
  "Cosa inserisci": ["What you enter", "Was du eingibst", "Qué introduces"],
  "Totale da rateizzare": ["Total to finance", "Zu finanzierender Gesamtbetrag", "Total a financiar"],
  "Importo di ogni rata": ["Amount of each payment", "Betrag jeder Rate", "Importe de cada cuota"],
  "Numero di rate": ["Number of payments", "Anzahl der Raten", "Número de cuotas"],
  "Una rata ogni": ["One payment every", "Eine Rate alle", "Un pago cada"],
  "Unità": ["Unit", "Einheit", "Unidad"],
  "settimane": ["weeks", "Wochen", "semanas"],
  "mesi": ["months", "Monate", "meses"],
  "anni": ["years", "Jahre", "años"],
  "Tasso d'interesse annuo, TAN % (facoltativo)": ["Annual interest rate, APR % (optional)", "Jahreszins, nominal % (optional)", "Tipo de interés anual, TIN % (opcional)"],
  "Data della prima rata": ["Date of the first payment", "Datum der ersten Rate", "Fecha de la primera cuota"],
  "Data del primo addebito": ["Date of the first charge", "Datum der ersten Abbuchung", "Fecha del primer cargo"],
  "Data di scadenza (facoltativa)": ["End date (optional)", "Enddatum (optional)", "Fecha de fin (opcional)"],
  "Se la data è nel passato, vengono inseriti anche i pagamenti già scaduti.": ["If the date is in the past, payments already due are added too.", "Liegt das Datum in der Vergangenheit, werden auch bereits fällige Zahlungen angelegt.", "Si la fecha es pasada, también se añaden los pagos ya vencidos."],
  "Crea piano": ["Create plan", "Plan erstellen", "Crear plan"],
  "Piani attivi": ["Active plans", "Aktive Pläne", "Planes activos"],
  "Nessun piano attivo.": ["No active plans.", "Keine aktiven Pläne.", "Sin planes activos."],
  "Elimina piano": ["Delete plan", "Plan löschen", "Eliminar plan"],
  "Totale da rateizzare (€)": ["Total to finance (€)", "Zu finanzierender Gesamtbetrag (€)", "Total a financiar (€)"],
  "Importo di ogni rata (€)": ["Amount of each payment (€)", "Betrag jeder Rate (€)", "Importe de cada cuota (€)"],
  "Importo dell'addebito (€)": ["Charge amount (€)", "Abbuchungsbetrag (€)", "Importe del cargo (€)"],
  "{0} rate da {1}{2}, {3}. Totale pagato: {4}{5}. Ultima rata il {6}.": [
    "{0} payments of {1}{2}, {3}. Total paid: {4}{5}. Last payment on {6}.",
    "{0} Raten à {1}{2}, {3}. Insgesamt gezahlt: {4}{5}. Letzte Rate am {6}.",
    "{0} cuotas de {1}{2}, {3}. Total pagado: {4}{5}. Última cuota el {6}."],
  "(l'ultima {0})": ["(the last one {0})", "(die letzte {0})", "(la última {0})"],
  ", di cui interessi {0}": [", of which interest {0}", ", davon Zinsen {0}", ", de los cuales intereses {0}"],
  "{0} {1}, dal {2}.": ["{0} {1}, from {2}.", "{0} {1}, ab {2}.", "{0} {1}, desde el {2}."],
  "Fino al {0}.": ["Until {0}.", "Bis {0}.", "Hasta el {0}."],
  "{0} rate, {1}": ["{0} payments, {1}", "{0} Raten, {1}", "{0} cuotas, {1}"],
  "TAN {0}%": ["APR {0}%", "Zins {0}%", "TIN {0}%"],
  "Pagate {0}/{1} · restano {2}": ["Paid {0}/{1} · {2} left", "Bezahlt {0}/{1} · {2} übrig", "Pagadas {0}/{1} · quedan {2}"],
  "Pagate {0}/{1} · completato": ["Paid {0}/{1} · completed", "Bezahlt {0}/{1} · abgeschlossen", "Pagadas {0}/{1} · completado"],
  "Prossimo addebito: {0}": ["Next charge: {0}", "Nächste Abbuchung: {0}", "Próximo cargo: {0}"],
  "Scade il {0}": ["Ends on {0}", "Endet am {0}", "Termina el {0}"],
  "Terminato il {0}": ["Ended on {0}", "Beendet am {0}", "Finalizado el {0}"],
  "Controlla descrizione e categoria.": ["Check description and category.", "Prüfe Beschreibung und Kategorie.", "Revisa la descripción y la categoría."],
  "Controlla importo, frequenza e data.": ["Check amount, frequency and date.", "Prüfe Betrag, Intervall und Datum.", "Revisa importe, frecuencia y fecha."],
  "Inserisci un numero di rate valido (da 1 a 360).": ["Enter a valid number of payments (1 to 360).", "Gib eine gültige Anzahl an Raten ein (1 bis 360).", "Introduce un número de cuotas válido (de 1 a 360)."],
  "Inserisci un tasso d'interesse valido (da 0 a 100).": ["Enter a valid interest rate (0 to 100).", "Gib einen gültigen Zinssatz ein (0 bis 100).", "Introduce un tipo de interés válido (de 0 a 100)."],
  "La scadenza non può essere prima della data di inizio.": ["The end date cannot be before the start date.", "Das Enddatum darf nicht vor dem Startdatum liegen.", "La fecha de fin no puede ser anterior a la de inicio."],
  "Piano a rate creato.": ["Installment plan created.", "Ratenplan erstellt.", "Plan a plazos creado."],
  "Abbonamento creato.": ["Subscription created.", "Abo erstellt.", "Suscripción creada."],
  "Piano eliminato.": ["Plan deleted.", "Plan gelöscht.", "Plan eliminado."],
  "Eliminare il piano? I pagamenti già scaduti restano nello storico, quelli futuri vengono rimossi.": [
    "Delete the plan? Payments already due stay in your history; future ones are removed.",
    "Plan löschen? Bereits fällige Zahlungen bleiben im Verlauf, künftige werden entfernt.",
    "¿Eliminar el plan? Los pagos ya vencidos se quedan en el historial; los futuros se eliminan."],

  // Default categories
  "Stipendio": ["Salary", "Gehalt", "Nómina"],
  "Lavoro extra": ["Side job", "Nebenjob", "Trabajo extra"],
  "Regali": ["Gifts", "Geschenke", "Regalos"],
  "Rimborsi": ["Refunds", "Erstattungen", "Reembolsos"],
  "Altro": ["Other", "Sonstiges", "Otros"],
  "Casa": ["Home", "Wohnen", "Casa"],
  "Alimentari": ["Groceries", "Lebensmittel", "Alimentación"],
  "Trasporti": ["Transport", "Verkehr", "Transporte"],
  "Ristoranti": ["Restaurants", "Restaurants", "Restaurantes"],
  "Svago": ["Leisure", "Freizeit", "Ocio"],
  "Salute": ["Health", "Gesundheit", "Salud"],
  "Abbigliamento": ["Clothing", "Kleidung", "Ropa"],
  "Abbonamenti": ["Subscriptions", "Abos", "Suscripciones"],
  "Viaggi": ["Travel", "Reisen", "Viajes"],
};

let currentLang = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY_LANGUAGE));
    return LOCALES[stored] ? stored : "it";
  } catch (err) {
    return "it";
  }
})();

function hasEntry(key) {
  return Object.prototype.hasOwnProperty.call(DICT, key);
}

// Translate a message and fill {0}, {1}... with the given values.
function tr(key, ...args) {
  const index = LANG_INDEX[currentLang];
  const text = index !== undefined && hasEntry(key) ? DICT[key][index] : key;
  return text.replace(/\{(\d+)\}/g, (match, n) => (args[n] !== undefined ? args[n] : match));
}

function everyLabel(interval, unit) {
  const table = FREQ[currentLang];
  const i = ["weeks", "months", "years"].indexOf(unit);
  return interval === 1 ? table.one[i] : table.many[i].replace("{0}", interval);
}

// Translates every known text and attribute inside `root`. Original Italian text is kept
// on the node, so the language can be switched back and forth.
function translateTree(root) {
  const index = LANG_INDEX[currentLang];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "PRE", "TEXTAREA"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return parent.closest('[translate="no"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const source = node.__it !== undefined ? node.__it : node.nodeValue;
    const key = source.trim();
    if (!key) return;
    if (index === undefined) {
      if (node.__it !== undefined) node.nodeValue = node.__it;
      return;
    }
    if (!hasEntry(key)) return;
    if (node.__it === undefined) node.__it = source;
    node.nodeValue = source.replace(key, DICT[key][index]);
  });

  root.querySelectorAll("[placeholder],[aria-label]").forEach((el) => {
    el.__itAttrs = el.__itAttrs || {};
    ["placeholder", "aria-label"].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      if (el.__itAttrs[attr] === undefined) el.__itAttrs[attr] = el.getAttribute(attr);
      const source = el.__itAttrs[attr];
      el.setAttribute(attr, index !== undefined && hasEntry(source) ? DICT[source][index] : source);
    });
  });
}
