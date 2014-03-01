module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            app: {
                files: ['src/coffee/app/*.coffee', 'src/coffee/app/Classes/*.coffee', 'src/coffee/app/Classes/Bosses/*.coffee'],
                tasks: ['concat:app', 'coffee:app']
            },
            server: {
                files: ['src/coffee/server/*.coffee', 'src/coffee/server/Classes/*.coffee', 'src/coffee/server/Classes/Bosses/*.coffee'],
                tasks: ['concat:server', 'coffee:server']
            }
        },
        concat: {
            app: {
                src: [
                    'src/coffee/app/config.coffee',
                    'src/coffee/app/Classes/Keyboard.coffee',
                    'src/coffee/app/Classes/Game.coffee',
                    'src/coffee/app/Classes/ContentLoader.coffee',
                    'src/coffee/app/Classes/CollisionManager.coffee',
                    'src/coffee/app/Classes/Player.coffee',
                    'src/coffee/app/Classes/ControllablePlayer.coffee',
                    'src/coffee/app/Classes/VirtualPlayer.coffee',
                    'src/coffee/app/Classes/Cube.coffee',
                    'src/coffee/app/Classes/FallingCube.coffee',
                    'src/coffee/app/Classes/StaticCube.coffee',
                    'src/coffee/app/Classes/SpecialCube.coffee',
                    'src/coffee/app/Classes/RandomEvent.coffee',
                    'src/coffee/app/Classes/CubeFragment.coffee',
                    'src/coffee/app/Classes/Bonus.coffee',
                    'src/coffee/app/Classes/BonusManager.coffee',
                    'src/coffee/app/Classes/LevelManager.coffee',
                    'src/coffee/app/Classes/CubeManager.coffee',
                    'src/coffee/app/Classes/NetworkManager.coffee',
                    'src/coffee/app/Classes/SkinManager.coffee',
                    'src/coffee/app/Classes/Arena.coffee',
                    'src/coffee/app/Classes/HUD.coffee',
                    'src/coffee/app/Classes/Effect.coffee',
                    'src/coffee/app/Classes/Bosses/Boss.coffee',
                    'src/coffee/app/Classes/Bosses/MultiPartBoss.coffee',
                    'src/coffee/app/Classes/Bosses/BossManager.coffee',
                    'src/coffee/app/Classes/Bosses/RoueMan.coffee',
                    'src/coffee/app/Classes/Bosses/FreezeMan.coffee',
                    'src/coffee/app/Classes/Bosses/FreezeManPart.coffee',
                    'src/coffee/app/Classes/Bosses/PoingMan.coffee',
                    'src/coffee/app/Classes/Bosses/LabiMan.coffee',
                    'src/coffee/app/Classes/Bosses/LabiManPart.coffee',
                    'src/coffee/app/Classes/Bosses/SparkMan.coffee',
                    'src/coffee/app/Classes/Bosses/SparkManPart.coffee',
                    'src/coffee/app/Classes/Bosses/HomingMan.coffee',
                    'src/coffee/app/Classes/Bosses/HomingManPart.coffee',
                    'src/coffee/app/Classes/Bosses/MissileMan.coffee',
                    'src/coffee/app/Classes/Bosses/MissileManPart.coffee',
                    'src/coffee/app/main.coffee',
                    'src/coffee/app/events.coffee'
                ],
                dest: 'src/tmp/app.coffee'
            },
            server: {
                src: [
                    'src/coffee/server/config.coffee',
                    'src/coffee/server/Classes/Game.coffee',
                    'src/coffee/server/Classes/CubeManager.coffee',
                    'src/coffee/server/Classes/LevelManager.coffee',
                    'src/coffee/server/Classes/NetworkManager.coffee',
                    'src/coffee/server/Classes/Bosses/Boss.coffee',
                    'src/coffee/server/Classes/Bosses/BossManager.coffee',
                    'src/coffee/server/Classes/Bosses/RoueMan.coffee',
                    'src/coffee/server/Classes/Bosses/FreezeMan.coffee',
                    'src/coffee/server/Classes/Bosses/PoingMan.coffee',
                    'src/coffee/server/Classes/Bosses/LabiMan.coffee',
                    'src/coffee/server/Classes/Bosses/SparkMan.coffee',
                    'src/coffee/server/Classes/Bosses/HomingMan.coffee',
                    'src/coffee/server/Classes/Bosses/MissileMan.coffee',
                    'src/coffee/server/main.coffee'
                ],
                dest: 'src/tmp/server.coffee'
            }
        },
        coffee: {
            app: {
                files: {
                    'app/js/app.js': ['src/tmp/app.coffee']
                }
            },
            server: {
                files: {
                    'server/server.js': ['src/tmp/server.coffee']
                }
            }
        },
        uglify: {
            app: {
                src: 'app/js/app.js',
                dest: 'app/js/app.min.js'
            },
            server: {
                src: 'server/server.js',
                dest: 'server/server.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', 'watch');
};