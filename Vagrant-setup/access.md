# Successfully created PostgreSQL dev virtual machine.

Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 15432)  

```
Host:     localhost
Port:     15432
Database: recipedb
Username: dbuser
Password: dbpass
```

Admin access to postgres user via VM:  

```bash
vagrant ssh
sudo su - postgres
```

psql access to app database user via VM:  

```bash
vagrant ssh
sudo su - postgres
PGUSER=dbuser PGPASSWORD=dbpass psql -h localhost recipedb
```

Env variable for application development:  

```
DATABASE_URL=postgresql://dbuser:dbpass@localhost:15432/recipedb
```

Local command to access the database via psql:  

```
PGUSER=dbuser PGPASSWORD=dbpass psql -h localhost -p 15432 recipedb
```

Rollback all migrations:

```sql
DROP SCHEMA rr CASCADE;
DROP TABLE flyway_schema_history;
```