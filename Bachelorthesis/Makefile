include ../common.mk


LATEX_FILES = \
	Content/Abstract.tex \
	Content/AlternativeLoesungen.tex \
	Content/AlternativeLoesungen/Bewertung.tex \
	Content/AlternativeLoesungen/DarkMail.tex \
	Content/Entwicklung.tex \
	Content/Entwicklung/IdeaConcept.tex \
	Content/Entwicklung/IdeaConcept/Algorithmus.tex \
	Content/Entwicklung/Methoden.tex \
	Content/Entwicklung/Realisierung.tex \
	Content/Entwicklung/Realisierung/Implementierung.tex \
	Content/Entwicklung/Realisierung/Implementierung/Einsprungpunkt.tex \
	Content/Entwicklung/Realisierung/Implementierung/Haraka.tex \
	Content/Entwicklung/Realisierung/Implementierung/Konfiguration.tex \
	Content/Entwicklung/Realisierung/Implementierung/MTA-Entscheider.tex \
	Content/Entwicklung/Realisierung/Implementierung/SMTP-gateway.tex \
	Content/Entwicklung/Realisierung/Implementierung/Wahl.tex \
	Content/Entwicklung/Realisierung/Testsystem.tex \
	Content/EvaluationValidation.tex \
	Content/Intro.tex \
	Content/Intro/Format.tex \
	Content/Intro/Gesamtsystem.tex \
	Content/Intro/Protokolle.tex \
	Content/Intro/Protokolle/IMAP4.tex \
	Content/Intro/Protokolle/POP3.tex \
	Content/Intro/Protokolle/SMTP.tex \
	Content/ListOfAbbreviations/ListOfAbbreviations.tex \
	Content/LookOut.tex \
	Content/LookOut/PraktischeProbleme.tex \
	Content/LookOut/PraktischeProbleme/DirectoryServer.tex \
	Content/LookOut/PraktischeProbleme/Fehlerbehandlung.tex \
	Content/LookOut/PraktischeProbleme/Gesamtsystem.tex \
	Content/LookOut/PraktischeProbleme/Implementierung.tex \
	Content/LookOut/PraktischeProbleme/Spam.tex \
	Content/LookOut/PraktischeProbleme/Verify.tex \
	Content/LookOut/PraktischeProbleme/Zuverlaessigkeit.tex \
	Content/LookOut/TheoretischeProbleme.tex \
	Content/LookOut/TheoretischeProbleme/KryptografieSystem.tex \
	Content/LookOut/TheoretischeProbleme/PublicKey.tex \
	Content/LookOut/TheoretischeProbleme/RoutingAlgo.tex \
	Content/LookOut/TheoretischeProbleme/Spezifikation.tex \
	Content/LookOut/TheoretischeProbleme/Verschluesselung.tex \
	Content/Problematik.tex \
	Content/Problematik/Anforderungen.tex \
	Content/Problematik/BetrachtungDatenschutz.tex \
	Content/Problematik/BetrachtungDatenschutz/Anonymitaet.tex \
	Content/Problematik/BetrachtungDatenschutz/Anonymitaet/TorBirdy.tex \
	Content/Problematik/BetrachtungDatenschutz/Bewertung.tex \
	Content/Problematik/BetrachtungDatenschutz/Verschluesselung.tex \
	Content/Problematik/BetrachtungDatenschutz/Verschluesselung/GPG.tex \
	Content/Problematik/BetrachtungDatenschutz/Verschluesselung/STARTTLS.tex \
	Content/Problematik/BetrachtungDatenschutz/Verschluesselung/TLS.tex \
	Content/Settings.tex \
	Content/StatutoryDeclaration/StatutoryDeclaration.tex \
	Content/TitlePage.tex


all: Bachelorthesis.pdf

Bachelorthesis.dvi: Bachelorthesis.tex $(LATEX_FILES)
	$(LATEX) $<
	$(BIBTEX) Bachelorthesis.aux
	$(LATEX) $<
	$(LATEX) $<

Bachelorthesis.pdf: Bachelorthesis.tex $(LATEX_FILES)
	$(PDFLATEX) $<
	$(BIBTEX) Bachelorthesis.aux
	$(PDFLATEX) $<
	$(PDFLATEX) $<

clean:
	$(RM) Bachelorthesis.dvi Bachelorthesis.pdf *.log *.aux *.nav *.snm *.toc *.out *.vrb *.gz *.bbl *.blg *.idx *.lof *.lol *.lot

.PHONY: all clean Bachelorthesis.dvi Bachelorthesis.pdf

