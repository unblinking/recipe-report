# Successfully created PostgreSQL dev virtual machine.

Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 15432)  

```
Host:     localhost
Port:     15432
Database: recipedb
Username: dbuser
Password: dbpass
```

## Access the Vagrant VM  

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

## Connection string for development  

Env variable for application development:  

```
DATABASE_URL=postgresql://dbuser:dbpass@localhost:15432/recipedb
```

## Access the db via local command

Connect via psql as dbuser:  

```
PGUSER=dbuser PGPASSWORD=dbpass psql -h localhost -p 15432 recipedb
```

Connect via psql as dbowner:  

```
PGUSER=dbowner PGPASSWORD=dbpass psql -h localhost -p 15432 recipedb
```

## Rollback all migrations  

First, connect to the database via psql as dbowner. Then run these SQL commands.  

```sql
DROP SCHEMA rr CASCADE;
DROP TABLE flyway_schema_history;
```
