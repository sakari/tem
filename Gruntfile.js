module.exports = function(grunt) {
    grunt.initConfig({

        typescript: {
            all: {
                src: ['test/**/*.ts'],
                dest: 'build',
                options: {
                    module: 'commonj',
                    target: 'es5',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: true,
                    noImplicitAny: true
                }
            }
        },
        
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd'
            },
            all: { src: ['build/test/**/*.js'] }
        },
        
        clean: ['build']
    });
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.registerTask('build', ['clean', 'typescript']);
    grunt.registerTask('test', ['build', 'simplemocha']);
}
