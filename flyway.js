module.exports = function() {
    return {
        flywayArgs: {
            url: 'jdbc:postgresql://localhost:15432/myapp',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            locations: 'filesystem:./src/db/migrations',
        }
    }
}
