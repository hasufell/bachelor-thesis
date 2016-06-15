include ../common.mk


all: Handbuch.pdf

Handbuch.pdf: Handbuch.md
	$(PANDOC) $^ --latex-engine=xelatex -o $@

clean:
	$(RM) Handbuch.pdf

.PHONY: all clean

