all:
	# sentinel
	@./node_modules/.bin/browserify -t [ babelify --presets [ es2015 ] --plugins [ transform-regenerator transform-runtime ] ] -t uglifyify ./common.js > build.js

	# uglify
	./node_modules/.bin/uglifyjs build.js -p 5 -c -m -o build.js
