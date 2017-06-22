module.exports = function(grunt) {

    grunt.initConfig({

        jasmine_nodejs: {
            // task specific (default) options
            options: {
                useHelpers: true,
                // global helpers, available to all task targets. accepts globs..
                helpers: [],
                random: false,
                seed: null,
                defaultTimeout: null, // defaults to 5000
                stopOnFailure: false,
                traceFatal: true,
                // configure one or more built-in reporters
                reporters: {
                    console: {
                        colors: true,        // (0|false)|(1|true)|2
                        cleanStack: 1,       // (0|false)|(1|true)|2|3
                        verbosity: 4,        // (0|false)|1|2|3|(4|true)
                        listStyle: "indent", // "flat"|"indent"
                        activity: false
                    },
                    // junit: {
                    //     savePath: "./reports",
                    //     filePrefix: "junit-report",
                    //     consolidate: true,
                    //     useDotNotation: true
                    // },
                    // nunit: {
                    //     savePath: "./reports",
                    //     filename: "nunit-report.xml",
                    //     reportName: "Test Results"
                    // },
                    // terminal: {
                    //     color: false,
                    //     showStack: false,
                    //     verbosity: 2
                    // },
                    // teamcity: true,
                    // tap: true
                },
                // add custom Jasmine reporter(s)
                customReporters: []
            },
            alexa_tests: {
                // target specific options
                options: {
                    useHelpers: true
                },
                // spec files
                specs: [
                    "spec/**/*[sS]pec.js",
                ],
                // target-specific helpers
                helpers: [
                    "helpers/**/*.js"
                ]
            }
        },
        watch: {
            scripts: {
                files: ['*.js'],
                tasks: ['jasmine_nodejs'],
                options: {
                    spawn: false,
                    event:['all']
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.registerTask( 'default', [ 'jasmine_nodejs'] );
};