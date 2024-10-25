.PHONY: build
build: lib/Example.ts

target/example-Example.json: contract/src/main.nr contract/Nargo.toml
	aztec-nargo compile --silence-warnings

lib/Example.ts: target/example-Example.json
	aztec codegen --force $^ -o lib
	# Workaround for codegen bug
	sed -i -e 's/as NoirCompiledContract/as unknown as NoirCompiledContract/g' $@

.PHONY: clean
clean:
	rm -fr target lib/Example.ts codegenCache.json
