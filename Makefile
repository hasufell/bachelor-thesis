include common.mk


all: Bachelorthesis Handbuch

Bachelorthesis:
	$(MAKE) -C Bachelorthesis
	$(LN_S) Bachelorthesis/Bachelorthesis.pdf .

Handbuch:
	$(MAKE) -C Implementierung
	$(LN_S) Implementierung/Handbuch.pdf .

clean:
	$(MAKE) -C Bachelorthesis clean
	$(MAKE) -C Implementierung clean
	$(RM) Bachelorthesis.pdf Handbuch.pdf


.PHONY: all clean Bachelorthesis Handbuch

