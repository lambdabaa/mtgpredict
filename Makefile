export PATH :=$(shell npm bin):$(PATH)

JS = $(shell find js/ -name "*.js")
BUILD = $(patsubst js/%.js, build/%.js, $(JS))

.PHONY: all
all: $(BUILD)

build/%.js: js/%.js
	@mkdir -p "$(@D)"
	babel -o $@ $<
