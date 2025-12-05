import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8');
            envFile.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('Loaded .env.local');
        } else {
            console.log('.env.local not found');
        }
    } catch (e) {
        console.log('Error reading .env.local', e);
    }
}

loadEnv();

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

// Clean up connection string if it contains psql command or quotes
if (connectionString.includes('psql')) {
    const match = connectionString.match(/postgresql:\/\/[^'"]+/);
    if (match) {
        connectionString = match[0];
        console.log('Extracted connection string from psql command');
    }
}

// Remove any surrounding quotes just in case
connectionString = connectionString.replace(/^['"]|['"]$/g, '');

const sql = neon(connectionString);

async function runMigration() {
    try {
        const schemaPath = path.join(process.cwd(), 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');

        // Robust split function that respects $$ quotes
        function splitSql(sqlText) {
            const statements = [];
            let currentStatement = '';
            let inDollarQuote = false;
            let dollarQuoteTag = '';

            for (let i = 0; i < sqlText.length; i++) {
                const char = sqlText[i];
                const nextChar = sqlText[i + 1];

                // Check for dollar quote start/end
                if (char === '$' && nextChar === '$') {
                    if (inDollarQuote) {
                        // Potential end of dollar quote
                        inDollarQuote = false;
                    } else {
                        // Start of dollar quote
                        inDollarQuote = true;
                    }
                    currentStatement += char;
                    continue;
                }

                if (char === ';' && !inDollarQuote) {
                    if (currentStatement.trim().length > 0) {
                        statements.push(currentStatement.trim());
                    }
                    currentStatement = '';
                } else {
                    currentStatement += char;
                }
            }

            if (currentStatement.trim().length > 0) {
                statements.push(currentStatement.trim());
            }

            return statements;
        }

        const statements = splitSql(schema);

        for (const statement of statements) {
            // Skip empty statements
            if (!statement) continue;

            console.log(`Executing statement: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`);
            try {
                await sql(statement);
            } catch (e) {
                console.error('Error executing statement:', e.message);
                // Continue or throw? 
                // For now, let's log and continue, as some might fail if they exist
                if (!e.message.includes('already exists')) {
                    throw e;
                }
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
