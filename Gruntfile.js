module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            files: ['src/coffee/*.coffee', 'src/coffee/Classes/*.coffee'],
            tasks: ['concat', 'coffee', 'uglify']
        },
        concat: {
            dist: {
                src: [
                    'src/coffee/config.coffee',
                    'src/coffee/Classes/Keyboard.coffee',
                    'src/coffee/Classes/Game.coffee',
                    'src/coffee/Classes/CollisionManager.coffee',
                    'src/coffee/Classes/Player.coffee',
                    'src/coffee/Classes/ControllablePlayer.coffee',
                    'src/coffee/Classes/Cube.coffee',
                    'src/coffee/Classes/FallingCube.coffee',
                    'src/coffee/Classes/CubeManager.coffee',
                    'src/coffee/Classes/LevelManager.coffee',
                    'src/coffee/Classes/Arena.coffee',
                    'src/coffee/main.coffee',
                    'src/coffee/events.coffee'
                ],
                dest: 'src/tmp/app.coffee'
            }
        },
        coffee: {
            compile: {
                files: {
                    'js/app.js': ['src/tmp/app.coffee']
                }
            }
        },
        uglify: {
            build: {
                src: 'js/app.js',
                dest: 'js/app.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', 'watch');
};